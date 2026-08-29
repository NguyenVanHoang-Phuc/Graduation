using API.Configuration;
using API.Middlewares;
using Application;
using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Load .env config
EnvLoader.Load(builder);

// 2. Register Application & Infrastructure Clean Architecture Layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

builder.Services.AddHttpContextAccessor();

// 3. Configure CORS for Next.js Frontend (Supports Localhost & Vercel)
var allowedOriginsStr = builder.Configuration["AllowedOrigins"] ?? "http://localhost:3000,http://localhost:3001,https://localhost:3000";
var allowedOrigins = allowedOriginsStr
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy("GraduationFrontendPolicy", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                if (allowedOrigins.Contains("*") || allowedOrigins.Contains(origin)) return true;
                // Allow any vercel preview / production domain
                if (origin.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase)) return true;
                if (origin.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase)) return true;
                return false;
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Graduation Ceremony Invitation API",
        Version = "v1",
        Description = "Clean Architecture API for University Graduation Ceremony Landing Page (RSVP, Wishes, Agenda, Check-in)"
    });
});

var app = builder.Build();

// 4. Auto migrate and seed database on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<GraduationDbContext>();
    try
    {
        if (dbContext.Database.IsRelational())
        {
            await dbContext.Database.MigrateAsync();
        }
        else
        {
            await dbContext.Database.EnsureCreatedAsync();
        }
        await dbContext.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing and seeding the database.");
    }
}

// 5. Configure HTTP Request Pipeline
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Graduation Ceremony API v1");
        c.RoutePrefix = "swagger";
    });
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseCors("GraduationFrontendPolicy");

app.UseRouting();

app.MapControllers();

app.Run();
