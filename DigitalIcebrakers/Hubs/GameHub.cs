using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DigitalIcebrakers.Controllers;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebrakers.Hubs
{
    public class GameHub : Hub
    {
        public static List<GameInstance> Games = new List<GameInstance>();

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

        public async Task Join(Guid id, string user)
        {
            await Leave();
            var game = Games.SingleOrDefault(p => p.Id == id);
            var player = new Player { ConnectionId = Context.ConnectionId, Name = user, Id = Guid.NewGuid() };
            game.Players.Add(player);

            var admin = Clients.Client(game.Players.Single(p => p.IsAdmin).ConnectionId);
            await admin.SendAsync("Joined", new Player { Name = player.Name, Id = player.Id }, game.Players.Count);
        }

        public async Task Leave()
        {
            var gamePlayersToRemove = Games.SelectMany(p => p.Players.Where((pl) => pl.ConnectionId == Context.ConnectionId), (game, player) => new { game, player }).ToList();
            foreach (var gamePlayer in gamePlayersToRemove)
            {
                gamePlayer.game.Players.Remove(gamePlayer.player);
                Console.WriteLine($"{gamePlayer.player.Name} left");
                var admin = Clients.Client(gamePlayer.game.Players.Single(p => p.IsAdmin).ConnectionId);
                await admin.SendAsync("Left", new Player { Id = gamePlayer.player.Id });
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Leave().Wait();
            return base.OnDisconnectedAsync(exception);
        }
    }
}
