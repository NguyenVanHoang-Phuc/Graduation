namespace API.Configuration;

public static class EnvLoader
{
    private static readonly IReadOnlyDictionary<string, string> ExplicitKeyMap =
        new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["CONNECTION_STRING"] = "ConnectionStrings:DefaultConnection",
            ["DATABASE_PROVIDER"] = "DatabaseProvider",
            ["ALLOWED_ORIGINS"] = "AllowedOrigins",
        };

    public static void Load(WebApplicationBuilder builder)
    {
        var envFile = ResolveEnvFilePath(builder.Environment.ContentRootPath);
        if (envFile is not null)
            DotNetEnv.Env.Load(envFile);

        MapByConvention(builder.Configuration);
    }

    private static string? ResolveEnvFilePath(string contentRoot)
    {
        var candidates = new[]
        {
            Path.Combine(contentRoot, ".env"),
            Path.Combine(Directory.GetCurrentDirectory(), ".env"),
            Path.Combine(AppContext.BaseDirectory, ".env")
        };

        return candidates.FirstOrDefault(File.Exists);
    }

    private static void MapByConvention(Microsoft.Extensions.Configuration.ConfigurationManager configuration)
    {
        var envVars = Environment.GetEnvironmentVariables();
        foreach (var keyObj in envVars.Keys)
        {
            if (keyObj is not string envKey || string.IsNullOrWhiteSpace(envKey))
                continue;

            if (ExplicitKeyMap.TryGetValue(envKey, out var configKey))
            {
                var raw = Environment.GetEnvironmentVariable(envKey) ?? configuration[envKey];
                if (!string.IsNullOrWhiteSpace(raw))
                {
                    configuration[configKey] = raw.Trim().Trim('"', '\'');
                }
            }
        }
    }
}
