using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface ICeremonySettingRepository : IRepository<CeremonySetting>
{
    Task<CeremonySetting?> GetCurrentSettingAsync(CancellationToken cancellationToken = default);
}
