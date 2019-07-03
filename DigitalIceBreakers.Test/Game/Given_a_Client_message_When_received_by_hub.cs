using DigitalIcebreakers.Games;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Linq;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_Client_message_When_received_by_hub
    {
        private MockGamehub _gameHub;
        private MockGame _game;

        [TestInitialize]
        public void Setup()
        {
            var playerId = Guid.NewGuid();
            _game = new MockGame();
            var lobby = ObjectMother.GetLobby(Guid.NewGuid(), _game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            _gameHub = ObjectMother.GetMockGameHub(playerId, lobby);
            var payload = JsonConvert.SerializeObject(new {
                client = new {content = "CONTENT", lane = 0}
            });
            Should.NotThrow(async () => { await _gameHub.HubMessage(payload); });
        }

        [TestMethod]
        public void Then_is_forwarded_to_Game()
        {
            _game.AdminMessages.ShouldBeEmpty();
            _game.ClientMessages.ShouldNotBeEmpty();
            _game.SystemMessages.ShouldBeEmpty();   
        }
    }
}
