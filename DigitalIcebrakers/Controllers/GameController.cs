using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace DigitalIcebrakers.Controllers
{
    [Route("api/[controller]")]
    public class GameController : Controller
    {
        private static List<GameInstance> Games = new List<GameInstance>();

        [HttpPost("{id}")]
        public HttpStatusCode NewGame(Guid id)
        {
            Games.Add(new GameInstance { Id = id });
            return HttpStatusCode.OK;
        }

        [HttpDelete("{id}")]
        public HttpStatusCode DeleteGame(Guid id)
        {
            Games.Remove(Games.Single(p => p.Id == id));
            return HttpStatusCode.OK;
        }
    }
}
