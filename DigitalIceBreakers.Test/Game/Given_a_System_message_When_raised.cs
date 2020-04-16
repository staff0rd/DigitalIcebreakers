using DigitalIcebreakers.Games;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Linq;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_System_message_When_raised
    {
        private MockGame _game;

        [TestInitialize]
        public void Setup()
        {
            var playerId = Guid.NewGuid();
            var gameHub = ObjectMother.GetMockGameHub(playerId);
            _game = new MockGame(gameHub.Sender, gameHub.Lobbys);
            var lobby = ObjectMother.CreateLobby(gameHub, Guid.NewGuid(), _game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var payload = JsonConvert.SerializeObject(new {
                system = new {content = "CONTENT", lane = 0}
            });
            Should.NotThrow(async () => { await gameHub.HubMessage(payload); });
        }

        [TestMethod]
        public void Then_is_forwarded_to_Game()
        {
            _game.AdminMessages.ShouldBeEmpty();
            _game.ClientMessages.ShouldBeEmpty();
            _game.SystemMessages.ShouldNotBeEmpty();   
        }
    }
}
