using System.Threading.Tasks;
using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public class IdeaWall : Game, IGame 
{
    public override string Name => "ideawall";

    public IdeaWall(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

    public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
    {
        var player = GetPlayerByConnectionId(connectionId);

        string idea = payload.ToObject<string>();

        if (!string.IsNullOrWhiteSpace(idea))
            await SendToPresenter(connectionId, idea, player);
    }
}