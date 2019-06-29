using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

public class Broadcast : IGame 
{
    public string Name => "broadcast";
    
    public async Task Message(dynamic payload, GameHub hub)
    {
        var admin = hub.GetAdmin();
        string message = payload.admin;

        if (hub.GetPlayerByConnectionId() == admin) {
            await hub.Clients.All.SendAsync("gameUpdate", message);
        } else {
            await hub.Clients.Client(hub.GetAdmin().ConnectionId).SendAsync("gameUpdate", "d");
        }
    }

    public Task Start(GameHub hub)
    {
        return Task.CompletedTask;
    }
}