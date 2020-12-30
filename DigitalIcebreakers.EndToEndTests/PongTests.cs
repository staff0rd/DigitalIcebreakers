using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class PongTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player[] _players;

        public PongTests(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.StartPong();
            
            _players = await Task.WhenAll(Enumerable.Range(1, 6)
                .ToList()
                .Select(ix => _browsers.CreatePlayer(_presenter.Url, $"Player {ix}", true)));
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Teams_are_even()
        {
            await _players[1].Page.CloseAsync();
            await _players[2].Page.CloseAsync();
            await _players[3].Page.CloseAsync();
            await _players[5].Page.CloseAsync();
            await Task.Delay(1000);
            
            var blueCount = await GetPlayerCount("blue-team");
            var redCount = await GetPlayerCount("red-team");

            var teams = new { blue = blueCount, red = redCount};
            teams.ShouldBe(new { blue = 1, red = 1});
        }

        private async Task<int> GetPlayerCount(string team)
        {
            var span = await _presenter.Page.QuerySelectorAsync($"#{team}");
            var count = await span.GetAttributeAsync("data-count");
            return int.Parse(count);
        }
    }
}