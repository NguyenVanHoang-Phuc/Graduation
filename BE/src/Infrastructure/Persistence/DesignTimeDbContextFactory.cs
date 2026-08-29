using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

public class GraduationDbContextFactory : IDesignTimeDbContextFactory<GraduationDbContext>
{
    public GraduationDbContext CreateDbContext(string[] args)
    {
        LoadEnvFile();

        var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING")
            ?? "Server=PHUCNVH; Database=DatabaseGraduation; User Id=sa;Password=1234567;TrustServerCertificate=true;Trusted_Connection=SSPI;Encrypt=false;";

        var provider = Environment.GetEnvironmentVariable("DATABASE_PROVIDER") ?? "SqlServer";

        var optionsBuilder = new DbContextOptionsBuilder<GraduationDbContext>();

        if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
        {
            optionsBuilder.UseSqlServer(connectionString);
        }
        else
        {
            optionsBuilder.UseSqlite(connectionString);
        }

        return new GraduationDbContext(optionsBuilder.Options);
    }

    private static void LoadEnvFile()
    {
        var candidates = new[]
        {
            Path.Combine(Directory.GetCurrentDirectory(), ".env"),
            Path.Combine(Directory.GetCurrentDirectory(), "src", "API", ".env"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "API", ".env"),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "API", ".env")
        };

        var envFile = candidates.Select(Path.GetFullPath).FirstOrDefault(File.Exists);
        if (envFile is not null)
            DotNetEnv.Env.Load(envFile);
    }
}
