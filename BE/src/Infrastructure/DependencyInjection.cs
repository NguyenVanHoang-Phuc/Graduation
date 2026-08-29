using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Infrastructure.Implementations.Repositories;
using Infrastructure.Implementations.Services;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Interceptors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<AuditSaveChangesInterceptor>();

        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? configuration["DEFAULT_CONNECTION_STRING"] 
            ?? "Data Source=graduation.db";

        var provider = configuration["DatabaseProvider"] ?? "Sqlite";

        services.AddDbContext<GraduationDbContext>((sp, options) =>
        {
            var interceptor = sp.GetRequiredService<AuditSaveChangesInterceptor>();
            if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
            {
                options.UseSqlServer(connectionString)
                       .AddInterceptors(interceptor);
            }
            else
            {
                options.UseSqlite(connectionString)
                       .AddInterceptors(interceptor);
            }
        });

        // Repositories
        services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IGuestRsvpRepository, GuestRsvpRepository>();
        services.AddScoped<IGraduationWishRepository, GraduationWishRepository>();
        services.AddScoped<ICeremonySettingRepository, CeremonySettingRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IRsvpService, RsvpService>();
        services.AddScoped<IWishService, WishService>();
        services.AddScoped<ICeremonyService, CeremonyService>();
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }
}
