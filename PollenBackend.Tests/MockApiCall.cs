using System.Net;
using System.Text;
using Moq;
using Moq.Protected;

namespace PollenBackend.Tests{
    public abstract class MockApiCall
    {
        // When inheriting make sure you assign _mockHandler your mocked HttpMessageHandler.
        protected Mock<HttpMessageHandler> _mockHandler = null!;

        protected void mockApiCall(string directory, string file, HttpStatusCode statusCode)
        {
            string path = Path.Combine(AppContext.BaseDirectory, directory, file);
            string json = File.ReadAllText(path);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var fakeResponse = new HttpResponseMessage(statusCode)
            {
                Content = content
            };

            // Since SendAsync is protected(we cant change it) we do it like this.
            _mockHandler
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse);
        }
    }
}