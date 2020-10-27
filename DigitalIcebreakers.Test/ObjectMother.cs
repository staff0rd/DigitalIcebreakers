using DigitalIcebreakers.Games;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;

namespace DigitalIcebreakers.Test
{
    public static class ObjectMother
    {
        public static LobbyManager GetLobbyManager(List<Lobby> lobbys)
        {
            return new LobbyManager(lobbys, new Mock<ILogger<LobbyManager>>().Object, new LobbyIdService());
        }

        public static Mock<IHubContext<GameHub>> GetMockContext()
        {
            var clients = new Mock<IHubClients>();
            clients.Setup(p => p.Client(It.IsAny<string>())).Returns(new Mock<IClientProxy>().Object);
            clients.Setup(p => p.Clients(It.IsAny<IReadOnlyList<string>>())).Returns(new Mock<IClientProxy>().Object);
            //clients.SetupGet(p => p.Caller).Returns(new Mock<IClientProxy>().Object);
            var context = new Mock<IHubContext<GameHub>>();
            context.Setup(p => p.Clients).Returns(clients.Object);
            return context;
        }

        public static MockGameHub GetMockGameHub(Guid contextId, List<Lobby> lobbys)
        {
            var gameHub = new MockGameHub(lobbys, contextId.ToString());
            var context = new Mock<HubCallerContext>();
            context.Setup(p => p.ConnectionId).Returns(contextId.ToString());
            gameHub.Context = context.Object;
            return gameHub;
        }

        public static MockGameHub GetMockGameHub(Guid contextId, Lobby lobby)
        {
            return GetMockGameHub(contextId, new List<Lobby> { lobby });
        }

        public static MockGameHub GetMockGameHub(Guid contextId)
        {
            return GetMockGameHub(contextId, new List<Lobby>());
        }

        public static Lobby CreateLobby(MockGameHub hub, Guid adminId, Game game)
        {
            var lobby  = hub.Lobbys.CreateLobby("my lobby", GetPlayer(adminId, true));
            lobby.NewGame(game);
            return lobby;
        }

        public static Player GetPlayer(Guid id, bool isAdmin = false) {
            return new Player { ConnectionId = id.ToString(), Id = id, ExternalId = id, IsAdmin = isAdmin, Name = id.ToString() };
        }
    }
}
