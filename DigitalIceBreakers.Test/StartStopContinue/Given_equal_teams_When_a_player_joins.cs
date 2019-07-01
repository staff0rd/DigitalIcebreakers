using DigitalIcebreakers.Games;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Threading.Tasks;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class Given_an_Admin_message_When_received_by_hub
    {
        [TestInitialize]
        public async Task Setup()
        {
            var playerId = Guid.NewGuid();
            var game = new StartStopContinue();
            var lobby = ObjectMother.GetLobby(Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var gameHub = ObjectMother.GetMockGameHub(playerId, lobby);
            var payload = JsonConvert.SerializeObject(new {
                client = new {content = "CONTENT", lane = 0}
            });
            await gameHub.HubMessage(payload);
        }

        [TestMethod]
        public void Then_can_reserialize()
        {
            _leftTeam.ShouldNotBeEmpty();
            _rightTeam.ShouldBeEmpty();
        }
    }
}
