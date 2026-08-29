using Domain.Base;

namespace Domain.Entities;

public class CeremonySetting : BaseEntity
{
    public string GraduateName { get; set; } = string.Empty;
    public string GraduateTitle { get; set; } = string.Empty;
    public string Degree { get; set; } = string.Empty;
    public string Major { get; set; } = string.Empty;
    public string UniversityName { get; set; } = string.Empty;
    public string Faculty { get; set; } = string.Empty;
    public DateTime CeremonyDateTime { get; set; }
    public string VenueName { get; set; } = string.Empty;
    public string Hall { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? GoogleMapUrl { get; set; }
    public string? DressCode { get; set; }
    public string? ContactPhone { get; set; }
    public string? ContactEmail { get; set; }
    public string? WelcomeQuote { get; set; }
    public string? AgendaJson { get; set; }
    public string? MemoriesJson { get; set; }
}
