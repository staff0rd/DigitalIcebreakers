using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;
using Shouldly;
using PlaywrightSharp.Chromium;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class TriviaTests_MultiplePlayers : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player[] _players;
        private const string _correctAnswerId = "fa9cb6a8-a1e4-3337-f987-0cbca07bb88d";

        public TriviaTests_MultiplePlayers(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.StartTrivia(); 
            
            _players = await Task.WhenAll(Enumerable.Range(1, 2)
                .ToList()
                .Select(ix => _browsers.CreatePlayer(_presenter.Url, $"Player {ix}", true)));
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Selected_answers_display_correctly()
        {
            var tasks = _players.Select(async p => {
                await p.Page.ClickAsync("text='Correct'");
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