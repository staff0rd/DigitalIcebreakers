using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public class FistOfFive : Trivia, IGame
    {
        protected override bool ShuffleAnswers => false;
        public FistOfFive(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager) { }
    }
}
