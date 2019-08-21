using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

namespace DigitalIcebreakers.Games
{
    public abstract class Game
    {
        public virtual Task Start(IGameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task AdminMessage(JToken admin, IGameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task ClientMessage(JToken client, IGameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task SystemMessage(JToken system, IGameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}