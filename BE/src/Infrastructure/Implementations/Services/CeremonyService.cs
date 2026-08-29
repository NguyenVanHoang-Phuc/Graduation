using Application.Common.Exceptions;
using Application.DTOs;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using AutoMapper;
using Domain.Entities;

namespace Infrastructure.Implementations.Services;

public class CeremonyService : ICeremonyService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CeremonyService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<CeremonyInfoDto> GetCeremonyInfoAsync(CancellationToken cancellationToken = default)
    {
        var setting = await _unitOfWork.CeremonySettings.GetCurrentSettingAsync(cancellationToken);
        if (setting == null)
        {
            throw new NotFoundException("Thông tin buổi lễ chưa được thiết lập.");
        }

        return _mapper.Map<CeremonyInfoDto>(setting);
    }

    public async Task<SummaryStatsDto> GetSummaryStatsAsync(CancellationToken cancellationToken = default)
    {
        var totalRsvps = await _unitOfWork.Rsvps.CountAsync(null, cancellationToken);
        var totalConfirmedGuests = await _unitOfWork.Rsvps.GetTotalGuestsAttendingAsync(cancellationToken);
        var totalWishes = await _unitOfWork.Wishes.CountAsync(x => x.IsApproved, cancellationToken);
        var totalLikes = await _unitOfWork.Wishes.GetTotalLikesCountAsync(cancellationToken);

        return new SummaryStatsDto
        {
            TotalRsvps = totalRsvps,
            TotalConfirmedGuests = totalConfirmedGuests,
            TotalWishes = totalWishes,
            TotalLikes = totalLikes
        };
    }

    public async Task<CeremonyInfoDto> UpdateCeremonyInfoAsync(UpdateCeremonyDto dto, CancellationToken cancellationToken = default)
    {
        var setting = await _unitOfWork.CeremonySettings.GetCurrentSettingAsync(cancellationToken);
        if (setting == null)
        {
            setting = _mapper.Map<CeremonySetting>(dto);
            await _unitOfWork.CeremonySettings.AddAsync(setting, cancellationToken);
        }
        else
        {
            _mapper.Map(dto, setting);
            setting.UpdatedAt = DateTime.UtcNow;
            await _unitOfWork.CeremonySettings.UpdateAsync(setting, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return _mapper.Map<CeremonyInfoDto>(setting);
    }
}
