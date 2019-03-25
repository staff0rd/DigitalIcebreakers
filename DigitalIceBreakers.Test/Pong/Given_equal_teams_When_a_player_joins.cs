using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Text;

namespace DigitalIceBreakers.Test.Pong
{
    [TestClass]
    public class Given_equal_teams_When_a_player_joins
    {
        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int>();
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        public Given_equal_teams_When_a_player_joins()
        {
            var playerId = Guid.NewGuid();
            var game = new DigitalIcebreakers.Games.Pong(_leftTeam, _rightTeam);
            var lobby = ObjectMother.GetLobby(Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var gameHub = ObjectMother.GetMockGameHub(playerId, lobby);
            game.Message("join", gameHub).Wait();
        }

        [TestMethod]
        public void Then_join_them_to_left_team()
        {
            _leftTeam.ShouldNotBeEmpty();
            _rightTeam.ShouldBeEmpty();
        }
    }
}
