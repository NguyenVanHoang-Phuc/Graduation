using AutoMapper;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappings;

public class GraduationMappingProfile : Profile
{
    public GraduationMappingProfile()
    {
        CreateMap<GuestRsvp, RsvpDto>();
        CreateMap<CreateRsvpDto, GuestRsvp>();

        CreateMap<GraduationWish, WishDto>();
        CreateMap<CreateWishDto, GraduationWish>();

        CreateMap<CeremonySetting, CeremonyInfoDto>();
        CreateMap<UpdateCeremonyDto, CeremonySetting>();
    }
}
