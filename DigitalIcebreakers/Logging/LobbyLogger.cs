using System.Collections.Generic;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers.Logging
{
    public class LobbyLogger
    {
        private readonly ILogger<LobbyLogger> _logger;
        private readonly List<Lobby> _lobbys;

        public LobbyLogger(ILogger<LobbyLogger> logger, List<Lobby> lobbys)
        {
            _logger = logger;
            _lobbys = lobbys;
        }

        private Log GetLobbyTemplate(Lobby lobby)
        {
            var template = new Log { Template = "Lobbys: {lobbys}", Args = new object[] { _lobbys.Count } };
            if (lobby == null)
            {
                return template;
            }

            return template.Insert(
                "Lobby [#{lobbyNumber}, Name: {lobbyName}, Players: ({connectedPlayerCount}/{totalPlayerCount}) Id: {lobbyId}]",
                new object[] { lobby.Number, lobby.Name, lobby.GetConnectedPlayers().Length, lobby.GetTotalPlayers().Length, lobby.Id }
            );
        }

        public void Log(string action, Lobby lobby)
        {
            GetLobbyTemplate(lobby)
                .Insert("{action}", action)
                .Info(_logger);
        }

        public void Log(Lobby lobby, string template, params object[] args)
        {
            GetLobbyTemplate(lobby)
                .Insert(template, args)
                .Info(_logger);
        }

        public void Log(Player player, string action, Lobby lobby)
        {
            GetLobbyTemplate(lobby)
                .Insert("{action}", action)
                .Insert("{player}", player)
                .Info(_logger);
        }

        public void Log(Player player, string action, Lobby lobby, string template, params object[] args)
        {
            GetLobbyTemplate(lobby)
                .Insert(template, args)
                .Insert("{action}", action)
                .Insert("{player}", player)
                .Info(_logger);
        }

        public void Debug(string message)
        {
            _logger.LogDebug(message);
        }
        public void Error(string message)
        {
            _logger.LogError(message);
        }
    }
}