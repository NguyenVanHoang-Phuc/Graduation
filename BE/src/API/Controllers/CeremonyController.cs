using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CeremonyController : ControllerBase
{
    private readonly ICeremonyService _ceremonyService;

    public CeremonyController(ICeremonyService ceremonyService)
    {
        _ceremonyService = ceremonyService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<CeremonyInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCeremonyInfo(CancellationToken cancellationToken)
    {
        var info = await _ceremonyService.GetCeremonyInfoAsync(cancellationToken);
        return Ok(ApiResponse<CeremonyInfoDto>.Ok(info, "Lấy thông tin lễ tốt nghiệp thành công."));
    }

    [HttpGet("stats")]
    [ProducesResponseType(typeof(ApiResponse<SummaryStatsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummaryStats(CancellationToken cancellationToken)
    {
        var stats = await _ceremonyService.GetSummaryStatsAsync(cancellationToken);
        return Ok(ApiResponse<SummaryStatsDto>.Ok(stats, "Lấy thống kê thành công."));
    }

    [HttpPut]
    [ProducesResponseType(typeof(ApiResponse<CeremonyInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCeremonyInfo([FromBody] UpdateCeremonyDto dto, CancellationToken cancellationToken)
    {
        var info = await _ceremonyService.UpdateCeremonyInfoAsync(dto, cancellationToken);
        return Ok(ApiResponse<CeremonyInfoDto>.Ok(info, "Cập nhật thông tin thành công."));
    }

    [HttpPost("test-email")]
    public async Task<IActionResult> TestEmail([FromQuery] string to, [FromServices] IEmailService emailService, CancellationToken cancellationToken)
    {
        await emailService.SendRsvpThankYouEmailAsync(to, "Khách Mời Test", "Attending", 2, cancellationToken);
        return Ok(ApiResponse<string>.Ok("Đã gửi email test thành công. Hãy kiểm tra hộp thư đến (và mục Spam)."));
    }
}
