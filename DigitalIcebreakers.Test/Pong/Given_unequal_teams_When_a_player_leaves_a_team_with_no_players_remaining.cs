using Newtonsoft.Json;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test.Pong
{
        public class Given_unequal_teams_When_a_player_leaves_a_team_with_no_players_remaining
    {

        static readonly Guid adminId = Guid.NewGuid();
        static readonly Guid player1Id = Guid.NewGuid();
        static readonly Guid player2Id = Guid.NewGuid();
        static readonly Guid leavingPlayerId = Guid.NewGuid();
        private readonly Games.Pong _game;
        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int> { { player1Id, 0 }, { player2Id, 0 } };
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>{ { leavingPlayerId, 0 } };

        public Given_unequal_teams_When_a_player_leaves_a_team_with_no_players_remaining()
        {
            var gameHub = ObjectMother.GetMockGameHub(adminId);
            _game = new DigitalIcebreakers.Games.Pong(gameHub.Sender, gameHub.Lobbys, _leftTeam, _rightTeam);
            var lobby = ObjectMother.CreateLobby(gameHub, adminId, _game);
            lobby.Players.Add(ObjectMother.GetPlayer(leavingPlayerId));
            lobby.Players.Add(ObjectMother.GetPlayer(player1Id));
            lobby.Players.Add(ObjectMother.GetPlayer(player2Id));
        }

        [Fact]
        public async Task Then_move_one_player_over()
        {
            await _game.OnReceiveSystemMessage("leave", leavingPlayerId.ToString());
            _leftTeam.Count.ShouldBe(1);
            _rightTeam.Count.ShouldBe(1);
        }
    }
}
