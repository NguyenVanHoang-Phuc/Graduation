using Domain.Base;

namespace Domain.Entities;

public class GraduationWish : BaseEntity
{
    public string SenderName { get; set; } = string.Empty;
    public string? Relationship { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? AvatarBgColor { get; set; }
    public string? Emoji { get; set; }
    public int LikesCount { get; set; } = 0;
    public bool IsApproved { get; set; } = true;

    public void Like()
    {
        LikesCount++;
        UpdatedAt = DateTime.UtcNow;
    }
}
