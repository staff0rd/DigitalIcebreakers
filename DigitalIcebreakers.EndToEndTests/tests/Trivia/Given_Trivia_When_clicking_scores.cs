using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests.Trivia
{
    [Collection("Playwright")]
    public class Given_Trivia_When_clicking_scores : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player[] _players;
        private const string _correctAnswerId = "fa9cb6a8-a1e4-3337-f987-0cbca07bb88d";

        public Given_Trivia_When_clicking_scores(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.LoadTriviaQuestions();

            _players = await Task.WhenAll(Enumerable.Range(1, 2)
                .ToList()
                .Select(ix => _browsers.CreatePlayer(_presenter.Url, $"Player {ix}")));
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Then_scoreboard_is_displayed()
        {
            await _players[0].Page.ClickAsync("text='correct'", timeout: 1000);
            await _players[0].Page.ClickAsync(@"text='Lock In & Send'");
            await _players[1].Page.ClickAsync("text='wrong1'", timeout: 1000);
            await _players[1].Page.ClickAsync(@"text='Lock In & Send'");
            await _presenter.Page.ClickByTestId("show-scoreboard");
            var names = await _presenter.Page.QuerySelectorAllAsync(".scoreboard-name");
            var scores = await _presenter.Page.QuerySelectorAllAsync(".scoreboard-score");
            names.Count().ShouldBe(2);
            scores.Count().ShouldBe(2);
            (await names.ElementAt(0).GetTextContentAsync()).ShouldBe("Player 1");
            (await names.ElementAt(1).GetTextContentAsync()).ShouldBe("Player 2");
            (await scores.ElementAt(0).GetTextContentAsync()).ShouldBe("1");
            (await scores.ElementAt(1).GetTextContentAsync()).ShouldBe("0");
        }
    }
}