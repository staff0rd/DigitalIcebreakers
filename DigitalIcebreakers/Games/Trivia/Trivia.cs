namespace DigitalIcebreakers.Games
{
    public class Trivia : Poll, IGame
    {
        public override string Name => "trivia";
        public Trivia(Sender sender, LobbyManager lobbyManager) : base(sender, lobbyManager)
        {
        }
    }
}