using DigitalIcebreakers.Hubs;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGame
    {
        Task Start(string connectionId);
        string Name { get; }

        Task OnReceivePresenterMessage(JToken admin, string connectionid);

        Task OnReceivePlayerMessage(JToken client, string connectionid);

        Task OnReceiveSystemMessage(JToken system, string connectionId);
    }
}
