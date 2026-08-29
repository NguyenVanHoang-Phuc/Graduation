using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class CreateWishValidator : AbstractValidator<CreateWishDto>
{
    public CreateWishValidator()
    {
        RuleFor(x => x.SenderName)
            .NotEmpty().WithMessage("Vui lòng nhập tên của bạn.")
            .MaximumLength(100).WithMessage("Tên không được vượt quá 100 ký tự.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Vui lòng nhập lời chúc.")
            .MaximumLength(1000).WithMessage("Lời chúc không được vượt quá 1000 ký tự.");
    }
}
