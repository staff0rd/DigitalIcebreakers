using Microsoft.AspNetCore.Http.Connections;

namespace DigitalIcebreakers.Robot.Commands
{
    internal static class Defaults
    {
        public static readonly int NumberOfConnections = 50;
        public static readonly HttpTransportType TransportType = HttpTransportType.WebSockets;
    }
}
