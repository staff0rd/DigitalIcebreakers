using System.Threading.Tasks;
using DigitalIcebreakers.Hubs;

namespace DigitalIcebreakers.Games
{
    public abstract class Game
    {
        public virtual Task Start(GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task AdminMessage(dynamic admin, GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task ClientMessage(dynamic client, GameHub hub)
        {
            return Task.CompletedTask;
        }

        public virtual Task SystemMessage(dynamic system, GameHub hub)
        {
            return Task.CompletedTask;
        }
    }
}