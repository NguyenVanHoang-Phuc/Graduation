using Application.Common.Models;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Implementations.Repositories;

public class GuestRsvpRepository : GenericRepository<GuestRsvp>, IGuestRsvpRepository
{
    public GuestRsvpRepository(GraduationDbContext context) : base(context)
    {
    }

    public async Task<GuestRsvp?> GetByCodeAsync(string checkInCode, CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(x => x.CheckInCode.ToUpper() == checkInCode.Trim().ToUpper(), cancellationToken);
    }

    public async Task<PaginatedResult<GuestRsvp>> GetPaginatedAsync(PaginationQuery query, CancellationToken cancellationToken = default)
    {
        var totalCount = await _dbSet.CountAsync(cancellationToken);
        var items = await _dbSet
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GuestRsvp>(items, totalCount, query.PageNumber, query.PageSize);
    }

    public async Task<int> GetTotalGuestsAttendingAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(x => x.AttendanceStatus != AttendanceStatus.NotAttending)
            .SumAsync(x => x.NumberOfGuests, cancellationToken);
    }
}
