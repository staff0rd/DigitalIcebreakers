using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebrakers
{
    public class Player
    {
        public Guid Id { get; set; }

        public string ConnectionId { get; set; }

        public string Name { get; set; }
        public bool IsAdmin { get; internal set; }
    }
}
