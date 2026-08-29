namespace Application.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    IGuestRsvpRepository Rsvps { get; }
    IGraduationWishRepository Wishes { get; }
    ICeremonySettingRepository CeremonySettings { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
