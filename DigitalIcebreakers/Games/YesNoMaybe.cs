using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;

namespace DigitalIcebreakers.Games
{
    public class YesNoMaybe : Game, IGame
    {
        public string Name => "yes-no-maybe";
        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();
        public override async Task ClientMessage(dynamic payload, GameHub hub)
        {   
            string client = payload;
            // 1 = no
            // 0 = yes
            int value;
            if (int.TryParse(client, out value))
                _results[hub.GetPlayerByConnectionId().Id] = value;
            
            await SendUpdate(hub);
        }

        private async Task SendUpdate(GameHub hub)
        {
            var totalPlayers = hub.GetLobby().Players.Count(p => !p.IsAdmin && p.IsConnected);
            var result = new Result { Yes = _results.Where(p => p.Value == 0).Count(), No = _results.Where(p => p.Value == 1).Count() };
            result.Maybe = totalPlayers - result.No - result.Yes;
            await hub.SendGameUpdateToAdmin(result);
        }

        public async override Task AdminMessage(dynamic payload, GameHub hub)
        {
            string admin = payload;
            if (admin == "reset")
                _results.Clear();
            await SendUpdate(hub);
        }

        public class Result
        {
            public int Yes { get; set; }

            public int No { get; set; }

            public int Maybe { get; set; }
        }
    }
}
