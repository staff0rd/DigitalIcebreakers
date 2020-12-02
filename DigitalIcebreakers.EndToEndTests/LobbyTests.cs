using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;
using Shouldly;
using PlaywrightSharp.Chromium;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class LobbyTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private (IChromiumBrowser Browser, IPage Page, string Url) _presenter;
        private (IChromiumBrowser Browser, IPage Page) _player;

        public LobbyTests(BrowserFactory browsers)
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
        public async Task Lobby_count_should_update_on_presenter()
        {            
            var presenterLobbyLink = await _presenter.Page.GetByTestId("menu-lobby");
            var presenterLobbyLinkText = await presenterLobbyLink.GetTextContentAsync();
            presenterLobbyLinkText.ShouldBe("Lobby (1)");
        }

        [Fact]
        public async Task Lobby_count_should_update_on_client() 
        {
            var clientLobbyLink = await _player.Page.GetByTestId("menu-lobby");
            var clientLobbyLinkText = await clientLobbyLink.GetTextContentAsync();
            clientLobbyLinkText.ShouldBe("Lobby (1)");
        }
    }
}
