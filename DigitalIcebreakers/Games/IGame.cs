using DigitalIcebreakers.Hubs;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Start(IGameHub hub);

        string Name { get; }

        Task AdminMessage(JToken admin, IGameHub hub);

        Task ClientMessage(JToken client, IGameHub hub);

        Task SystemMessage(JToken system, IGameHub hub);
    }
}
