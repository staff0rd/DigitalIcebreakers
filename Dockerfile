# Runtime-only image; the deploy workflow pre-builds the frontend and backend
# into publish/ (with the Vite build packaged at publish/web/dist) before
# running `docker build`.
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY publish/ ./
# ASPNETCORE_URLS (not ASPNETCORE_HTTP_PORTS) because WebHost.CreateDefaultBuilder
# in Program.cs only honors URLS
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
ENTRYPOINT ["dotnet", "DigitalIcebreakers.dll"]
