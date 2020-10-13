using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Linq;
using System;

namespace DigitalIcebreakers.Games
{
    public class NamePicker : Game, IGame
    {
        public class PresenterPayload {
            public Guid? Id { get; set; }
        }

        public override string Name => "namepicker";

        Guid? _lastPicked = null;

        public NamePicker(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionid)
        {
            var json = payload.ToObject<PresenterPayload>();
            var id = json.Id;
            if (id.HasValue) {
                var player = GetPlayerByExternalId(id.Value);
                _lastPicked = player.Id; // TODO: why even have ExternalIds?
            }
            else
            {
                _lastPicked = null;
            }
            await SendToPlayers(connectionid, _lastPicked); 
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            string system = payload.ToString();
            switch (system)
            {
                case "join": await SendToPlayer(connectionId, _lastPicked); break;
            }
        }
    }
}
