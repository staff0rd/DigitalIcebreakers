using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public abstract class Game
    {
        public virtual Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task AdminMessage(JToken admin, GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task ClientMessage(JToken client, GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task SystemMessage(JToken system, GameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}