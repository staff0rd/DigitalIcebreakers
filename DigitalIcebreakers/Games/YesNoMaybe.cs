using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class YesNoMaybe : Game, IGame
    {
        public override string Name => "yes-no-maybe";
        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();

        public YesNoMaybe(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {   
            string client = payload.ToString();
            // 1 = no
            // 0 = yes
            int value;
            if (int.TryParse(client, out value))
                _results[GetPlayerByConnectionId(connectionId).Id] = value;
            
            await SendUpdate(connectionId);
        }

        private async Task SendUpdate(string connectionId)
        {
            var totalPlayers = GetPlayerCount(connectionId);
            var result = new Result { Yes = _results.Where(p => p.Value == 0).Count(), No = _results.Where(p => p.Value == 1).Count() };
            result.Maybe = totalPlayers - result.No - result.Yes;
            await SendToPresenter(connectionId, result);
        }

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {
            string admin = payload.ToString();
            if (admin == "reset")
                _results.Clear();
            await SendUpdate(connectionId);
        }

        public class Result
        {
            public int Yes { get; set; }

            public int No { get; set; }

            public int Maybe { get; set; }
        }
    }
}
