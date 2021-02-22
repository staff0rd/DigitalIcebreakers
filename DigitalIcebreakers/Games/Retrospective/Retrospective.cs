using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games.Retrospective
{

    public class Retrospective : Game, IGame
    {
        Category[] _categories;

        public Retrospective(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) { }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            string action = payload.ToString();
            if (action == "join")
            {
                var player = GetPlayerByConnectionId(connectionId);
                if (player != null)
                {
                    if (_categories != null)
                    {
                        await SendToPlayer(connectionId, new { categories = _categories });
                    }
                }
            }
        }

        public override async Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {
            var categories = payload.ToObject<Category[]>();
            if (categories != null)
            {
                _categories = categories;
                await SendToPlayers(connectionId, new { categories = _categories });
            }
        }

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