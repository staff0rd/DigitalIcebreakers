using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using DigitalIcebreakers.Test;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby
    {
        List<Lobby> _lobbys;
        Guid _lobbyId = Guid.NewGuid();
        public Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> { new Lobby { Id = _lobbyId, Players = new List<Player> { new Player { Id = playerId, IsAdmin = true } } } };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);
            gameHub.CreateLobby(Guid.NewGuid(), null, new User(playerId, "")).Wait();
        }

        [TestMethod]
        public void Then_create_a_new_lobby()
        {
            _lobbys.Count(p => p.Id != _lobbyId).ShouldBe(1);
        }

        [TestMethod]
        public void Then_close_the_old_lobby()
        {
            _lobbys.Count(p => p.Id == _lobbyId).ShouldBe(0);
        }
    }
}
