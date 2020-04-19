using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using Newtonsoft.Json.Linq;

public class Reaction : Game, IGame 
{
    public override string Name => "reaction";

    readonly Dictionary<Guid, int> _selections = new Dictionary<Guid, int>();

    private Shape[] _state = new Shape[0]; 

    public Reaction(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}
    
    public async override Task OnReceivePlayerMessage(JToken client, string connectionId)
    {
        var player = GetPlayerByConnectionId(connectionId);
        var selectedId = client.ToObject<int>();
        if (!_selections.ContainsKey(player.Id)) 
        {
            _selections.Add(player.Id, selectedId);
            await SendToPresenter(connectionId, new AdminPayload { SelectedId =  selectedId }, player);
        }
    }

    public async override Task OnReceivePresenterMessage(JToken admin, string connectionId)
    {
        var state = admin.ToObject<Shape[]>();
        _state = state;
        _selections.Clear();
        await SendToPlayers(connectionId, new ClientPayload { Shapes = state });
    }

    public async override Task OnReceiveSystemMessage(JToken payload, string connectionId) 
    {
        var player = GetPlayerByConnectionId(connectionId);
        var externalId = player.ExternalId;
        string system = payload.ToString();
        switch (system)
        {
            case "join": await Join(player); break;
        }
    }

    private async Task Join(Player player)
    {
        if (!player.IsAdmin)
        {
            var id = player.ExternalId;
            int? selectedId = _selections.ContainsKey(player.Id) ? _selections[player.Id] : (int?)null;

            await SendToPlayer(player, new ClientPayload { Shapes = _state, SelectedId = selectedId });
        }
    }
}