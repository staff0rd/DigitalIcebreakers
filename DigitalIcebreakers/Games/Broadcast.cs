using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json.Linq;

public class Broadcast : Game, IGame 
{
    public string Name => "broadcast";
    
    public async override Task ClientMessage(JToken client, IGameHub hub)
    {
        await hub.SendGameUpdateToPresenter("d");   
    }

    public async override Task AdminMessage(JToken admin, IGameHub hub)
    {
        string message = admin.ToObject<string>();
        await hub.SendGameUpdateToPlayers(message);
    }
}