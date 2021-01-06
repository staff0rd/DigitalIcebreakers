using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;
using System.Collections.Generic;

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
            var players = new List<Player>();
            foreach (var ix in Enumerable.Range(1,6))
            {
                players.Add(await _browsers.CreatePlayer(_presenter.Url, $"Player {ix}", true));
            }
            _players = players.ToArray();
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Teams_are_even()
        {
            await AssertTeam("blue", "red", "blue", "red", "blue", "red");
            await TeamsShouldBe(blue: 3, red: 3);
            await _players[1].Page.CloseAsync(); // red leaves
            await AssertTeam("blue", "", "blue", "red", "blue", "red");
            await TeamsShouldBe(blue: 3, red: 2);
            await _players[2].Page.CloseAsync(); // blue leaves
            await AssertTeam("blue", "", "", "red", "blue", "red");
            await TeamsShouldBe(blue: 2, red: 2);
            await _players[3].Page.CloseAsync(); // red leaves
            await AssertTeam("blue", "", "", "", "blue", "red");
            await TeamsShouldBe(blue: 2, red: 1);
            await _players[5].Page.CloseAsync(); // red leaves
            await TeamsShouldBe(blue: 1, red: 1);
            var teams = new [] { 
                await _players[0].Page.GetTextContentByTestId("team"),
                await _players[4].Page.GetTextContentByTestId("team"),
            };
            teams.ShouldContain("red");
            teams.ShouldContain("blue");
        }

        private async Task AssertTeam(params string[] expect)
        {
            for (int i = 0; i < expect.Length; i++)
            {
                var expected = expect[i];
                if (!string.IsNullOrEmpty(expected)) {
                    var actual = await _players[i].Page.GetTextContentByTestId("team");
                    actual.ShouldBe(expect[i], $"for Player {i + 1}");
                }
            }
        }

        private async Task TeamsShouldBe(int blue, int red)
        {
            await Task.Delay(50);
            var teams = (blue: await GetPlayerCount("blue-team"), red: await GetPlayerCount("red-team"));
            teams.ShouldBe((blue: blue, red: red));
        }

        private async Task<int> GetPlayerCount(string team)
        {
            var span = await _presenter.Page.QuerySelectorAsync($"#{team}");
            var count = await span.GetAttributeAsync("data-count");
            return int.Parse(count);
        }
    }
}