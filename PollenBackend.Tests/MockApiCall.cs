using System.Net;
using System.Text;
using Moq;
using Moq.Protected;

namespace PollenBackend.Tests{
    public abstract class IMockApiCall
    {
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

            _mockHandler?
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(fakeResponse);
        }
    }
}