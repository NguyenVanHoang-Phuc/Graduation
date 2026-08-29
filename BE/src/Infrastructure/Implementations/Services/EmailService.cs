using System.Net;
using System.Net.Mail;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Implementations.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;
    private readonly IUnitOfWork _unitOfWork;

    public EmailService(
        IConfiguration configuration,
        ILogger<EmailService> logger,
        IUnitOfWork unitOfWork)
    {
        _configuration = configuration;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task SendRsvpThankYouEmailAsync(
        string toEmail,
        string guestName,
        string attendanceStatus,
        int numberOfGuests,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            return;
        }

        try
        {
            var ceremony = await _unitOfWork.CeremonySettings.GetCurrentSettingAsync(cancellationToken);
            var graduateName = ceremony?.GraduateName ?? "Nguyễn Văn Hoàng Phúc";
            var ceremonyDate = "Thứ Bảy, 12 Tháng 9, 2026 (08:00 AM)";
            var venue = ceremony?.VenueName ?? "Trường Đại học FPT Đà Nẵng";
            var address = ceremony?.Address ?? "Khu Đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng";

            string statusText = attendanceStatus switch
            {
                "Attending" => "Tham dự toàn bộ (Buổi lễ & Tiệc mừng)",
                "AttendingCeremonyOnly" => "Chỉ tham dự Buổi Lễ Tốt Nghiệp",
                "AttendingPartyOnly" => "Chỉ tham dự Tiệc Mừng Thân Mật",
                "NotAttending" => "Rất tiếc không thể tham dự và gửi lời chúc từ xa",
                _ => attendanceStatus
            };

            var host = _configuration["Smtp:Host"] ?? _configuration["SMTP_HOST"] ?? "smtp.gmail.com";
            var portStr = _configuration["Smtp:Port"] ?? _configuration["SMTP_PORT"] ?? "587";
            int.TryParse(portStr, out var port);
            if (port <= 0) port = 587;

            var username = _configuration["Smtp:Username"] ?? _configuration["SMTP_USERNAME"] ?? "hoangphucnguyenvan1@gmail.com";
            var password = _configuration["Smtp:Password"] ?? _configuration["SMTP_PASSWORD"] ?? "";
            password = password.Replace(" ", "").Trim();
            var fromEmail = _configuration["Smtp:FromEmail"] ?? _configuration["SMTP_FROM_EMAIL"] ?? username;
            var fromName = _configuration["Smtp:FromName"] ?? _configuration["SMTP_FROM_NAME"] ?? $"{graduateName} - Lễ Tốt Nghiệp";

            var htmlBody = BuildThankYouHtml(
                guestName: guestName,
                graduateName: graduateName,
                statusText: statusText,
                numberOfGuests: numberOfGuests,
                ceremonyDate: ceremonyDate,
                venue: venue,
                address: address
            );

            if (string.IsNullOrWhiteSpace(password))
            {
                _logger.LogInformation(
                    "SMTP password not set. Thank you email for {GuestName} ({Email}) logged successfully.",
                    guestName, toEmail);
                return;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(fromEmail, fromName),
                Subject = $"Thư Cảm Ơn Xác Nhận Tham Dự Lễ Tốt Nghiệp - {graduateName}",
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(toEmail);

            using var smtpClient = new SmtpClient(host, port)
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                Timeout = 15000
            };

            await smtpClient.SendMailAsync(message, cancellationToken);
            _logger.LogInformation("Thank you email sent successfully to {Email} for guest {GuestName}", toEmail, guestName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send thank you email to {Email}", toEmail);
        }
    }

    private static string BuildThankYouHtml(
        string guestName,
        string graduateName,
        string statusText,
        int numberOfGuests,
        string ceremonyDate,
        string venue,
        string address)
    {
        return $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
  <meta charset=""UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <title>Thank You - {graduateName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono&display=swap');
    body {{
      margin: 0;
      padding: 0;
      background-color: #ede8df;
      font-family: 'Playfair Display', Georgia, serif;
      color: #2b1f1a;
      -webkit-font-smoothing: antialiased;
    }}
    .wrapper {{
      width: 100%;
      table-layout: fixed;
      background-color: #ede8df;
      padding: 40px 15px;
    }}
    .card {{
      max-width: 600px;
      margin: 0 auto;
      background-color: #faf6ef;
      background-image: radial-gradient(#d6c7b2 0.75px, transparent 0.75px);
      background-size: 16px 16px;
      border: 1px solid #d4c5b3;
      border-radius: 12px;
      padding: 45px 35px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.08);
      position: relative;
      text-align: center;
    }}
    .ribbon-tl {{
      position: absolute;
      top: 18px;
      left: 18px;
      width: 50px;
      opacity: 0.85;
    }}
    .ribbon-br {{
      position: absolute;
      bottom: 18px;
      right: 18px;
      width: 50px;
      opacity: 0.85;
    }}
    .business-name {{
      font-family: 'Space Mono', monospace, Courier;
      font-size: 11px;
      letter-spacing: 3.5px;
      text-transform: uppercase;
      color: #a82020;
      margin-bottom: 20px;
      font-weight: 600;
    }}
    .thank-you-title {{
      font-family: 'Great Vibes', 'Brush Script MT', cursive;
      font-size: 64px;
      line-height: 1.1;
      color: #b51a1a;
      margin: 10px 0 25px 0;
      text-shadow: 0 1px 2px rgba(181, 26, 26, 0.15);
    }}
    .divider-line {{
      height: 1px;
      background: linear-gradient(to right, transparent, #b51a1a, transparent);
      width: 60%;
      margin: 0 auto 25px auto;
    }}
    .guest-greeting {{
      font-size: 16px;
      font-weight: bold;
      color: #1a1614;
      margin-bottom: 12px;
    }}
    .message-text {{
      font-family: 'Space Mono', monospace, Courier;
      font-size: 12px;
      line-height: 1.8;
      color: #8c1d1d;
      margin: 0 auto 25px auto;
      max-width: 480px;
    }}
    .details-box {{
      background: #f3ece0;
      border: 1px dashed #c4ad95;
      border-radius: 8px;
      padding: 18px 20px;
      text-align: left;
      margin: 25px 0;
      font-size: 13px;
      line-height: 1.6;
      color: #382c26;
    }}
    .details-box strong {{
      color: #8c1d1d;
    }}
    .footer-links {{
      font-family: 'Space Mono', monospace, Courier;
      font-size: 10.5px;
      color: #992222;
      letter-spacing: 1px;
      border-top: 1px solid #e3d5c4;
      padding-top: 20px;
      margin-top: 30px;
    }}
    .footer-links a {{
      color: #992222;
      text-decoration: none;
      font-weight: bold;
    }}
  </style>
</head>
<body>
  <div class=""wrapper"">
    <div class=""card"">
      
      <!-- Top Business / Graduate Name Header -->
      <div class=""business-name"">
        {graduateName} • GRADUATION 2026
      </div>

      <!-- Calligraphy Thank You Title (Vintage Crimson Red) -->
      <h1 class=""thank-you-title"">
        Thank You!
      </h1>

      <div class=""divider-line""></div>

      <!-- Personal Greeting -->
      <div class=""guest-greeting"">
        Kính gửi: {guestName}
      </div>

      <!-- Vintage Ribbon Message -->
      <p class=""message-text"">
        Cảm ơn bạn đã gửi phản hồi tham dự Lễ Tốt Nghiệp của Phúc! Sự hiện diện và những lời chúc tốt đẹp của bạn là món quà quý giá tiếp thêm động lực cho chặng đường phía trước.
      </p>

      <!-- Confirmation Details Box -->
      <div class=""details-box"">
        <div><strong>📍 Địa điểm:</strong> {venue}</div>
        <div style=""font-size: 11.5px; color: #6b584d; margin-bottom: 6px;"">{address}</div>
        <div><strong>📅 Thời gian:</strong> {ceremonyDate}</div>
        <div><strong>✨ Trạng thái:</strong> {statusText}</div>
        {(numberOfGuests > 0 ? $"<div><strong>👥 Số lượng tham dự:</strong> {numberOfGuests} người</div>" : "")}
      </div>

      <!-- Emotional Quote -->
      <p style=""font-style: italic; font-size: 12px; color: #5c483d; margin: 15px 0;"">
        &ldquo;Hẹn gặp lại bạn tại ngày Lễ Tốt Nghiệp để cùng nhau ghi dấu những khoảnh khắc đáng nhớ nhất!&rdquo;
      </p>

      <!-- Footer Info -->
      <div class=""footer-links"">
        <span>hoangphucnguyenvan1@gmail.com</span>
        <span> | </span>
        <a href=""https://graduation-nine-rho.vercel.app"" target=""_blank"">graduation-nine-rho.vercel.app</a>
      </div>

    </div>
  </div>
</body>
</html>";
    }
}
