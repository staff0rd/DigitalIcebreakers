using Shouldly;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_lobby_is_open_When_no_new_game_started_for_period
    {
        LobbyManager lobbys;

        public Given_a_lobby_is_open_When_no_new_game_started_for_period()
        {
            lobbys = ObjectMother.GetLobbyManager(new List<Lobby> { new Lobby { Id = "lobby" } });
            Task.Delay(1500).Wait();
            lobbys.CloseInactive(1);
        }

        [Fact]
        public void Then_close_lobby()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldBeNull();
        }
    }
}
