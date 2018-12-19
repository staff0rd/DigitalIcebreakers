using DigitalIcebreakers.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public abstract class Game
    {
        protected GameHub _hub;

        public Game(GameHub hub)
        {
            _hub = hub;
        }
    }
}
