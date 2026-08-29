using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class CreateRsvpValidator : AbstractValidator<CreateRsvpDto>
{
    public CreateRsvpValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Vui lòng nhập họ và tên.")
            .MaximumLength(150).WithMessage("Họ và tên không được vượt quá 150 ký tự.");

        RuleFor(x => x.NumberOfGuests)
            .InclusiveBetween(1, 10).WithMessage("Số lượng người tham dự từ 1 đến 10.");

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Địa chỉ email không hợp lệ.");

        RuleFor(x => x.PhoneNumber)
            .Matches(@"^[0-9+() -]{8,20}$").When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber))
            .WithMessage("Số điện thoại không hợp lệ.");
    }
}
