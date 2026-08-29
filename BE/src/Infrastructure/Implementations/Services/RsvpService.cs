using Application.Common.Exceptions;
using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using AutoMapper;
using Domain.Entities;
using FluentValidation;

namespace Infrastructure.Implementations.Services;

public class RsvpService : IRsvpService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateRsvpDto> _validator;

    public RsvpService(IUnitOfWork unitOfWork, IMapper mapper, IValidator<CreateRsvpDto> validator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validator = validator;
    }

    public async Task<RsvpDto> CreateRsvpAsync(CreateRsvpDto dto, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.ValidateAsync(dto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new Application.Common.Exceptions.ValidationException(validationResult.Errors);
        }

        var entity = _mapper.Map<GuestRsvp>(dto);
        // Ensure check-in code is unique
        while (await _unitOfWork.Rsvps.GetByCodeAsync(entity.CheckInCode, cancellationToken) != null)
        {
            entity.CheckInCode = GuestRsvp.GenerateCheckInCode();
        }

        await _unitOfWork.Rsvps.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<RsvpDto>(entity);
    }

    public async Task<RsvpDto?> GetRsvpByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Rsvps.GetByCodeAsync(code, cancellationToken);
        return entity == null ? null : _mapper.Map<RsvpDto>(entity);
    }

    public async Task<PaginatedResult<RsvpDto>> GetAllRsvpsAsync(PaginationQuery query, CancellationToken cancellationToken = default)
    {
        var result = await _unitOfWork.Rsvps.GetPaginatedAsync(query, cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<RsvpDto>>(result.Items);

        return new PaginatedResult<RsvpDto>(dtos, result.TotalCount, result.PageNumber, result.PageSize);
    }

    public async Task<RsvpDto> CheckInGuestAsync(string code, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Rsvps.GetByCodeAsync(code, cancellationToken);
        if (entity == null)
        {
            throw new NotFoundException($"Không tìm thấy vé mời với mã xác nhận: {code}");
        }

        entity.MarkCheckedIn();
        await _unitOfWork.Rsvps.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<RsvpDto>(entity);
    }
}
