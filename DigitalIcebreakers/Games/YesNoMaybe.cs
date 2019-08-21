using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class YesNoMaybe : Game, IGame
    {
        public string Name => "yes-no-maybe";
        Dictionary<Guid, int> _results = new Dictionary<Guid, int>();
        public override async Task ClientMessage(JToken payload, IGameHub hub)
        {   
            string client = payload.ToString();
            // 1 = no
            // 0 = yes
            int value;
            if (int.TryParse(client, out value))
                _results[hub.GetPlayerByConnectionId().Id] = value;
            
            await SendUpdate(hub);
        }

        private async Task SendUpdate(IGameHub hub)
        {
            var totalPlayers = hub.GetPlayers().Count();
            var result = new Result { Yes = _results.Where(p => p.Value == 0).Count(), No = _results.Where(p => p.Value == 1).Count() };
            result.Maybe = totalPlayers - result.No - result.Yes;
            await hub.SendGameUpdateToPresenter(result);
        }

        public async override Task AdminMessage(JToken payload, IGameHub hub)
        {
            string admin = payload.ToString();
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
