using DigitalIcebreakers.Hubs;
using System.Collections.Generic;
using Microsoft.Extensions.Options;
using Moq;
using DigitalIcebreakers.Logging;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers.Test
{
    public class MockGameHub : GameHub
    {
        private readonly string _connectionId;
        protected override string ConnectionId => _connectionId;
        public LobbyManager Lobbys => _lobbys;
        public Sender Sender => _send;

        public MockGameHub(List<Lobby> lobbys, string connectionId) 
            : base(new LobbyLogger(new Mock<ILogger<LobbyLogger>>().Object), ObjectMother.GetLobbyManager(lobbys), new Mock<IOptions<AppSettings>>().Object, new ClientHelper(ObjectMother.GetMockContext().Object))
        {
            _connectionId = connectionId;
        }
    }
}