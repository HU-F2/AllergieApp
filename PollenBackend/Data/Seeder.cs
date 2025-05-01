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
                        HooikoortsInfo = "Pollen van de els veroorzaken vaak milde tot matige klachten zoals jeukende ogen, niezen en een loopneus. Omdat de bloei al in de late winter begint, worden symptomen soms verward met verkoudheid. Vooral mensen die gevoelig zijn voor berkenpollen reageren vaak ook op els (kruisreactie).",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 2, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 3, 31), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Berk",
                        AfbeeldingUrl = "/images/Berk.png",
                        Beschrijving = "De berk is een van de sterkste hooikoortsveroorzakers.",
                        HooikoortsInfo = "Berkenpollen zijn zeer allergeen en kunnen heftige reacties veroorzaken zoals benauwdheid, geïrriteerde luchtwegen, en ernstige vermoeidheid. Veel mensen met berkenallergie hebben ook last van kruisreacties op fruit zoals appels, peren of noten (orale allergie syndroom).",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 4, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 5, 15), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Grassen",
                        AfbeeldingUrl = "/images/Gras.png",
                        Beschrijving = "Grassen zijn verantwoordelijk voor de meeste hooikoortsklachten.",
                        HooikoortsInfo = "Graspollen veroorzaken vaak langdurige en uiteenlopende klachten zoals verstopte neus, waterige ogen, jeuk in keel en zelfs astmatische symptomen. Door de grote verscheidenheid aan grassoorten is de gevoeligheid zeer individueel; sommige mensen ervaren klachten gedurende de hele zomer.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 5, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 8, 15), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Bijvoet",
                        AfbeeldingUrl = "/images/Bijvoet.png",
                        Beschrijving = "Een kruidachtige plant die in de late zomer bloeit.",
                        HooikoortsInfo = "Bijvoetpollen veroorzaken vaak klachten als een jeukende neus, verstopte luchtwegen en benauwdheid. Mensen met een bijvoetallergie kunnen ook voedselallergieën hebben voor selderij, wortel of kruiden (kruisallergie). Bijvoet komt veel voor langs wegen en braakliggende terreinen.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 7, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 8, 31), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Olijfboom",
                        AfbeeldingUrl = "/images/Olijfboom.png",
                        Beschrijving = "Voorkomend in Zuid-Europa, soms aangeplant in Nederland.",
                        HooikoortsInfo = "De pollen van de olijfboom veroorzaken klachten die vergelijkbaar zijn met die van de berk, zoals niezen, geïrriteerde ogen en ademhalingsproblemen. Vooral mensen die op vakantie gaan naar Zuid-Europa in het voorjaar kunnen hier last van krijgen.",
                        PollenPeriodeStart = DateTime.SpecifyKind(new DateTime(1, 5, 1), DateTimeKind.Utc),
                        PollenPeriodeEind = DateTime.SpecifyKind(new DateTime(1, 6, 30), DateTimeKind.Utc),
                        Regio = "Nederland"
                    },
                    new Flora
                    {
                        Naam = "Ambrosia",
                        AfbeeldingUrl = "/images/Ambrosia.png",
                        Beschrijving = "Sterk allergeen, komt steeds vaker voor in Nederland.",
                        HooikoortsInfo = "Ambrosiapollen zijn extreem allergeen en kunnen zelfs in lage concentraties ernstige klachten geven zoals ademnood, oogontstekingen en astma-aanvallen. Bloeit laat in het seizoen, wat het hooikoortsseizoen verlengt. Zeer gevoelig voor klimaatverandering; oprukkend in Nederland.",
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