using Application.Common.Models;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IGuestRsvpRepository : IRepository<GuestRsvp>
{
    Task<GuestRsvp?> GetByCodeAsync(string checkInCode, CancellationToken cancellationToken = default);
    Task<PaginatedResult<GuestRsvp>> GetPaginatedAsync(PaginationQuery query, CancellationToken cancellationToken = default);
    Task<int> GetTotalGuestsAttendingAsync(CancellationToken cancellationToken = default);
}
