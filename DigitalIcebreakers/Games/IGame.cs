using DigitalIcebreakers.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Message(string payload, GameHub hub);

        string Name { get; }
    }
}
