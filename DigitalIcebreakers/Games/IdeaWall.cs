using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

public class IdeaWall : Game, IGame 
{
    public string Name => "ideawall";

    public override async Task ClientMessage(dynamic payload, GameHub hub)
    {
        var player = hub.GetPlayerByConnectionId();

        string idea = payload;

        if (!string.IsNullOrWhiteSpace(idea))
            await hub.SendGameUpdateToAdmin(player.Name, idea);
    }
}