using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Player : User
    {
        public string ConnectionId { get; set; }

        public bool IsAdmin { get; set; }

        public bool IsConnected { get; set; }

        public Guid ExternalId { get; set; }

        public Player()
        {
            ExternalId = Guid.NewGuid();
        }
    }

    public class User
    {
        public string Name { get; set; }

        public Guid Id { get; set; }

        public User() { }

        public User(Guid id, string name)
        {
            Name = name;
            Id = id;
        }

        public override string ToString() {
            return $"{Name} ({Id.ToString().Split('-')[0]})";
        }
    }
}
