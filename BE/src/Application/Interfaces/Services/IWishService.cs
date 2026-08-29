using Application.Common.Models;
using Application.DTOs;

namespace Application.Interfaces.Services;

public interface IWishService
{
    Task<WishDto> CreateWishAsync(CreateWishDto dto, CancellationToken cancellationToken = default);
    Task<PaginatedResult<WishDto>> GetWishesAsync(PaginationQuery query, CancellationToken cancellationToken = default);
    Task<WishDto> LikeWishAsync(Guid wishId, CancellationToken cancellationToken = default);
}
