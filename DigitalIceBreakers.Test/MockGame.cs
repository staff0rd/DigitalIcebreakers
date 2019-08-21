using DigitalIcebreakers.Hubs;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using DigitalIcebreakers.Games;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Test
{
    public class MockGame: Game, IGame
    {
        public List<string> SystemMessages { get; private set;} = new List<string>();
        public List<string> ClientMessages { get; private set;} = new List<string>();
        public List<string> AdminMessages { get; private set;} = new List<string>();

        public string Name => "mockgame";

        public override Task AdminMessage(JToken admin, IGameHub hub)
        {
            AdminMessages.Add(admin.ToString());
            return Task.CompletedTask;
        }

        public async override Task ClientMessage(JToken client, IGameHub hub)
        {
            ClientMessages.Add(client.ToString());
            await hub.SendGameUpdateToPresenter("test");
        }

        public override Task SystemMessage(JToken system, IGameHub hub)
        {
            SystemMessages.Add(system.ToString());
            return Task.CompletedTask;
        }
    }
}