# Use .NET 9 SDK for building and hot reload
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS dev

# Set working directory inside container
WORKDIR /app

# Copy everything into the container
COPY . ./

# Expose the port your app will run on
EXPOSE 5000

# Run with hot reload using dotnet watch
ENTRYPOINT ["dotnet", "watch", "run", "--urls=http://0.0.0.0:5000"]
