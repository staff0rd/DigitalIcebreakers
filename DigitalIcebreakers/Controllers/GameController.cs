
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DigitalIcebreakers.Controllers
{
    [Route("api/[controller]")]
    public class GameController : Controller
    {
        IHubContext<GameHub> _gameHub;
        public GameController(IHubContext<GameHub> gameHub)
        {
            _gameHub = gameHub;
        }

        [HttpGet("{id}")]
        public Lobby Get(Guid id)
        {
            return GameHub.Lobbys.SingleOrDefault(p => p.Id == id) ?? new Lobby();
        }
    }
}
