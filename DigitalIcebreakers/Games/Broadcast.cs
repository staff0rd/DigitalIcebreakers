using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;

public class Broadcast : Game, IGame 
{
    public string Name => "broadcast";
    
    public async override Task ClientMessage(dynamic client, GameHub hub)
    {
        await hub.SendGameUpdateToAdmin("d");   
    }

    public async override Task AdminMessage(dynamic admin, GameHub hub)
    {
        string message = admin;
        await hub.Clients.All.SendAsync("gameUpdate", message);
    }
}