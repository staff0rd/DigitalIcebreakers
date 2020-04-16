using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class StartStopContinue : Game, IGame 
    {
        public override string Name => "startstopcontinue";

        public StartStopContinue(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}
        
        public async override Task OnReceivePlayerMessage(JToken client, string connectionId)
        {
            var idea = client.ToObject<Idea>();

            if (idea != null)
            {
                await SendToPresenter(connectionId, idea, GetPlayerByConnectionId(connectionId));
            }
        }
    }
}