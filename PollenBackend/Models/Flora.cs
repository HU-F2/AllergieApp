public class Flora
{
    public int Id { get; set; }
    public string? Naam { get; set; }
    public string? AfbeeldingUrl { get; set; }
    public string? Beschrijving { get; set; }
    public string? HooikoortsInfo { get; set; }
    public DateTime PollenPeriodeStart { get; set; }
    public DateTime PollenPeriodeEind { get; set; }
    public string? Regio { get; internal set; }
}
