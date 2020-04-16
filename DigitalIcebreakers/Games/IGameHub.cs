using System.Threading.Tasks;
using DigitalIcebreakers;

namespace DigitalIcebreakers.Games
{
    public interface IGameHub
    {
        Task SendGameUpdateToPresenter<T>(T payload, Player player = null);

        Player GetPlayerByConnectionId();

        Task SendGameUpdateToPlayers(object payload);

        Task SendGameUpdateToPlayer(Player player, object payload);

        Player[] GetPlayers();
    }
}