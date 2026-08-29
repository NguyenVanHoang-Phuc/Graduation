using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class CeremonySettingConfiguration : IEntityTypeConfiguration<CeremonySetting>
{
    public void Configure(EntityTypeBuilder<CeremonySetting> builder)
    {
        builder.ToTable("CeremonySettings");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.GraduateName).IsRequired().HasMaxLength(150);
        builder.Property(x => x.GraduateTitle).HasMaxLength(100);
        builder.Property(x => x.Degree).HasMaxLength(100);
        builder.Property(x => x.Major).HasMaxLength(150);
        builder.Property(x => x.UniversityName).HasMaxLength(200);
        builder.Property(x => x.VenueName).HasMaxLength(200);
        builder.Property(x => x.Address).HasMaxLength(300);
    }
}
