using DigitalIcebreakers;
using DigitalIcebreakers.Test;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_player_exists_in_a_lobby_When_joining_another_lobby
    {
        Guid _lobbyIdNew = Guid.NewGuid();
        Guid _lobbyIdOld = Guid.NewGuid();

        List<Lobby> _lobbys;

        [TestInitialize]
        public async Task Setup()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> {
                new Lobby { Id = _lobbyIdOld, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true }, new Player { Id = playerId } } },
                new Lobby { Id = _lobbyIdNew, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true } } }
            };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);

            await gameHub.ConnectToLobby(new User { Id = playerId }, _lobbyIdNew);
        }

        [TestMethod]
        public void Then_join_them_to_the_new_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdNew).Players.Count(p => !p.IsAdmin).ShouldBe(1);
        }

        [TestMethod]
        public void Then_remove_them_from_the_old_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdOld).Players.Count(p => !p.IsAdmin).ShouldBe(0);
        }
    }
}
