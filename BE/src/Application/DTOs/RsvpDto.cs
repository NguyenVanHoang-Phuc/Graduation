using Domain.Enums;

namespace Application.DTOs;

public class RsvpDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public AttendanceStatus AttendanceStatus { get; set; }
    public int NumberOfGuests { get; set; }
    public string? Notes { get; set; }
    public string CheckInCode { get; set; } = string.Empty;
    public bool IsCheckedIn { get; set; }
    public DateTime? CheckedInAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateRsvpDto
{
    public string FullName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public AttendanceStatus AttendanceStatus { get; set; } = AttendanceStatus.Attending;
    public int NumberOfGuests { get; set; } = 1;
    public string? Notes { get; set; }
}

public class CheckInDto
{
    public string CheckInCode { get; set; } = string.Empty;
}
