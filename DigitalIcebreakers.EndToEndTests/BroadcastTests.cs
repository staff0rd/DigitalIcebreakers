using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class BroadcastTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;

        public BroadcastTests(BrowserFactory browsers)
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
        public async Task Broadcasted_text_appears_on_player()
        {
            await _presenter.StartBroadcast();
            await _presenter.Page.TypeAsync("[type=text]", "abcde");

            var text = await _player.Page.GetTextContentByTestId("client-text");
            text.ShouldBe("abcde");
        }

        [Fact]
        public async Task Broadcasted_text_appears_on_player_after_refresh()
        {
            await _presenter.StartBroadcast();
            await _presenter.Page.TypeAsync("[type=text]", "abc");
            await _player.Page.ReloadAsync();
            await _presenter.Page.TypeAsync("[type=text]", "de");
            await Task.Delay(300);
            var text = await _player.Page.GetTextContentByTestId("client-text");
            text.ShouldBe("abcde");
        }
    }
}