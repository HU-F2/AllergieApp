namespace PollenBackend.Models
{
    public class PollenDataPoint
    {
        public DateTime Date { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public double? BirchPollen { get; set; }
        public double? GrassPollen { get; set; }
        public double? AlderPollen { get; set; }
        public double? MugwortPollen { get; set; }
        public double? OlivePollen { get; set; }
        public double? RagweedPollen { get; set; }
    }
}