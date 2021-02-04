using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Serilog;
using Serilog.Events;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using Serilog.Sinks.PostgreSQL;
using NpgsqlTypes;
using Npgsql;
using Dapper;
using System.Linq;

namespace DigitalIcebreakers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var config = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore.SpaServices", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}");

            WriteToPostgres(config);

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            var isDevelopment = environment == Environments.Development;

            Log.Logger = config.CreateLogger();

            try
            {
                Log.Information("Starting web host");
                CreateWebHostBuilder(args).Build().Run();
            }
            catch (Exception e)
            {
                Log.Fatal(e, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void WriteToPostgres(LoggerConfiguration config)
        {
            var user = Environment.GetEnvironmentVariable("POSTGRES_USER");
            var password = Environment.GetEnvironmentVariable("POSTGRES_PASSWORD");
            var host = Environment.GetEnvironmentVariable("POSTGRES_HOST");
            var db = Environment.GetEnvironmentVariable("POSTGRES_DATABASE");

            if (!string.IsNullOrEmpty(user) && !string.IsNullOrEmpty(password) && !string.IsNullOrEmpty(host) && !string.IsNullOrEmpty(db))
            {
                string getConnectionString(string db) => $"User ID={user};Password={password};Host={host};Port=5432;Database={db};";

                using (var connection = new NpgsqlConnection(getConnectionString("postgres")))
                {
                    var rows = connection.Query($"SELECT FROM pg_database WHERE datname = '{db}'").Count();
                    if (rows == 0)
                    {
                        connection.Execute($"CREATE DATABASE {db}");
                    }
                }

                string tableName = "logs";
                IDictionary<string, ColumnWriterBase> columnWriters = new Dictionary<string, ColumnWriterBase>
                {
                    { "message", new RenderedMessageColumnWriter(NpgsqlDbType.Text) },
                    { "message_template", new MessageTemplateColumnWriter(NpgsqlDbType.Text) },
                    { "level", new LevelColumnWriter(true, NpgsqlDbType.Varchar) },
                    { "raise_date", new TimestampColumnWriter(NpgsqlDbType.TimestampTz) },
                    { "exception", new ExceptionColumnWriter(NpgsqlDbType.Text) },
                    { "properties", new PropertiesColumnWriter(NpgsqlDbType.Jsonb) },
                };

                config.WriteTo
                    .PostgreSQL(getConnectionString(db), tableName, columnWriters, failureCallback: (e) =>
                    {
                        Console.WriteLine("Could not log to postgres" + e.Message);
                    }, needAutoCreateTable: true, needAutoCreateSchema: true);
            }
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseSerilog();
    }
}
