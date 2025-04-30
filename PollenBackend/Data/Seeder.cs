using PollenBackend.Models;
using PollenBackend.Services;

namespace PollenBackend.Data
{
    public class Seeder
    {
        private readonly AppDbContext _context;
        private readonly ILocationService _locationService;

        public Seeder(AppDbContext context,ILocationService locationService)
        {
            _context = context;
            _locationService = locationService;
        }

        public async Task Seed()
        {
            if (!_context.Users.Any())
            {
                _context.Users.AddRange(
                    new User { Username = "John Doe" },
                    new User { Username = "Jane Smith" },
                    new User { Username = "Jim Brown" }
                );

                _context.SaveChanges();
            }

            if(!_context.Locations.Any()){
                var locations = await _locationService.GetMunicipality();
                _context.Locations.AddRange(locations);
                
                _context.SaveChanges();
            }
            if (!_context.Flora.Any())
            {
                var floraList = new List<Flora>
                {
                    new Flora
                    {
                        Naam = "Els",
                        AfbeeldingUrl = "/images/Els.png",
                        Beschrijving = "De els is een boom die vroeg in het jaar pollen produceert.",
                        HooikoortsInfo = "Veroorzaakt vaak klachten in februari-maart, zoals niezen en tranende ogen.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 2, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 3, 31), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Berk",
                        AfbeeldingUrl = "/images/Berk.png",
                        Beschrijving = "De berk is een van de sterkste hooikoortsveroorzakers.",
                        HooikoortsInfo = "Sterk allergeen; piek in april-mei met veel klachten.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 4, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 5, 15), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Grassen",
                        AfbeeldingUrl = "/images/Gras.png",
                        Beschrijving = "Grassen zijn verantwoordelijk voor de meeste hooikoortsklachten.",
                        HooikoortsInfo = "Langdurige bloeiperiode (mei-augustus), met veel verschillende soorten.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 5, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 8, 15), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Bijvoet",
                        AfbeeldingUrl = "/images/Bijvoet.png",
                        Beschrijving = "Een kruidachtige plant die in de late zomer bloeit.",
                        HooikoortsInfo = "Kan sterke allergische reacties veroorzaken in juli-augustus.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 7, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 8, 31), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Olijfboom",
                        AfbeeldingUrl = "/images/Olijfboom.png",
                        Beschrijving = "Voorkomend in Zuid-Europa, soms aangeplant in Nederland.",
                        HooikoortsInfo = "Allergenen vergelijkbaar met die van berk; bloei in mei-juni.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 5, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 6, 30), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Ambrosia",
                        AfbeeldingUrl = "/images/Ambrosia.png",
                        Beschrijving = "Sterk allergeen, komt steeds vaker voor in Nederland.",
                        HooikoortsInfo = "Zeer agressief allergeen; actief in augustus-september.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 8, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 9, 30), DateTimeKind.Utc),
                        Regio = "Nederland"
                    }
                };
                _context.Flora.AddRange(floraList);
                _context.SaveChanges();
            }
        }
    }
}