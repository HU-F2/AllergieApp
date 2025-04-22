FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /app

COPY PollenApi.csproj ./
RUN dotnet restore

COPY . .

RUN dotnet publish PollenApi.csproj -c Release -o /app/out

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base

WORKDIR /app

COPY --from=build /app/out .

EXPOSE 5000

ENTRYPOINT ["dotnet", "PollenApi.dll"]
