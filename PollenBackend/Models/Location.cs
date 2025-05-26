
using System.ComponentModel.DataAnnotations;

namespace PollenBackend.Models
{
    public class Location
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique identifier

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public float Latitude { get; set; }

        [Required]
        public float Longitude { get; set; }

        public List<Coordinate> Coordinates { get; set; } = [];
    }

    public class Coordinate
    {
        public float Latitude { get; set; }
        public float Longitude { get; set; }
    }
}