using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Shouldly;
using System;
using System.Collections.Generic;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby
    {
        List<Lobby> _lobbys;
        public Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby()
        {

            var playerId = Guid.NewGuid();
            _lobbys = new List<Lobby> { new Lobby { Id = Guid.NewGuid(), Players = new List<Player> { new Player { Id = playerId, IsAdmin = true } } } };

            var gameHub = GetMockGameHub(playerId, _lobbys);
            gameHub.CreateLobby(Guid.NewGuid(), null, new User(playerId, "")).Wait();
        }

        static GameHub GetMockGameHub(Guid playerId, List<Lobby> lobbys)
        {
            var gameHub = new GameHub(new Mock<ILogger<GameHub>>().Object, lobbys);
            gameHub.Context = new Mock<HubCallerContext>().Object;
            var clients = new Mock<IHubCallerClients>();
            clients.Setup(p => p.Client(It.IsAny<string>())).Returns(new Mock<IClientProxy>().Object);
            clients.SetupGet(p => p.Caller).Returns(new Mock<IClientProxy>().Object);
            gameHub.Clients = clients.Object;
            return gameHub;
        }

        [TestMethod]
        public void Then_do_not_create_a_new_lobby()
        {
            _lobbys.Count.ShouldBe(1);
        }
    }
}
