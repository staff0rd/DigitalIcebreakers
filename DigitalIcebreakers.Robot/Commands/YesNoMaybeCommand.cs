using Microsoft.AspNetCore.Http.Connections;
using Microsoft.Extensions.CommandLineUtils;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using static DigitalIcebreakers.Robot.Commands.CommandLineUtilities;

namespace DigitalIcebreakers.Robot.Commands
{
    public class YesNoMaybeCommand
    {
        public static void Register(CommandLineApplication app)
        {
            app.Command("yesnomaybe", cmd =>
            {
                var targetUrlOption = cmd.Option("--target-url <TARGET_URL>", "The URL to run the test against.", CommandOptionType.SingleValue);
                var numberOfConnectionsOption = cmd.Option("--connections <CONNECTION_COUNT>", "The number of connections to open.", CommandOptionType.SingleValue);
                var transportTypeOption = cmd.Option("--transport <TRANSPORT>", "The transport to use (defaults to WebSockets).", CommandOptionType.SingleValue);
                var lobbyId = cmd.Option("--lobbyId <LOBBY_ID>", "The lobbyId to join", CommandOptionType.SingleValue);

                cmd.OnExecute(async () =>
                {
                    if (!targetUrlOption.HasValue())
                    {
                        return MissingRequiredArg(targetUrlOption);
                    }

                    if (!lobbyId.HasValue())
                    {
                        return MissingRequiredArg(lobbyId);
                    }

                    var numberOfConnections = Defaults.NumberOfConnections;
                    var transportType = Defaults.TransportType;

                    if (numberOfConnectionsOption.HasValue() && !int.TryParse(numberOfConnectionsOption.Value(), out numberOfConnections))
                    {
                        return InvalidArg(numberOfConnectionsOption);
                    }

                    if (transportTypeOption.HasValue() && !Enum.TryParse(transportTypeOption.Value(), out transportType))
                    {
                        return InvalidArg(transportTypeOption);
                    }

                    return await Execute(targetUrlOption.Value(), numberOfConnections, transportType, lobbyId.Value());
                });
            });
        }

        private static async Task<int> Execute(string targetUrl, int numberOfConnections, HttpTransportType transportType, string lobbyId)
        {
            var runner = new YesNoMaybeRunner(targetUrl, numberOfConnections, transportType, lobbyId);
            try
            {
                await runner.RunAsync();
            }
            catch (Exception ex)
            {
                return Fail(ex.ToString());
            }

            return 0;
        }
    }
}
