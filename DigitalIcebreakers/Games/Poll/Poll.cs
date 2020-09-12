using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Poll : Game, IGame
    {
        public override string Name => "poll";

        SelectableAnswers _lastAnswers;

        public Poll(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {   
            var client = payload.ToObject<SelectedAnswer>();
            var player = GetPlayerByConnectionId(connectionId);
            await SendToPresenter(connectionId, client, player);
        }

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {
            var answers = payload.ToObject<SelectableAnswers>();
            _lastAnswers = answers;
            await SendToPlayers(connectionId, answers);
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            string system = payload.ToString();
            switch (system)
            {
                case "join": await SendToPlayer(connectionId, _lastAnswers); break;
            }
        }
    }
}
