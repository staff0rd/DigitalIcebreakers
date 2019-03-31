using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

public class IdeaWall : IGame 
{
    public string Name => "ideawall";

    public async Task Message(string payload, GameHub hub)
    {
        var player = hub.GetPlayerByConnectionId();
        switch(payload)
        {
            // case "up": await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "up"); break;
            // case "down": await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.ExternalId, player.Name, "down"); break;
            default: break;
        }
    }

    public Task Start(GameHub hub)
    {
        return Task.CompletedTask;
    }
}