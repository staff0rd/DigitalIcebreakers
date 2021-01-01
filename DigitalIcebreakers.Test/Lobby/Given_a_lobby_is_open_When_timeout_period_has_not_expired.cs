using DigitalIcebreakers;
using DigitalIcebreakers.Test;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_lobby_is_open_When_timeout_period_has_not_expired
    {
        LobbyManager lobbys;

        public Given_a_lobby_is_open_When_timeout_period_has_not_expired()
        {
            lobbys = ObjectMother.GetLobbyManager(new List<Lobby> { new Lobby { Id = "lobby" } });
            lobbys.CloseInactive(1);
        }

        [Fact]
        public void Then_the_lobby_remains_open()
        {
            var lobby = lobbys.GetLobbyById("lobby");
            lobby.ShouldNotBeNull();
        }
    }
}
