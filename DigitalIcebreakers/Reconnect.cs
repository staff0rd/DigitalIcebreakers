using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Reconnect
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public Guid LobbyId { get; set; }

        public bool IsAdmin { get; internal set; }
        public object Players { get; internal set; }
        public string LobbyName { get; internal set; }
    }
}
