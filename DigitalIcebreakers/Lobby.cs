using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Lobby
    {
        public Guid Id { get; set; }

        public List<Player> Players = new List<Player>();
    }
}
