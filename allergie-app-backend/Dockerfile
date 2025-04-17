# # 1. Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 3000

# 2. Build & publish image
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Kopieer alles uit je backend map
COPY . .

# Restore en publish direct naar /app (dezelfde map als de runtime)
RUN dotnet restore ./AllergieAppBackend.csproj
RUN dotnet publish ./AllergieAppBackend.csproj -c Release -o /app/publish

# 3. Final image met alleen de publish output
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "./AllergieAppBackend.dll"]