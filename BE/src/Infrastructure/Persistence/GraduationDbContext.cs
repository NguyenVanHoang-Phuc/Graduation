using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence;

public class GraduationDbContext : DbContext
{
    public DbSet<GuestRsvp> GuestRsvps => Set<GuestRsvp>();
    public DbSet<GraduationWish> GraduationWishes => Set<GraduationWish>();
    public DbSet<CeremonySetting> CeremonySettings => Set<CeremonySetting>();

    public GraduationDbContext(DbContextOptions<GraduationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(GraduationDbContext).Assembly);
    }

    public async Task SeedAsync()
    {
        var existingCeremony = await CeremonySettings.FirstOrDefaultAsync();
        if (existingCeremony == null)
        {
            var defaultCeremony = new CeremonySetting
            {
                GraduateName = "Nguyễn Văn Hoàng Phúc",
                GraduateTitle = "Tân Kỹ Sư Công Nghệ Thông Tin",
                Degree = "Cử Nhân Kỹ Thuật Phần Mềm",
                Major = "Kỹ Thuật Phần Mềm (Software Engineering)",
                UniversityName = "Trường Đại học FPT Đà Nẵng",
                Faculty = "Khoa Công nghệ thông tin và Kỹ thuật phần mềm",
                CeremonyDateTime = new DateTime(2026, 9, 12, 9, 0, 0, DateTimeKind.Unspecified), // 09:00 AM Vietnam Time
                VenueName = "Đại học FPT Đà Nẵng",
                Hall = "Khuôn viên Đại học FPT Đà Nẵng",
                Address = "Đại học FPT Đà Nẵng",
                GoogleMapUrl = "https://www.google.com/maps/place/Đại+học+FPT+Đà+Nẵng/@15.9688859,108.258311,17z/data=!3m1!4b1!4m6!3m5!1s0x3142116949840599:0x365b35580f52e8d5!8m2!3d15.9688859!4d108.2608913!16s%2Fg%2F11fl0yz7tc?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D",
                DressCode = "Lịch sự",
                ContactPhone = "0926 615 662",
                ContactEmail = "hoangphucnguyenvan1@gmail.com",
                WelcomeQuote = "Sau 4 năm học tập và nỗ lực, ngày vui tốt nghiệp đã đến! Sự hiện diện của bạn là niềm vinh hạnh và hạnh phúc to lớn đối với mình và gia đình."
            };

            await CeremonySettings.AddAsync(defaultCeremony);
        }
        else
        {
            existingCeremony.GraduateName = "Nguyễn Văn Hoàng Phúc";
            existingCeremony.UniversityName = "Trường Đại học FPT Đà Nẵng";
            existingCeremony.Faculty = "Khoa Công nghệ thông tin và Kỹ thuật phần mềm";
            existingCeremony.CeremonyDateTime = new DateTime(2026, 9, 12, 9, 0, 0, DateTimeKind.Unspecified); // 09:00 AM Vietnam Time
            existingCeremony.VenueName = "Đại học FPT Đà Nẵng";
            existingCeremony.Hall = "Khuôn viên Đại học FPT Đà Nẵng";
            existingCeremony.Address = "Đại học FPT Đà Nẵng";
            existingCeremony.GoogleMapUrl = "https://www.google.com/maps/place/Đại+học+FPT+Đà+Nẵng/@15.9688859,108.258311,17z/data=!3m1!4b1!4m6!3m5!1s0x3142116949840599:0x365b35580f52e8d5!8m2!3d15.9688859!4d108.2608913!16s%2Fg%2F11fl0yz7tc?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D";
            existingCeremony.DressCode = "Lịch sự";
            existingCeremony.ContactPhone = "0926 615 662";
            existingCeremony.ContactEmail = "hoangphucnguyenvan1@gmail.com";
            existingCeremony.AgendaJson = null;
            existingCeremony.MemoriesJson = null;
            CeremonySettings.Update(existingCeremony);
        }

        await SaveChangesAsync();
    }
}
