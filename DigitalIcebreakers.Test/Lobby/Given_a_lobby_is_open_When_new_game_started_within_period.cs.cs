using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_lobby_is_open_When_new_game_started_within_period
    {
        LobbyManager lobbys;

        [TestInitialize]
        public async Task Setup()
        {
            var lobby = new Lobby { Id = "lobby" };
            lobbys = ObjectMother.GetLobbyManager(new List<Lobby> { lobby });
            await Task.Delay(1000);
            lobby.NewGame(null);
            lobbys.CloseInactive(1);
        }

        [TestMethod]
        public void Then_close_lobby()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldNotBeNull();
        }
    }
}
