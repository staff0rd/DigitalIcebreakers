using Shouldly;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_lobby_is_open_When_new_game_started_within_period
    {
        LobbyManager lobbys;

        public Given_a_lobby_is_open_When_new_game_started_within_period()
        {
            var lobby = new Lobby { Id = "lobby" };
            lobbys = ObjectMother.GetLobbyManager(new List<Lobby> { lobby });
            Task.Delay(1000).Wait();
            lobby.NewGame(null);
            lobbys.CloseInactive(1);
        }

        [Fact]
        public void Then_close_lobby()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldNotBeNull();
        }
    }
}
