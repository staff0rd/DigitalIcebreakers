using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_lobby_is_open_When_no_new_game_started_for_period
    {
        LobbyManager lobbys;

        [TestInitialize]
        public async Task Setup()
        {
            lobbys = ObjectMother.GetLobbyManager(new List<Lobby> { new Lobby { Id = "lobby" } });
            await Task.Delay(1000);
            lobbys.CloseInactive(1);
        }

        [TestMethod]
        public void Then_close_lobby()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldBeNull();
        }
    }
}
