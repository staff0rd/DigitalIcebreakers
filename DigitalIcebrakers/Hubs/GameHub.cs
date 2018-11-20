using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebrakers.Controllers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace DigitalIcebrakers.Hubs
{
    public class GameHub : Hub
    {
        private ILogger<GameHub> _logger;
        public static List<GameInstance> Games = new List<GameInstance>();

        public GameHub(ILogger<GameHub> logger)
        {
            _logger = logger;
        }

        public void StartGame(Guid id)
        {
            var player = new Player { Name = "Admin", IsAdmin = true, ConnectionId = Context.ConnectionId, Id = Guid.NewGuid() };
            Games.Add(new GameInstance { Id = id, Players = new List<Player> { player } });
        }

        public async Task StopGame()
        {
            var games = Games.SelectMany(p => p.Players, (g, p) => new { g, p }).Where(p => p.p.IsAdmin && p.p.ConnectionId == Context.ConnectionId).Select(p => p.g).ToList();
            foreach (var game in games)
            {
                foreach (var player in game.Players)
                {
                    await Clients.Client(player.ConnectionId).SendAsync("stop");
                }
                Games.Remove(Games.Single(p => p.Id == game.Id));
            }
        }

        public async Task<Player> TryRejoin(Guid id)
        {
            var game = Games.SingleOrDefault(g => g.Id == id);
            if (game != null)
                return game.Players.SingleOrDefault(p => p.ConnectionId == Context.ConnectionId);
            await Clients.Caller.SendAsync("Stop");
            return null;
        }

        public async Task Join(Guid id, string user)
        {
            _logger.LogInformation($"Joined: {Context.ConnectionId}");
            await Leave();
            var game = Games.SingleOrDefault(p => p.Id == id);
            var player = new Player { ConnectionId = Context.ConnectionId, Name = user, Id = Guid.NewGuid() };
            if (game != null)
            {
                game.Players.Add(player);

                var adminConnectionId = game.Players.SingleOrDefault(p => p.IsAdmin)?.ConnectionId;
                if (adminConnectionId == null)
                    await Clients.Caller.SendAsync("Stop");
                else
                {
                    var admin = Clients.Client(adminConnectionId);
                    await admin.SendAsync("Joined", new Player { Name = player.Name, Id = player.Id }, game.Players.Count);
                }
            } else
                await Clients.Caller.SendAsync("Stop");
        }

        public async Task Leave()
        {
            var gamePlayersToRemove = Games.SelectMany(p => p.Players.Where((pl) => pl.ConnectionId == Context.ConnectionId), (game, player) => new { game, player }).ToList();
            foreach (var gamePlayer in gamePlayersToRemove)
            {
                gamePlayer.game.Players.Remove(gamePlayer.player);
                Console.WriteLine($"{gamePlayer.player.Name} left");
                var adminConnectionId = gamePlayer.game.Players.SingleOrDefault(p => p.IsAdmin)?.ConnectionId;
                if (adminConnectionId != null)
                {
                    var admin = Clients.Client(adminConnectionId);
                    await admin.SendAsync("Left", new Player { Id = gamePlayer.player.Id });
                }
            }
        }

        public async override Task OnDisconnectedAsync(Exception exception)
        {
            await Leave();
            await base.OnDisconnectedAsync(exception);
        }
    }
}
