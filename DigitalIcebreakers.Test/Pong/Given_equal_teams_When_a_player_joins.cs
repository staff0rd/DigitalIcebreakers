using DigitalIcebreakers.Test;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test.Pong
{
    public class Given_equal_teams_When_a_player_joins
    {
        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int>();
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        public Given_equal_teams_When_a_player_joins()
        {
            var playerId = Guid.NewGuid();
            var gameHub = ObjectMother.GetMockGameHub(playerId);
            var game = new DigitalIcebreakers.Games.Pong(gameHub.Sender, gameHub.Lobbys, _leftTeam, _rightTeam);
            var lobby = ObjectMother.CreateLobby(gameHub, Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            lobby.NewGame(game);
            var payload = JsonConvert.SerializeObject(new {
                client = "join"
            });
            gameHub.HubMessage(payload).Wait();
        }

        [Fact]
        public void Then_join_them_to_left_team()
        {
            _leftTeam.ShouldNotBeEmpty();
            _rightTeam.ShouldBeEmpty();
        }
    }
}
