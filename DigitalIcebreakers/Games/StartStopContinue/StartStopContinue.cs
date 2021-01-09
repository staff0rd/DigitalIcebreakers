using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games.StartStopContinue
{

    public class StartStopContinue : Game, IGame
    {

        public StartStopContinue(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) { }

        public override async Task OnReceivePlayerMessage(JToken payload, string connectionId)
        {
            var player = GetPlayerByConnectionId(connectionId);

            var idea = payload.ToObject<Idea>();

            if (idea != null)
            {
                await SendToPresenter(connectionId, idea, player);
            }
        }
    }
}