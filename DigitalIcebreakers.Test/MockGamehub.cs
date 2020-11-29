using DigitalIcebreakers.Hubs;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Moq;

namespace DigitalIcebreakers.Test
{
    public class MockGameHub : GameHub
    {
        private readonly string _connectionId;
        protected override string ConnectionId => _connectionId;
        public LobbyManager Lobbys => _lobbys;
        public Sender Sender => _send;

        public MockGameHub(List<Lobby> lobbys, string connectionId) 
            : base(new Mock<ILogger<GameHub>>().Object, new LobbyManager(lobbys), new Mock<IOptions<AppSettings>>().Object, new ClientHelper(ObjectMother.GetMockContext().Object))
        {
            _connectionId = connectionId;
        }
    }
}