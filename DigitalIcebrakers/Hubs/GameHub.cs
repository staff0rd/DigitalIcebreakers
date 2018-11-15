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
        public async Task Join(Guid id, string user)
        {
            var game = GameController.Games.SingleOrDefault(p => p.Id == id);
            game.Players.Add(new Player { ConnectionId = Context.ConnectionId, Name = user });
            await Clients.All.SendAsync("Joined", user, game.Players.Count);
        }

        public async Task Leave(Guid id)
        {
            var game = GameController.Games.SingleOrDefault(p => p.Id == id);
            var user = game.Players.Single(p => p.ConnectionId == Context.ConnectionId);
            game.Players.Remove(user);
            await Clients.All.SendAsync("Left", user.Name);
        }
    }
}
