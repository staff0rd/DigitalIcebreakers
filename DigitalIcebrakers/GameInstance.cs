using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebrakers
{
    public class GameInstance
    {
        public Guid Id { get; set; }

        public string OwnerConnectionId { get; set; }

        public List<Player> Players = new List<Player>();
    }
}
