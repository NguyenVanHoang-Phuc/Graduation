using Application.Common.Models;
using Application.Interfaces.Repositories;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Implementations.Repositories;

public class GraduationWishRepository : GenericRepository<GraduationWish>, IGraduationWishRepository
{
    public GraduationWishRepository(GraduationDbContext context) : base(context)
    {
    }

    public async Task<PaginatedResult<GraduationWish>> GetApprovedWishesAsync(PaginationQuery query, CancellationToken cancellationToken = default)
    {
        var dbQuery = _dbSet.Where(x => x.IsApproved);
        var totalCount = await dbQuery.CountAsync(cancellationToken);
        var items = await dbQuery
            .OrderByDescending(x => x.CreatedAt)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        return new PaginatedResult<GraduationWish>(items, totalCount, query.PageNumber, query.PageSize);
    }

    public async Task<int> GetTotalLikesCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.SumAsync(x => x.LikesCount, cancellationToken);
    }
}
