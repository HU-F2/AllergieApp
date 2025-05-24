namespace PollenBackend.Models
{
    public class AllergySuggestion
    {
        public string PollenType { get; set; } = string.Empty;
        public double AverageConcentration { get; set; }
    }
}