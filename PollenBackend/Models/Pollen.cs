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
            public HourlyUnits? HourlyUnits { get; set; }

            [JsonPropertyName("hourly")]
            public HourlyData? Hourly { get; set; }

            public Location? Location {get; set;}
        }

        public class HourlyUnits
        {
            [JsonPropertyName("time")]
            public string? Time { get; set; }

            [JsonPropertyName("birch_pollen")]
            public string? BirchPollen { get; set; }

            [JsonPropertyName("grass_pollen")]
            public string? GrassPollen { get; set; }

            [JsonPropertyName("alder_pollen")]
            public string? AlderPollen { get; set; }

            [JsonPropertyName("mugwort_pollen")]
            public string? MugwortPollen { get; set; }

            [JsonPropertyName("olive_pollen")]
            public string? OlivePollen { get; set; }

            [JsonPropertyName("ragweed_pollen")]
            public string? RagweedPollen { get; set; }
        }


        public class HourlyData
        {
            [JsonPropertyName("time")]
            public List<string>? Time { get; set; }

            [JsonPropertyName("birch_pollen")]
            public List<double?>? BirchPollen { get; set; }

            [JsonPropertyName("grass_pollen")]
            public List<double?>? GrassPollen { get; set; }

            [JsonPropertyName("alder_pollen")]
            public List<double?>? AlderPollen { get; set; }

            [JsonPropertyName("mugwort_pollen")]
            public List<double?>? MugwortPollen { get; set; }

            [JsonPropertyName("olive_pollen")]
            public List<double?>? OlivePollen { get; set; }

            [JsonPropertyName("ragweed_pollen")]
            public List<double?>? RagweedPollen { get; set; }
        }
    }