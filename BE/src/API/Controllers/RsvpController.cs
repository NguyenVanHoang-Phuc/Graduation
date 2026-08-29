using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RsvpController : ControllerBase
{
    private readonly IRsvpService _rsvpService;

    public RsvpController(IRsvpService rsvpService)
    {
        _rsvpService = rsvpService;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<RsvpDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateRsvp([FromBody] CreateRsvpDto dto, CancellationToken cancellationToken)
    {
        var result = await _rsvpService.CreateRsvpAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetByCode), new { code = result.CheckInCode }, ApiResponse<RsvpDto>.Ok(result, "Xác nhận tham dự thành công! Cảm ơn bạn rất nhiều."));
    }

    [HttpGet("code/{code}")]
    [ProducesResponseType(typeof(ApiResponse<RsvpDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByCode(string code, CancellationToken cancellationToken)
    {
        var result = await _rsvpService.GetRsvpByCodeAsync(code, cancellationToken);
        if (result == null)
        {
            return NotFound(ApiResponse<RsvpDto>.Fail("Không tìm thấy thông tin vé mời với mã này."));
        }
        return Ok(ApiResponse<RsvpDto>.Ok(result, "Tìm thấy thông tin vé mời."));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<PaginatedResult<RsvpDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllRsvps([FromQuery] PaginationQuery query, CancellationToken cancellationToken)
    {
        var result = await _rsvpService.GetAllRsvpsAsync(query, cancellationToken);
        return Ok(ApiResponse<PaginatedResult<RsvpDto>>.Ok(result, "Lấy danh sách khách mời thành công."));
    }

    [HttpPost("check-in")]
    [ProducesResponseType(typeof(ApiResponse<RsvpDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckIn([FromBody] CheckInDto dto, CancellationToken cancellationToken)
    {
        var result = await _rsvpService.CheckInGuestAsync(dto.CheckInCode, cancellationToken);
        return Ok(ApiResponse<RsvpDto>.Ok(result, $"Check-in thành công cho khách mời {result.FullName}!"));
    }
}
