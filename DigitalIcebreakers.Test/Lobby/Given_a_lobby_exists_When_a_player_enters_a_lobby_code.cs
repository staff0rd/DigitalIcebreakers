using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_lobby_exists_When_a_player_enters_a_lobby_code
    {
        List<Lobby> _lobbys;

        [TestInitialize]
        public async Task Setup()
        {
            _lobbys = new List<Lobby> { 
                new Lobby { Id = "test", Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true } } } };
            var newPlayerId = Guid.NewGuid();
            var gameHub = ObjectMother.GetMockGameHub(newPlayerId, _lobbys);
            await gameHub.ConnectToLobby(new User { Id = newPlayerId }, "TEST");
        }

        [TestMethod]
        public void Then_the_player_is_joined_to_the_lobby()
        {
            _lobbys.Single().Players.Count.ShouldBe(2); // includes admin
        }
    }
}