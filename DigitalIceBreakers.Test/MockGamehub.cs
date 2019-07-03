using DigitalIcebreakers.Hubs;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace DigitalIcebreakers.Test
{
    public class MockGamehub : GameHub
    {
        public List<object[]> SentToAdmin { get; private set;} = new List<object[]>();

        public MockGamehub(ILogger<GameHub> logger, List<Lobby> lobbys, IOptions<AppSettings> settings) : base(logger, lobbys, settings)
        {
        }

        public override Task SendGameUpdateToAdmin(params object[] parameters)
        {
            this.SentToAdmin.Add(parameters);
            return Task.CompletedTask;
        }
    }
}