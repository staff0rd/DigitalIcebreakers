    using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using Newtonsoft.Json.Linq;

public class Reaction : Game, IGame 
{
    public string Name => "react";

    readonly Dictionary<Guid, int> _selections = new Dictionary<Guid, int>();

    private Shape[] _state = new Shape[0]; 
    
    public async override Task ClientMessage(JToken client, IGameHub hub)
    {
        var player = hub.GetPlayerByConnectionId();
        var selectedId = client.ToObject<int>();
        if (!_selections.ContainsKey(player.Id)) 
        {
            _selections.Add(player.Id, selectedId);
            await hub.SendGameUpdateToPresenter(player.ExternalId, player.Name, selectedId);
        }
    }

    public async override Task AdminMessage(JToken admin, IGameHub hub)
    {
        var state = admin.ToObject<Shape[]>();
        _state = state;
        _selections.Clear();
        await hub.SendGameUpdateToPlayers(new ClientPayload { Shapes = state });
    }

    public async override Task SystemMessage(JToken payload, IGameHub hub) 
    {
        var player = hub.GetPlayerByConnectionId();
        var externalId = player.ExternalId;
        string system = payload.ToString();
        switch (system)
        {
            case "join": await Join(hub, player); break;
        }
    }

    private async Task Join(IGameHub hub, Player player)
    {
        if (!player.IsAdmin)
        {
            var id = player.ExternalId;

            await hub.SendGameUpdateToPlayer(player, new ClientPayload { Shapes = _state});
        }
    }
}