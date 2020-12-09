using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class TriviaTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;

        public TriviaTests(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            _player = await _browsers.CreatePlayer(_presenter.Url);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Answers_are_displayed_on_Player_after_leaving_Broadcast()
        {
            await _presenter.LoadTriviaQuestions();
            await _presenter.StartBroadcast();
            await _presenter.StartTrivia();

            await Task.Delay(1000);

            var element = await _player.Page.QuerySelectorAsync("text='Correct'");
            element.ShouldNotBeNull();
        }
    }
}