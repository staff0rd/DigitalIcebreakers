using DigitalIcebreakers;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_player_exists_in_a_lobby_When_joining_the_lobby
    {
        Guid _lobbyIdOld = Guid.NewGuid();

        List<Lobby> _lobbys;

        [TestInitialize]
        public void Setup()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> {
                new Lobby { Id = _lobbyIdOld, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true }, new Player { Id = playerId } } }
            };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);

            gameHub.ConnectToLobby(new User { Id = playerId }, _lobbyIdOld).Wait();
        }

        [TestMethod]
        public void Then_join_them_to_the_new_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdOld).Players.Count(p => !p.IsAdmin).ShouldBe(1);
        }
    }
}
