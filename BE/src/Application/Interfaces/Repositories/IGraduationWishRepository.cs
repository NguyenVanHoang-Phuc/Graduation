using Application.Common.Models;
using Domain.Entities;

namespace Application.Interfaces.Repositories;

public interface IGraduationWishRepository : IRepository<GraduationWish>
{
    Task<PaginatedResult<GraduationWish>> GetApprovedWishesAsync(PaginationQuery query, CancellationToken cancellationToken = default);
    Task<int> GetTotalLikesCountAsync(CancellationToken cancellationToken = default);
}
