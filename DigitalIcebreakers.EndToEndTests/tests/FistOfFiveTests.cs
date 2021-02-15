using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class FistOfFiveTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player[] _players;

        public FistOfFiveTests(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            _players = await _browsers.CreatePlayers(_presenter.Url, 2);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Average_score_is_calculated()
        {
            await _presenter.StartFistOfFive();
            await _presenter.Page.ClickByTestId("show-responses");


            await _players[0].Page.ClickAsync("text='1'", timeout: 1000);
            await _players[0].Page.ClickAsync(@"text='Lock In & Send'");
            await _players[1].Page.ClickAsync("text='5'", timeout: 1000);
            await _players[1].Page.ClickAsync(@"text='Lock In & Send'");

            var score = await _presenter.Page.GetTextContentByTestId("average-score");
            score.ShouldBe("3");
        }
    }
}