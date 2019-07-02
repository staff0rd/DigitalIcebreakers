using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

public class Broadcast : IGame 
{
    public string Name => "broadcast";
    
    public async Task Message(dynamic payload, GameHub hub)
    {
        string message = payload.admin;

        if (hub.IsAdmin) {
            await hub.Clients.All.SendAsync("gameUpdate", message);
        } else {
            await hub.SendGameUpdateToAdmin("d");
        }
    }

    public Task Start(GameHub hub)
    {
        return Task.CompletedTask;
    }
}