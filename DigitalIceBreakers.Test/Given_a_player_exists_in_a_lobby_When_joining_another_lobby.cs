using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class Given_a_player_exists_in_a_lobby_When_joining_another_lobby
    {
        Guid _lobbyIdNew = Guid.NewGuid();
        Guid _lobbyIdOld = Guid.NewGuid();

        List<Lobby> _lobbys;

        public Given_a_player_exists_in_a_lobby_When_joining_another_lobby()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> {
                new Lobby { Id = _lobbyIdOld, Players = new List<Player> { new Player { Id = playerId, IsAdmin = true }, new Player { Id = playerId } } },
                new Lobby { Id = _lobbyIdNew, Players = new List<Player> { new Player { Id = playerId, IsAdmin = true } } }
            };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);
            gameHub.CreateLobby(Guid.NewGuid(), null, new User(playerId, "")).Wait();
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
