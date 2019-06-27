using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

public class IdeaWall : IGame 
{
    public string Name => "ideawall";

    public async Task JsonMessage(string jsonPayload, GameHub gameHub)
    {
        var player = gameHub.GetPlayerByConnectionId();
        
        dynamic payload = JsonConvert.DeserializeObject(jsonPayload);

        string idea = payload.idea;

        if (!string.IsNullOrWhiteSpace(idea))
            await gameHub.Clients.Client(gameHub.GetAdmin().ConnectionId).SendAsync("gameUpdate", player.Name,  idea);

    }

    public async Task Message(string payload, GameHub hub)
    {
    }

    public Task Start(GameHub hub)
    {
        return Task.CompletedTask;
    }
}