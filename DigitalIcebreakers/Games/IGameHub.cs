using System.Threading.Tasks;

namespace DigitalIcebreakers.Games
{
    public interface IGameHub
    {
        Task SendGameUpdateToPresenter(params object[] parameters);

        Player GetPlayerByConnectionId();

        Task SendGameUpdateToPlayers(params object[] parameters);

        Task SendGameUpdateToPlayer(Player player, params object[] parameters);

        Player[] GetPlayers();
    }
}