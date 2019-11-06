using System.Threading.Tasks;
using DigitalIcebreakers.Games;
using Newtonsoft.Json.Linq;

public class Reaction : Game, IGame 
{
    public string Name => "react";

    private Shape[] _state = new Shape[0]; 
    
    public async override Task ClientMessage(JToken client, IGameHub hub)
    {
        
    }

    public async override Task AdminMessage(JToken admin, IGameHub hub)
    {
        var state = admin.ToObject<Shape[]>();
        _state = state;
        await hub.SendGameUpdateToPlayers(state);
    }
}