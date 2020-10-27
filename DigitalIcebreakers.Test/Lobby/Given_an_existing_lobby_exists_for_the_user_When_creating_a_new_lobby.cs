using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using DigitalIcebreakers.Test;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Internal;
using Microsoft.Extensions.Logging;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalIcebreakers.Test
{
        public class Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby
    {
        List<Lobby> _lobbys;
        LobbyIdService _lobbyIds = new LobbyIdService();
        string _lobbyId;
        public Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby()
        {
            _lobbyId = _lobbyIds.GetCode();
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> { new Lobby { Id = _lobbyId, Players = new List<Player> { new Player { Id = playerId, IsAdmin = true } } } };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);
            gameHub.CreateLobby(_lobbyIds.GetCode(), null, new User(playerId, "")).Wait();
        }

        [Fact]
        public void Then_create_a_new_lobby()
        {
            _lobbys.Count(p => p.Id != _lobbyId).ShouldBe(1);
        }

        [Fact]
        public void Then_close_the_old_lobby()
        {
            _lobbys.Count(p => p.Id == _lobbyId).ShouldBe(0);
        }
    }
}
