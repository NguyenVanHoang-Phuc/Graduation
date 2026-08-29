namespace Domain.Base;

public interface IModificationTracked
{
    DateTime? UpdatedAt { get; }
}
