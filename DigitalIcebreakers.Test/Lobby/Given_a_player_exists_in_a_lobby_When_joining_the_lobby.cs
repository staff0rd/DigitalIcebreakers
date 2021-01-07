using DigitalIcebreakers;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_player_exists_in_a_lobby_When_joining_the_lobby
    {
        string _lobbyIdOld = "OLD";

        List<Lobby> _lobbys;

        public Given_a_player_exists_in_a_lobby_When_joining_the_lobby()
        {
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> {
                new Lobby { Id = _lobbyIdOld, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsPresenter = true }, new Player { Id = playerId } } }
            };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);

            gameHub.ConnectToLobby(new User { Id = playerId }, _lobbyIdOld).Wait();
        }

        [Fact]
        public void Then_join_them_to_the_new_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdOld).Players.Count(p => !p.IsPresenter).ShouldBe(1);
        }
    }
}
