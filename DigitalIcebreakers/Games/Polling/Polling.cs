using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Polling : Game, IGame
    {
        public override string Name => "polling";

        public Polling(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {   
            var client = payload.ToObject<Answer>();
            var player = GetPlayerByConnectionId(connectionId);
            await SendToPresenter(connectionId, client, player);
        }

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {
            var answers = payload.ToObject<AvailableAnswers>();
            await SendToPlayers(connectionId, answers);
        }
    }
}
