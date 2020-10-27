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
using Xunit;

namespace DigitalIcebreakers.Test
{
        public class Given_no_lobby_exists_for_the_user_When_creating_a_new_lobby
    {
        List<Lobby> _lobbys;
        LobbyIdService _lobbyIds = new LobbyIdService();

        public Given_no_lobby_exists_for_the_user_When_creating_a_new_lobby()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> { new Lobby { Id = "OLD", Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true } } } };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);
            gameHub.CreateLobby(null, new User(playerId, "")).Wait();
        }

        [Fact]
        public void Then_create_a_new_lobby()
        {
            _lobbys.Count.ShouldBe(2);
        }
    }
}
