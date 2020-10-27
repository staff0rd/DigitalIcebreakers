using DigitalIcebreakers;
using DigitalIcebreakers.Test;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Test
{
    [TestClass]
    public class Given_a_lobby_is_open_When_timeout_period_has_not_expired
    {
        LobbyManager lobbys;

        [TestInitialize]
        public void Setup()
        {
            lobbys = new LobbyManager(new List<Lobby> { new Lobby { Id = "lobby" } });
            lobbys.CloseInactive(1);
        }

        [TestMethod]
        public void Then_the_lobby_remains_open()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldNotBeNull();
        }
    }
}
