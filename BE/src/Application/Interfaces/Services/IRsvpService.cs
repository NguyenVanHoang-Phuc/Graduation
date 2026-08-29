using Application.Common.Models;
using Application.DTOs;

namespace Application.Interfaces.Services;

public interface IRsvpService
{
    Task<RsvpDto> CreateRsvpAsync(CreateRsvpDto dto, CancellationToken cancellationToken = default);
    Task<RsvpDto?> GetRsvpByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<PaginatedResult<RsvpDto>> GetAllRsvpsAsync(PaginationQuery query, CancellationToken cancellationToken = default);
    Task<RsvpDto> CheckInGuestAsync(string code, CancellationToken cancellationToken = default);
}
