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

namespace DigitalIcebreakers
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string connectionString = "User ID=postgres;Password=example;Host=localhost;Port=5432;Database=postgres;";

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

            var config = new LoggerConfiguration()
                .MinimumLevel.Debug()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.AspNetCore.SpaServices", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.PostgreSQL(connectionString, tableName, columnWriters, failureCallback: (e) =>
                {
                    Console.WriteLine("Could not log to postgres" + e.Message);
                }, needAutoCreateTable: true, needAutoCreateSchema: true)
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}")
                .WriteTo.Trace();

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

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseSerilog();
    }
}
