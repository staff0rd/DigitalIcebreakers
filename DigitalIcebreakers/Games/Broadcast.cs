using System.Threading.Tasks;
using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Broadcast : Game, IGame 
{
    public override string Name => "broadcast";
    
    public Broadcast(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}
    
    public async override Task OnReceivePlayerMessage(JToken client, string connectionId)
    {
        await SendToPresenter(connectionId, "d");   
    }

    public async override Task OnReceivePresenterMessage(JToken admin, string connectionId)
    {
        string message = admin.ToObject<string>();
        await SendToPlayers(connectionId, message);
    }
}