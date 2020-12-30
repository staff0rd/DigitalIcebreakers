using System;
using System.Collections.Generic;

namespace DigitalIcebreakers
{
    public class Reconnect
    {
        public Guid PlayerId { get; set; }

        public string PlayerName { get; set; }

        public string LobbyId { get; set; }

        public string LobbyName { get; set; }

        public bool IsAdmin { get; set; }

        public List<User> Players { get; set; }
        public string CurrentGame { get; set; }
        public bool IsRegistered { get; set; }
    }
}
