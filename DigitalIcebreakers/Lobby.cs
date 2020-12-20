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

        internal Player Admin => Players.SingleOrDefault(p => p.IsAdmin);

        public int PlayerCount => GetConnectedPlayers().Count();

        public IGame CurrentGame { get; set; }
        
        public int Number { get; set; }

        internal Player[] GetConnectedPlayers()
        {
            return Players.Where(p => p.IsConnected && !p.IsAdmin).ToArray();
        }

        internal Player[] GetTotalPlayers()
        {
            return Players.Where(p => !p.IsAdmin).ToArray();
        }
    }
}
