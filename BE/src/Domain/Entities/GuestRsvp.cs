using Domain.Base;
using Domain.Enums;

namespace Domain.Entities;

public class GuestRsvp : BaseEntity
{
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public AttendanceStatus AttendanceStatus { get; set; } = AttendanceStatus.Attending;
    public int NumberOfGuests { get; set; } = 1;
    public string? Notes { get; set; }
    public string CheckInCode { get; set; } = string.Empty;
    public bool IsCheckedIn { get; set; }
    public DateTime? CheckedInAt { get; set; }

    public GuestRsvp()
    {
        CheckInCode = GenerateCheckInCode();
    }

    public static string GenerateCheckInCode()
    {
        const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var random = new Random();
        return new string(Enumerable.Repeat(chars, 6).Select(s => s[random.Next(s.Length)]).ToArray());
    }

    public void MarkCheckedIn()
    {
        IsCheckedIn = true;
        CheckedInAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }
}
