using DigitalIcebreakers;
using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalIceBreakers.Test
{
    public class MockGamehub : GameHub
    {
        public List<object[]> SentToAdmin { get; private set;} = new List<object[]>();

        public MockGamehub(ILogger<GameHub> logger, List<Lobby> lobbys, IOptions<AppSettings> settings) : base(logger, lobbys, settings)
        {
        }

        public override Task SendGameUpdateToAdmin(params object[] parameters)
        {
            this.SentToAdmin.Add(parameters);
            return Task.CompletedTask;
        }
    }
    public static class ObjectMother
    {
        public static MockGamehub GetMockGameHub(Guid contextId, List<Lobby> lobbys)
        {
            var gameHub = new MockGamehub(new Mock<ILogger<GameHub>>().Object, lobbys, null);
            var context = new Mock<HubCallerContext>();
            context.Setup(p => p.ConnectionId).Returns(contextId.ToString());
            gameHub.Context = context.Object;
            var clients = new Mock<IHubCallerClients>();
            clients.Setup(p => p.Client(It.IsAny<string>())).Returns(new Mock<IClientProxy>().Object);
            clients.SetupGet(p => p.Caller).Returns(new Mock<IClientProxy>().Object);
            gameHub.Clients = clients.Object;
            return gameHub;
        }

        public static MockGamehub GetMockGameHub(Guid contextId, Lobby lobby) {
            return GetMockGameHub(contextId, new List<Lobby> { lobby });
        }

        public static Lobby GetLobby(Guid adminId, IGame game) {
            return new Lobby
            {
                CurrentGame = game,
                Id = Guid.NewGuid(),
                Players = new List<Player> { GetPlayer(adminId, true) }
            };
        }

        public static Player GetPlayer(Guid id, bool isAdmin = false) {
            return new Player { ConnectionId = id.ToString(), Id = id, ExternalId = id, IsAdmin = isAdmin, Name = id.ToString() };
        }
    }
}
