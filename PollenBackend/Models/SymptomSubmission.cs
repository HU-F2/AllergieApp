namespace PollenBackend.Models
{
    public class SymptomSubmission
    {
        public List<DateTime> SymptomDates { get; set; } = new();
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}