using DigitalIcebreakers.Logging;
using Shouldly;
using System;
using System.Collections.Generic;
using Xunit;
using Xunit.Abstractions;

namespace DigitalIcebreakers.Test
{
    public class Given_a_lobby_update_When_logging : IDisposable
    {
        private readonly ITestOutputHelper _output;
        private readonly Divergic.Logging.Xunit.ICacheLogger<LobbyLogger> _logger;
        private readonly LobbyLogger _lobbyLogger;

        public Given_a_lobby_update_When_logging(ITestOutputHelper output)
        {
            _output = output;
            _logger = _output.BuildLoggerFor<LobbyLogger>();
            _lobbyLogger = new LobbyLogger(_logger);
        }

        public void Dispose()
        {
            _logger?.Dispose();
        }

        [Fact]
        public void Should_log_lobbyId()
        {
            var lobbyId = "id";
            _lobbyLogger.Log("Created", new Lobby { Id = lobbyId });
            _logger.Last.Message.ShouldContain($"Id: {lobbyId}");
        }

        [Fact]
        public void Should_log_lobbyName()
        {
            _lobbyLogger.Log("Created", new Lobby { Name = "HI" });
            _logger.Last.Message.ShouldContain($"Name: HI");
        }

        [Fact]
        public void Should_log_lobby_playerCount()
        {
            _lobbyLogger.Log("Created", new Lobby { Players = new List<Player> { new Player { IsPresenter = true }, new Player(), new Player { IsConnected = true, IsRegistered = true } } });
            _logger.Last.Message.ShouldContain($"Players: (1/2)");
        }

        [Fact]
        public void Should_log_lobbyNumber()
        {
            _lobbyLogger.Log("Created", new Lobby { Number = 3 });
            _logger.Last.Message.ShouldContain("#3");
        }
    }
}