using DigitalIcebreakers.Hubs;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Start(GameHub hub);

        string Name { get; }

        Task AdminMessage(JToken admin, GameHub hub);

        Task ClientMessage(JToken client, GameHub hub);

        Task SystemMessage(JToken system, GameHub hub);
    }
}
