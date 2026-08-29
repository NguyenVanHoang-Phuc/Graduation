namespace Application.Interfaces.Services;

public interface IEmailService
{
    Task SendRsvpThankYouEmailAsync(
        string toEmail,
        string guestName,
        string attendanceStatus,
        int numberOfGuests,
        CancellationToken cancellationToken = default);
}
