using System;
using System.Collections.Generic;
using System.Linq;
using DigitalIcebreakers.Games;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Lobby
    {
        public Guid Id { get; set; }

        public List<Player> Players = new List<Player>();

        public string Name { get; set; }

        public string Label => $"{Name} (#{Number}, {Players.Count} players)";

        internal Player Admin => Players.SingleOrDefault(p => p.IsAdmin);

        public IGame CurrentGame { get; set; }
        
        public int Number { get; internal set; }
    }
}
