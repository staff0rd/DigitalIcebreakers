using System;
using System.Collections.Generic;
using System.Text;

namespace DigitalIcebreakers.Robot
{
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

        public override string ToString()
        {
            return $"{Name} ({Id.ToString().Split('-')[0]})";
        }
    }
}
