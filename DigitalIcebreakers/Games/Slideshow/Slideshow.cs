using System.Threading.Tasks;
using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Slideshow : Game, IGame 
{
    public override string Name => "slideshow";

    private SlideState _state = new SlideState(); 

    public Slideshow(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}
    
    public async override Task OnReceivePlayerMessage(JToken client, string connectionId)
    {
        await SendToPresenter(connectionId, "d");   
    }

    public async override Task OnReceiveSystemMessage(JToken system, string connectionId)
    {
        var action = system.ToObject<string>();
        if (action == "join")
            await SendToPlayer(connectionId, _state);
    }

    public async override Task OnReceivePresenterMessage(JToken admin, string connectionId)
    {
        var state = admin.ToObject<SlideState>();
        _state = state;
        await SendToPlayers(connectionId, state);
    }
}