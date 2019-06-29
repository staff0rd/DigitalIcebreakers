using DigitalIcebreakers.Hubs;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Start(GameHub hub);

        string Name { get; }

        Task Message(dynamic payload, GameHub hub);
    }
}
