using Application.Interfaces.Repositories;
using Infrastructure.Persistence;

namespace Infrastructure.Implementations.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly GraduationDbContext _context;

    public IGuestRsvpRepository Rsvps { get; }
    public IGraduationWishRepository Wishes { get; }
    public ICeremonySettingRepository CeremonySettings { get; }

    public UnitOfWork(
        GraduationDbContext context,
        IGuestRsvpRepository rsvps,
        IGraduationWishRepository wishes,
        ICeremonySettingRepository ceremonySettings)
    {
        _context = context;
        Rsvps = rsvps;
        Wishes = wishes;
        CeremonySettings = ceremonySettings;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
