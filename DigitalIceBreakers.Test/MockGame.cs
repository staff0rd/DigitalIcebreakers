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

        public override string Name => "mockgame";

        public MockGame(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public override Task OnReceivePresenterMessage(JToken admin, string connectionId)
        {
            AdminMessages.Add(admin.ToString());
            return Task.CompletedTask;
        }

        public async override Task OnReceivePlayerMessage(JToken client, string connectionId)
        {
            ClientMessages.Add(client.ToString());
            await SendToPresenter(connectionId, "test");
        }

        public override Task OnReceiveSystemMessage(JToken system, string connectionId)
        {
            SystemMessages.Add(system.ToString());
            return Task.CompletedTask;
        }
    }
}