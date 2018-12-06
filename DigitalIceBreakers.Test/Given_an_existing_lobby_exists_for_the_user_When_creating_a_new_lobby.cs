using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.SignalR;
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
            var gameHub = new GameHub(new Mock<ILogger<GameHub>>().Object, _lobbys);

            gameHub.Context = new Mock<HubCallerContext>().Object;
            var clients = new Mock<IHubCallerClients>();
            clients.Setup(p => p.Clients(It.IsAny<string>())).Returns(new Mock<IClientProxy>().Object);
            gameHub.Clients = clients.Object;
            gameHub.CreateLobby(Guid.NewGuid(), null, new User(playerId, "")).Wait();
        }

        [TestMethod]
        public void Then_do_not_create_a_new_lobby()
        {
            _lobbys.Count.ShouldBe(1);
        }
    }
}
