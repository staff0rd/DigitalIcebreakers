using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Slideshow : Game, IGame 
{
    public string Name => "slideshow";

    private SlideState _state = new SlideState(); 
    
    public async override Task ClientMessage(JToken client, GameHub hub)
    {
        await hub.SendGameUpdateToAdmin("d");   
    }

    public async override Task SystemMessage(JToken system, GameHub hub)
    {
        var action = system.ToObject<string>();
        if (action == "join")
            await hub.Clients.Client(hub.GetPlayerByConnectionId().ConnectionId).SendAsync("gameUpdate", _state);
    }

    public async override Task AdminMessage(JToken admin, GameHub hub)
    {
        var state = admin.ToObject<SlideState>();
        _state = state;
        await hub.Clients.All.SendAsync("gameUpdate", state);
    }
}