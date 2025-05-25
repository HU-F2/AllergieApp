using PollenBackend.Models;

namespace PollenBackend.Validation
{
    public static class PollenDataRequestValidator
    {
        // Bypasses date validation when true. Used exclusively for testing:
        // - Allows static test dates to bypass dynamic date range checks
        // - Enables isolated testing of other validation rules
        // Default false (validation enabled). Only set true in tests.
        public static bool SkipDateValidation { get; set; } = false;

        public static void Validate(List<PollenDataRequest> requests)
        {
            if (requests == null || requests.Count == 0)
                throw new ArgumentException("No pollen data requests provided.");

            // 1. Max aantal beperken
            if (requests.Count > 100)
                throw new ArgumentException("A maximum of 100 pollen data requests is allowed.");

            // 2. Dubbele aanvragen blokkeren (zelfde locatie en datum)
            var duplicates = requests
                .GroupBy(r => new { r.Latitude, r.Longitude, r.Date.Date })
                .Any(g => g.Count() > 1);

            if (duplicates)
                throw new ArgumentException("Duplicate pollen data requests for the same location and date are not allowed.");

            // 3. Datum moet op middernacht staan (geen tijdcomponent)
            if (requests.Any(r => r.Date.TimeOfDay != TimeSpan.Zero))
                throw new ArgumentException("All dates must be at midnight (00:00:00).");

            // 4. Date limieten (alleen als niet overgeslagen)
            if (!SkipDateValidation)
            {
                var today = DateTime.UtcNow.Date;
                var maxDate = today;
                var minDate = today.AddDays(-91);

                if (requests.Any(r => r.Date < minDate))
                    throw new ArgumentException($"Dates cannot be earlier than {minDate:yyyy-MM-dd}.");
                if (requests.Any(r => r.Date > maxDate))
                    throw new ArgumentException($"Dates cannot be later than {maxDate:yyyy-MM-dd}.");
            }

            // 5. Latitude/Longitude limieten
            if (requests.Any(r => r.Latitude < -90 || r.Latitude > 90))
                throw new ArgumentException("Latitude must be between -90 and 90.");
            if (requests.Any(r => r.Longitude < -180 || r.Longitude > 180))
                throw new ArgumentException("Longitude must be between -180 and 180.");
        }
    }
}