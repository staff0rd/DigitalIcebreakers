using DigitalIcebreakers;
using DigitalIcebreakers.Hubs;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System.Collections.Generic;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby
    {
        GameHub _gameHub;
        List<Lobby> _lobbys;
        public Given_an_existing_lobby_exists_for_the_user_When_creating_a_new_lobby()
        {
            _gameHub = new GameHub(new Mock<ILogger<GameHub>>().Object, _lobbys = new List<Lobby>());
        }

        [TestMethod]
        public void Then_do_not_create_a_new_lobby()
        {
        }
    }
}
