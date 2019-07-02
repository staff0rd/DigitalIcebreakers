using DigitalIcebreakers.Games;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class Given_an_Admin_message_When_received_by_hub
    {
        private MockGamehub _gameHub;

        [TestInitialize]
        public async Task Setup()
        {
            var playerId = Guid.NewGuid();
            var game = new StartStopContinue();
            var lobby = ObjectMother.GetLobby(Guid.NewGuid(), game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            _gameHub = ObjectMother.GetMockGameHub(playerId, lobby);
            var payload = JsonConvert.SerializeObject(new {
                client = new {content = "CONTENT", lane = 0}
            });
            Should.NotThrow(async () => { await _gameHub.HubMessage(payload); });
        }

        [TestMethod]
        public void Then_can_reserialize()
        {
            _gameHub.SentToAdmin.Count.ShouldBe(1);
            _gameHub.SentToAdmin.First().Count().ShouldBe(1);
            dynamic payload = JsonConvert.DeserializeObject(_gameHub.SentToAdmin.First().ToString());
            string content = payload.client.content;
            content.ShouldBe("CONTENT");
        }
    }
}
