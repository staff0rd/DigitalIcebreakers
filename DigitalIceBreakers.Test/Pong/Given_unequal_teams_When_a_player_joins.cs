using DigitalIcebreakers.Test;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Test.Pong
{
    [TestClass]
    public class Given_unequal_teams_When_a_player_joins
    {

        Guid playerId = Guid.NewGuid();
        Dictionary<Guid, int> _leftTeam = new Dictionary<Guid, int> { { Guid.NewGuid(), 0 } };
        Dictionary<Guid, int> _rightTeam = new Dictionary<Guid, int>();

        [TestInitialize]
        public async Task Setup()
        {
            var game = new DigitalIcebreakers.Games.Pong(_leftTeam, _rightTeam);
            var lobby = ObjectMother.GetLobby(Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var gameHub = ObjectMother.GetMockGameHub(playerId, lobby);
            var payload = JsonConvert.SerializeObject(new {
                client = "join"
            });
            await gameHub.HubMessage(payload);
        }

        [TestMethod]
        public void Then_join_them_to_right_team()
        {
            _leftTeam.Count.ShouldBe(1);
            _rightTeam.Count.ShouldBe(1);
        }
    }
}
