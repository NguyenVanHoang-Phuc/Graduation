using Application.Common.Exceptions;
using Application.Common.Models;
using Application.DTOs;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using AutoMapper;
using Domain.Entities;
using FluentValidation;

namespace Infrastructure.Implementations.Services;

public class WishService : IWishService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IValidator<CreateWishDto> _validator;

    public WishService(IUnitOfWork unitOfWork, IMapper mapper, IValidator<CreateWishDto> validator)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _validator = validator;
    }

    public async Task<WishDto> CreateWishAsync(CreateWishDto dto, CancellationToken cancellationToken = default)
    {
        var validationResult = await _validator.ValidateAsync(dto, cancellationToken);
        if (!validationResult.IsValid)
        {
            throw new Application.Common.Exceptions.ValidationException(validationResult.Errors);
        }

        var entity = _mapper.Map<GraduationWish>(dto);
        if (string.IsNullOrWhiteSpace(entity.AvatarBgColor))
        {
            var colors = new[] { "#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4" };
            entity.AvatarBgColor = colors[Random.Shared.Next(colors.Length)];
        }

        if (string.IsNullOrWhiteSpace(entity.Emoji))
        {
            var emojis = new[] { "🎓", "🎉", "💐", "🌟", "🥂", "💖" };
            entity.Emoji = emojis[Random.Shared.Next(emojis.Length)];
        }

        await _unitOfWork.Wishes.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<WishDto>(entity);
    }

    public async Task<PaginatedResult<WishDto>> GetWishesAsync(PaginationQuery query, CancellationToken cancellationToken = default)
    {
        var result = await _unitOfWork.Wishes.GetApprovedWishesAsync(query, cancellationToken);
        var dtos = _mapper.Map<IReadOnlyList<WishDto>>(result.Items);

        return new PaginatedResult<WishDto>(dtos, result.TotalCount, result.PageNumber, result.PageSize);
    }

    public async Task<WishDto> LikeWishAsync(Guid wishId, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.Wishes.GetByIdAsync(wishId, cancellationToken);
        if (entity == null)
        {
            throw new NotFoundException($"Không tìm thấy lời chúc với ID: {wishId}");
        }

        entity.Like();
        await _unitOfWork.Wishes.UpdateAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _mapper.Map<WishDto>(entity);
    }
}
