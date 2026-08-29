using Application.DTOs;

namespace Application.Interfaces.Services;

public interface ICeremonyService
{
    Task<CeremonyInfoDto> GetCeremonyInfoAsync(CancellationToken cancellationToken = default);
    Task<SummaryStatsDto> GetSummaryStatsAsync(CancellationToken cancellationToken = default);
    Task<CeremonyInfoDto> UpdateCeremonyInfoAsync(UpdateCeremonyDto dto, CancellationToken cancellationToken = default);
}
