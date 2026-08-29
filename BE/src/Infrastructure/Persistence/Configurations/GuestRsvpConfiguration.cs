using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GuestRsvpConfiguration : IEntityTypeConfiguration<GuestRsvp>
{
    public void Configure(EntityTypeBuilder<GuestRsvp> builder)
    {
        builder.ToTable("GuestRsvps");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName).IsRequired().HasMaxLength(150);
        builder.Property(x => x.Email).HasMaxLength(150);
        builder.Property(x => x.PhoneNumber).HasMaxLength(30);
        builder.Property(x => x.CheckInCode).IsRequired().HasMaxLength(20);
        builder.Property(x => x.Notes).HasMaxLength(500);

        builder.HasIndex(x => x.CheckInCode).IsUnique();
    }
}
