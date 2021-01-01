using Newtonsoft.Json;
using Shouldly;
using System;
using System.Collections.Generic;
using Xunit;

namespace DigitalIcebreakers.Test.Pong
{
        public class Given_unequal_teams_When_a_player_joins
    {

        Guid playerId = Guid.NewGuid();
        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int> { { Guid.NewGuid(), 0 } };
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        public Given_unequal_teams_When_a_player_joins()
        {
            var gameHub = ObjectMother.GetMockGameHub(playerId);
            var game = new DigitalIcebreakers.Games.Pong(gameHub.Sender, gameHub.Lobbys, _leftTeam, _rightTeam);
            var lobby = ObjectMother.CreateLobby(gameHub, Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var payload = JsonConvert.SerializeObject(new {
                system = "join"
            });
            gameHub.HubMessage(payload).Wait();
        }

        [Fact]
        public void Then_join_them_to_right_team()
        {
            _leftTeam.Count.ShouldBe(1);
            _rightTeam.Count.ShouldBe(1);
        }
    }
}
