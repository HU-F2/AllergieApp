using PollenBackend.Models;
using PollenBackend.Validation;

namespace PollenBackend.Tests.Validation
{
    public class PollenDataRequestValidatorTests
    {
        private PollenDataRequest CreateRequest(
            double lat = 50, double lon = 5, DateTime? date = null)
        {
            return new PollenDataRequest
            {
                Latitude = lat,
                Longitude = lon,
                Date = date ?? DateTime.UtcNow.Date
            };
        }

        [Fact]
        public void Validate_Throws_When_List_Is_Empty()
        {
            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(new List<PollenDataRequest>()));

            Assert.Contains("No pollen data requests", ex.Message);
        }

        [Fact]
        public void Validate_Throws_When_List_Too_Long()
        {
            var requests = new List<PollenDataRequest>();
            for (int i = 0; i < 101; i++)
                requests.Add(CreateRequest(date: DateTime.UtcNow.Date.AddDays(i)));

            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Contains("maximum of 100", ex.Message);
        }

        [Fact]
        public void Validate_Throws_On_Duplicates()
        {
            var date = DateTime.UtcNow.Date;
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(date: date),
            CreateRequest(date: date) // Duplicate
        };

            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Contains("Duplicate", ex.Message);
        }

        [Fact]
        public void Validate_Throws_On_NonMidnight_Date()
        {
            var date = DateTime.UtcNow.Date.AddHours(1); // 01:00
            var requests = new List<PollenDataRequest>
            {
                CreateRequest(date: date)
            };

            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Contains("midnight", ex.Message);
        }

        [Fact]
        public void Validate_Throws_On_Date_Too_Early()
        {
            var earlyDate = DateTime.UtcNow.Date.AddDays(-91).AddDays(-1);
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(date: earlyDate)
        };

            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Contains("earlier than", ex.Message);
        }

        [Fact]
        public void Validate_Throws_On_Date_Too_Late()
        {
            var lateDate = DateTime.UtcNow.Date.AddDays(6);
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(date: lateDate)
        };

            var ex = Assert.Throws<ArgumentException>(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Contains("later than", ex.Message);
        }

        [Fact]
        public void Validate_Throws_On_Invalid_Latitude()
        {
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(lat: -91),
            CreateRequest(lat: 91)
        };

            foreach (var req in requests)
            {
                var ex = Assert.Throws<ArgumentException>(() =>
                    PollenDataRequestValidator.Validate(new List<PollenDataRequest> { req }));

                Assert.Contains("Latitude", ex.Message);
            }
        }

        [Fact]
        public void Validate_Throws_On_Invalid_Longitude()
        {
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(lon: -181),
            CreateRequest(lon: 181)
        };

            foreach (var req in requests)
            {
                var ex = Assert.Throws<ArgumentException>(() =>
                    PollenDataRequestValidator.Validate(new List<PollenDataRequest> { req }));

                Assert.Contains("Longitude", ex.Message);
            }
        }

        [Fact]
        public void Validate_Passes_With_Valid_Data()
        {
            var requests = new List<PollenDataRequest>
        {
            CreateRequest(lat: 50.0, lon: 5.0, date: DateTime.UtcNow.Date.AddDays(-1)),
            CreateRequest(lat: 51.0, lon: 6.0, date: DateTime.UtcNow.Date.AddDays(-5))
        };

            var exception = Record.Exception(() =>
                PollenDataRequestValidator.Validate(requests));

            Assert.Null(exception);
        }
    }
}