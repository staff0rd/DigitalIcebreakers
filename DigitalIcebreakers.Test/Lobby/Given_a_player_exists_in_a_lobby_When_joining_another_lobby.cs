using DigitalIcebreakers;
using DigitalIcebreakers.Test;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test
{
        public class Given_a_player_exists_in_a_lobby_When_joining_another_lobby
    {
        string _lobbyIdNew;
        string _lobbyIdOld;

        List<Lobby> _lobbys;

        public Given_a_player_exists_in_a_lobby_When_joining_another_lobby()
        {
            var lobbyIds = new LobbyIdService();
            _lobbyIdNew = "NEW";
            _lobbyIdOld = "OLD";
            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> {
                new Lobby { Id = _lobbyIdOld, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true }, new Player { Id = playerId } } },
                new Lobby { Id = _lobbyIdNew, Players = new List<Player> { new Player { Id = Guid.NewGuid(), IsAdmin = true } } }
            };

            var gameHub = ObjectMother.GetMockGameHub(playerId, _lobbys);

            gameHub.ConnectToLobby(new User { Id = playerId }, _lobbyIdNew).Wait();
        }

        [Fact]
        public void Then_join_them_to_the_new_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdNew).Players.Count(p => !p.IsAdmin).ShouldBe(1);
        }

        [Fact]
        public void Then_remove_them_from_the_old_lobby()
        {
            _lobbys.SingleOrDefault(p => p.Id == _lobbyIdOld).Players.Count(p => !p.IsAdmin).ShouldBe(0);
        }
    }
}
