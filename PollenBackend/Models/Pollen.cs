using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace PollenBackend.Models
{
    public class PollenData
    {
        [JsonPropertyName("latitude")]
        public double Latitude { get; set; }

        [JsonPropertyName("longitude")]
        public double Longitude { get; set; }

        [JsonPropertyName("hourly_units")]
        public HourlyUnits HourlyUnits { get; set; }

        [JsonPropertyName("hourly")]
        public HourlyData Hourly { get; set; }

        public Location Location {get; set;}
    }

    public class HourlyUnits
    {
        [JsonPropertyName("time")]
        public string Time { get; set; }

        [JsonPropertyName("birch_pollen")]
        public string BirchPollen { get; set; }

        [JsonPropertyName("grass_pollen")]
        public string GrassPollen { get; set; }
    }

    public class HourlyData
    {
        [JsonPropertyName("time")]
        public List<string> Time { get; set; }

        [JsonPropertyName("birch_pollen")]
        public List<double?> BirchPollen { get; set; }

        [JsonPropertyName("grass_pollen")]
        public List<double?> GrassPollen { get; set; }
    }

}