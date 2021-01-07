using System;
using System.Collections.Generic;
using System.Linq;
using DigitalIcebreakers.Games;
using System.Threading.Tasks;

namespace DigitalIcebreakers
{
    public class Lobby
    {
        public string Id { get; set; }

        public List<Player> Players = new List<Player>();

        public string Name { get; set; }

        internal Player Admin => Players.SingleOrDefault(p => p.IsPresenter);

        public int PlayerCount => GetConnectedPlayers().Count();

        public IGame CurrentGame { get; private set; }

        public int Number { get; set; }
        public DateTime LastModified { get; private set; }

        public Lobby()
        {
            LastModified = DateTime.Now;
        }

        internal Player[] GetConnectedPlayers()
        {
            return Players.Where(p => p.IsConnected && p.IsRegistered && !p.IsPresenter).ToArray();
        }

        internal Player[] GetTotalPlayers()
        {
            return Players.Where(p => !p.IsPresenter).ToArray();
        }

        public void NewGame(IGame game)
        {
            CurrentGame = game;
            LastModified = DateTime.Now;
        }

        public void EndGame()
        {
            CurrentGame = null;
        }
    }
}
