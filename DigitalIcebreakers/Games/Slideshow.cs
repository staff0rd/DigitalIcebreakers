using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Slideshow : Game, IGame 
{
    public string Name => "slideshow";
    
    public async override Task ClientMessage(JToken client, GameHub hub)
    {
        await hub.SendGameUpdateToAdmin("d");   
    }

    public async override Task AdminMessage(JToken admin, GameHub hub)
    {
        string message = admin.ToObject<string>();
        await hub.Clients.All.SendAsync("gameUpdate", message);
    }
}