using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Slideshow : Game, IGame 
{
    public string Name => "slideshow";

    private SlideState _state = new SlideState(); 
    
    public async override Task ClientMessage(JToken client, IGameHub hub)
    {
        await hub.SendGameUpdateToPresenter("d");   
    }

    public async override Task SystemMessage(JToken system, IGameHub hub)
    {
        var action = system.ToObject<string>();
        if (action == "join")
            await hub.SendGameUpdateToPlayer(hub.GetPlayerByConnectionId(), _state);
    }

    public async override Task AdminMessage(JToken admin, IGameHub hub)
    {
        var state = admin.ToObject<SlideState>();
        _state = state;
        await hub.SendGameUpdateToPlayers(state);
    }
}