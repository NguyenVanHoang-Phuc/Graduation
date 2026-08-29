using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WishesController : ControllerBase
{
    private readonly IWishService _wishService;

    public WishesController(IWishService wishService)
    {
        _wishService = wishService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<WishDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateWish([FromBody] CreateWishDto dto, CancellationToken cancellationToken)
    {
        var result = await _wishService.CreateWishAsync(dto, cancellationToken);
        return Created(string.Empty, ApiResponse<WishDto>.Ok(result, "Gửi lời chúc thành công! Cảm ơn bạn rất nhiều."));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<WishDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetWishes([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        var result = await _wishService.GetWishesAsync(query, cancellationToken);
        return Ok(ApiResponse<PaginatedResult<WishDto>>.Ok(result, "Lấy danh sách lời chúc thành công."));
    }

    [HttpPost("{id:guid}/like")]
    [ProducesResponseType(typeof(ApiResponse<WishDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> LikeWish(Guid id, CancellationToken cancellationToken)
    {
        var result = await _wishService.LikeWishAsync(id, cancellationToken);
        return Ok(ApiResponse<WishDto>.Ok(result, "Đã thích lời chúc."));
    }
}
