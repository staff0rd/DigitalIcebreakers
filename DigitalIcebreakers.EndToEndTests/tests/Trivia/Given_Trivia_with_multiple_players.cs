using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests.Trivia
{
    [Collection("Playwright")]
    public class Given_Trivia_with_multiple_players : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player[] _players;
        private const string _correctAnswerId = "fa9cb6a8-a1e4-3337-f987-0cbca07bb88d";

        public Given_Trivia_with_multiple_players(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.LoadTriviaQuestions();
            _players = await _browsers.CreatePlayers(_presenter.Url, 2);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Selected_answers_display_correctly()
        {
            var tasks = _players.Select(async p =>
            {
                await p.Page.ClickAsync("text='correct'", timeout: 1000);
                await p.Page.ClickAsync(@"text='Lock In & Send'");
            });
            await Task.WhenAll(tasks);
            await _presenter.Page.ClickByTestId("show-responses");
            var answer = await _presenter.Page.GetByTestId($"answer-{_correctAnswerId}");
            var countElement = await answer.QuerySelectorAsync(".count");
            var count = int.Parse(await countElement.GetTextContentAsync());
            count.ShouldBe(_players.Count());
        }
    }
}