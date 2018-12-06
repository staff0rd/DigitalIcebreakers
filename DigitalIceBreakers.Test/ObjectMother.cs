using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;

namespace DigitalIceBreakers.Test
{
    public static class ObjectMother
    {
        public static GameHub GetMockGameHub(Guid playerId, List<Lobby> lobbys)
        {
            var gameHub = new GameHub(new Mock<ILogger<GameHub>>().Object, lobbys);
            gameHub.Context = new Mock<HubCallerContext>().Object;
            var clients = new Mock<IHubCallerClients>();
            clients.Setup(p => p.Client(It.IsAny<string>())).Returns(new Mock<IClientProxy>().Object);
            clients.SetupGet(p => p.Caller).Returns(new Mock<IClientProxy>().Object);
            gameHub.Clients = clients.Object;
            return gameHub;
        }
    }
}
