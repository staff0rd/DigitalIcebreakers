using DigitalIcebreakers.Games;
using Newtonsoft.Json;
using Shouldly;
using System;
using System.Linq;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_Client_message_When_received_by_hub
    {
        private MockGameHub _gameHub;
        private MockGame _game;

        public Given_a_Client_message_When_received_by_hub()
        {
            var playerId = Guid.NewGuid();
            _gameHub = ObjectMother.GetMockGameHub(playerId);
            _game = new MockGame(_gameHub.Sender, _gameHub.Lobbys);
            var lobby = ObjectMother.CreateLobby(_gameHub, Guid.NewGuid(), _game);
            lobby.Players.Add(ObjectMother.GetPlayer(playerId));
            var payload = JsonConvert.SerializeObject(new {
                client = new {content = "CONTENT", lane = 0}
            });
            Should.NotThrow(async () => { await _gameHub.HubMessage(payload); });
        }

        [Fact]
        public void Then_is_forwarded_to_Game()
        {
            _game.AdminMessages.ShouldBeEmpty();
            _game.ClientMessages.ShouldNotBeEmpty();
            _game.SystemMessages.ShouldBeEmpty();   
        }
    }
}
