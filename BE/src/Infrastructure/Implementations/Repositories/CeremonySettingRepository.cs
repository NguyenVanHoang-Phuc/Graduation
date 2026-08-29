using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Implementations.Repositories;

public class CeremonySettingRepository : GenericRepository<CeremonySetting>, ICeremonySettingRepository
{
    public CeremonySettingRepository(GraduationDbContext context) : base(context)
    {
    }

    public async Task<CeremonySetting?> GetCurrentSettingAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.OrderBy(x => x.CreatedAt).FirstOrDefaultAsync(cancellationToken);
    }
}
