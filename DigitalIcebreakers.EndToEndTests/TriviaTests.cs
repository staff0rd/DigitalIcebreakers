using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;
using Shouldly;
using PlaywrightSharp.Chromium;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class TriviaTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private (IChromiumBrowser Browser, IPage Page, string Url) _presenter;
        private (IChromiumBrowser Browser, IPage Page)[] _players;

        public TriviaTests(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.Page.ClickAsync("text='New Game'");
            await _presenter.Page.ClickByTestId("game-poll");
            await _presenter.Page.ClickAsync("text='Questions'");
            var element = await _presenter.Page.QuerySelectorAsync("[type=file]");
            await element.SetInputFilesAsync("./questions.json");
            await _presenter.Page.ClickAsync("text='Poll'");
            
            _players = await Task.WhenAll(Enumerable.Range(1, 10)
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
            await Task.Delay(10000);
        }
    }
}