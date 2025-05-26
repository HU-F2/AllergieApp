using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface ISymptomAnalysisService
    {
        Task<List<AllergySuggestion>> AnalyzeSymptoms(List<PollenDataRequest> submission, int minSuggestions = 2, int maxSuggestions = 2);
    }

    public class SymptomAnalysisService : ISymptomAnalysisService
    {
        private readonly IPollenService _pollenService;

        public SymptomAnalysisService(IPollenService pollenService)
        {
            _pollenService = pollenService;
        }

        public async Task<List<AllergySuggestion>> AnalyzeSymptoms(List<PollenDataRequest> submission, int minSuggestions = 2, int maxSuggestions = 2)
        {
            var pollenData = await _pollenService.GetPollenDataForDatesAndCoordinates(submission);

            var filteredPollenData = FilterPollenDataBySubmissionDates(submission, pollenData);

            return GetAveragePollenConcentrations(filteredPollenData, minSuggestions, maxSuggestions);
        }

        private List<PollenDataPoint> FilterPollenDataBySubmissionDates(List<PollenDataRequest> submission, List<PollenDataPoint> pollenData)
        {
            if (submission == null || pollenData == null)
                return new List<PollenDataPoint>();

            var submissionDates = new HashSet<DateTime>(submission.Select(s => s.Date.Date));

            return pollenData
                .Where(p => submissionDates.Contains(p.Date.Date))
                .ToList();
        }

        private List<AllergySuggestion> GetAveragePollenConcentrations(List<PollenDataPoint> pollenDataPoints, int minSuggestions = 2, int maxSuggestions = 2)
        {
            if (pollenDataPoints == null || !pollenDataPoints.Any())
                return new List<AllergySuggestion>();

            // Initialize dictionary to store all pollen values
            var pollenLevels = new Dictionary<string, List<double>>()
            {
                { "birch_pollen", new List<double>() },
                { "grass_pollen", new List<double>() },
                { "alder_pollen", new List<double>() },
                { "mugwort_pollen", new List<double>() },
                { "olive_pollen", new List<double>() },
                { "ragweed_pollen", new List<double>() }
            };

            // Collect all non-null pollen values
            foreach (var dataPoint in pollenDataPoints)
            {
                AddPollenValue(pollenLevels["birch_pollen"], dataPoint.BirchPollen);
                AddPollenValue(pollenLevels["grass_pollen"], dataPoint.GrassPollen);
                AddPollenValue(pollenLevels["alder_pollen"], dataPoint.AlderPollen);
                AddPollenValue(pollenLevels["mugwort_pollen"], dataPoint.MugwortPollen);
                AddPollenValue(pollenLevels["olive_pollen"], dataPoint.OlivePollen);
                AddPollenValue(pollenLevels["ragweed_pollen"], dataPoint.RagweedPollen);
            }

            return GetTopSuggestions(pollenLevels, minSuggestions, maxSuggestions);
        }

        private void AddPollenValue(List<double> list, double? value)
        {
            if (value.HasValue)
            {
                list.Add(value.Value);
            }
        }

        private List<AllergySuggestion> GetTopSuggestions(Dictionary<string, List<double>> pollenLevels, int minSuggestions = 2, int maxSuggestions = 2)
        {
            var nonEmptyTypes = pollenLevels.Values.Count(list => list.Count > 0);
            if (nonEmptyTypes < minSuggestions)
                return new List<AllergySuggestion>();

            return pollenLevels
                .Where(kvp => kvp.Value.Any())
                .Select(kvp => new AllergySuggestion
                {
                    PollenType = kvp.Key,
                    AverageConcentration = kvp.Value.Average()
                })
                .OrderByDescending(p => p.AverageConcentration)
                .Take(maxSuggestions)
                .ToList();
        }
    }
}
