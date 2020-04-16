using DigitalIcebreakers.Games;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Linq;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_StopStartContinue_When_client_message_received
    {
        private MockGamehub _gameHub;

        [TestInitialize]
        public void Setup()
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
        public void Then_is_forwarded_to_admin()
        {
            _gameHub.SentToAdmin.Count.ShouldBe(1);
            var idea = _gameHub.SentToAdmin.First() as Idea;
            idea.ShouldNotBeNull();
            idea.Content.ShouldBe("CONTENT");
        }
    }
}
