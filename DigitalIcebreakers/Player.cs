using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Player : User
    {
        public string ConnectionId { get; set; }

        public bool IsAdmin { get; internal set; }

        public bool IsConnected { get; set; }
    }

    public class User {

        public string Name { get; set; }
        public Guid Id { get; set; }
    }
}
