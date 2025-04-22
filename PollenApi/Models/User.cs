
namespace PollenApi.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid(); // Unique identifier

        public string Username { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLogin { get; set; }
    }
}