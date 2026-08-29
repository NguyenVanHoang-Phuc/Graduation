using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class GraduationWishConfiguration : IEntityTypeConfiguration<GraduationWish>
{
    public void Configure(EntityTypeBuilder<GraduationWish> builder)
    {
        builder.ToTable("GraduationWishes");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.SenderName).IsRequired().HasMaxLength(100);
        builder.Property(x => x.Relationship).HasMaxLength(50);
        builder.Property(x => x.Message).IsRequired().HasMaxLength(1000);
        builder.Property(x => x.AvatarBgColor).HasMaxLength(30);
        builder.Property(x => x.Emoji).HasMaxLength(20);
    }
}
