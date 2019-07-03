using DigitalIcebreakers.Hubs;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Start(GameHub hub);

        string Name { get; }

        Task AdminMessage(dynamic admin, GameHub hub);

        Task ClientMessage(dynamic client, GameHub hub);

        Task SystemMessage(dynamic client, GameHub hub);
    }
}
