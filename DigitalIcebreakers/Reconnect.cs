using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Reconnect
    {
        public Guid PlayerId { get; set; }

        public string PlayerName { get; set; }

        public string LobbyId { get; set; }

        public string LobbyName { get; internal set; }

        public bool IsAdmin { get; internal set; }

        public List<User> Players { get; internal set; }
        public string CurrentGame { get; internal set; }
    }
}
