namespace Application.DTOs;

public class WishDto
{
    public Guid Id { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? Relationship { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? AvatarBgColor { get; set; }
    public string? Emoji { get; set; }
    public int LikesCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateWishDto
{
    public string SenderName { get; set; } = string.Empty;
    public string? Relationship { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? AvatarBgColor { get; set; }
    public string? Emoji { get; set; }
}
