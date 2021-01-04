
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class Trivia : Poll, IGame
    {
        public override string Name => "trivia";
        bool CanAnswer = true;
        public Trivia(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) {}

        public async override Task OnReceivePresenterMessage(JToken payload, string connectionId)
        {             
            if (payload.HasValues) {
                var canAnswer = payload.Value<bool?>("canAnswer");
                if (canAnswer.HasValue)
                {
                    CanAnswer = canAnswer.Value;
                    await SendToPlayers(connectionId, new CanAnswerPayload { CanAnswer = CanAnswer });
                }
                else
                {
                    await base.OnReceivePresenterMessage(payload, connectionId);
                }
            }
        }

        public async override Task OnReceiveSystemMessage(JToken payload, string connectionId)
        {
            string action = payload.ToString();
            if (action == "join")
            {
                var player = GetPlayerByConnectionId(connectionId) ;
                if (player != null)
                {
                    await SendToPlayer(connectionId, new CanAnswerPayload { CanAnswer = CanAnswer });
                }
            }
            await base.OnReceiveSystemMessage(payload, connectionId);
        }
    }
}
