using PollenBackend.Models;

namespace PollenBackend.Services
{
    public interface ISymptomAnalysisService
    {
        Task<List<AllergySuggestion>> AnalyzeSymptoms(SymptomSubmission submission);
    }

    public class SymptomAnalysisService : ISymptomAnalysisService
    {
        private readonly IPollenService _pollenService;

        public SymptomAnalysisService(IPollenService pollenService)
        {
            _pollenService = pollenService;
        }

        public async Task<List<AllergySuggestion>> AnalyzeSymptoms(SymptomSubmission submission)
        {
            Dictionary<string, List<double>> pollenLevels = new()
            {
                { "birch_pollen", new() },
                { "grass_pollen", new() },
                { "alder_pollen", new() },
                { "mugwort_pollen", new() },
                { "olive_pollen", new() },
                { "ragweed_pollen", new() },
            };

            foreach (var date in submission.SymptomDates)
            {
                var pollenDataList = await _pollenService.GetPollenMap();

                foreach (var p in pollenDataList)
                {
                    // Controleer op geldige locatie
                    if (p.Location == null ||
                        p.Location.Latitude != submission.Latitude ||
                        p.Location.Longitude != submission.Longitude)
                        continue;

                    // Controleer op geldige Hourly-data
                    if (p.Hourly == null || p.Hourly.Time == null || p.Hourly.Time.Count == 0)
                        continue;

                    for (int i = 0; i < p.Hourly.Time.Count; i++)
                    {
                        if (DateTime.TryParse(p.Hourly.Time[i], out var pollenTime) && pollenTime.Date == date.Date)
                        {
                            AddIfValid(pollenLevels["birch_pollen"], p.Hourly.BirchPollen, i);
                            AddIfValid(pollenLevels["grass_pollen"], p.Hourly.GrassPollen, i);
                            AddIfValid(pollenLevels["alder_pollen"], p.Hourly.AlderPollen, i);
                            AddIfValid(pollenLevels["mugwort_pollen"], p.Hourly.MugwortPollen, i);
                            AddIfValid(pollenLevels["olive_pollen"], p.Hourly.OlivePollen, i);
                            AddIfValid(pollenLevels["ragweed_pollen"], p.Hourly.RagweedPollen, i);
                        }
                    }
                }
            }

            var averageScores = pollenLevels
                .Select(kvp => new AllergySuggestion
                {
                    PollenType = kvp.Key,
                    AverageConcentration = kvp.Value.Any() ? kvp.Value.Average() : 0
                })
                .OrderByDescending(p => p.AverageConcentration)
                .Take(2)
                .ToList();

            return averageScores;
        }

        // Helperfunctie om veiliger te indexeren
        private void AddIfValid(List<double> list, List<double?>? source, int index)
        {
            if (source != null && index < source.Count && source[index].HasValue)
            {
                list.Add(source[index]!.Value);
            }
        }
    }
}
