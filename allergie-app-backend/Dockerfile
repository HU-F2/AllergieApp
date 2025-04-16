# FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
# WORKDIR /allergie-app-backend
# EXPOSE 3000

# FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# WORKDIR /allergie-app-backend

# # Kopieer alleen solution- en projectbestanden eerst om restore effectiever te cachen
# COPY *.sln .
# COPY *.csproj .

# # Herstel afhankelijkheden
# RUN dotnet restore AllergieAppBackend.csproj

# # Kopieer de rest van de code
# COPY . .

# # Build
# RUN dotnet build AllergieAppBackend.csproj -c Release -o /allergie-app-backend/build

# # Publish
# RUN dotnet publish AllergieAppBackend.csproj -c Release -o /allergie-app-backend/publish

# FROM base AS final
# WORKDIR /allergie-app-backend
# COPY --from=build /allergie-app-backend/publish .
# ENTRYPOINT ["dotnet", "AllergieAppBackend.dll"]

# -------------------------------
# # Base image
# FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
# WORKDIR /allergie-app-backend
# EXPOSE 3000

# # Build image
# FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# WORKDIR /allergie-app-backend
# COPY . .

# # Herstel dependencies en build
# RUN dotnet restore AllergieAppBackend.csproj
# RUN dotnet publish AllergieAppBackend.csproj -c Release -o /publish

# # Final runtime image
# FROM base AS final
# WORKDIR /allergie-app-backend
# COPY --from=build /publish .

# # Start het gecompileerde .dll bestand
# ENTRYPOINT ["dotnet", "AllergieAppBackend.dll"]

# -------------------------------
# Base image
# FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
# WORKDIR /allergie-app-backend
# EXPOSE 3000

# # Build image
# FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
# WORKDIR /allergie-app-backend
# COPY . .

# # Herstel dependencies en build
# RUN dotnet restore AllergieAppBackend.csproj
# RUN dotnet publish AllergieAppBackend.csproj -c Release -o /publish

# # Final runtime image
# FROM base AS final
# WORKDIR /allergie-app-backend
# COPY --from=build /publish .

# Start het gecompileerde .dll bestand
# ENTRYPOINT ["dotnet", "./AllergieAppBackend.dll"]
# ENTRYPOINT ["tail", "-f", "/dev/null"]

# -------------------------------------
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