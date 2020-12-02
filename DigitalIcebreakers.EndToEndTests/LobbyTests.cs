using System;
using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class LobbyTests : IAsyncLifetime
    {
        private readonly PlaywrightFixture _fixture;
        private PlaywrightSharp.Chromium.IChromiumBrowser _browser;
        private IPage _page;

        public LobbyTests(PlaywrightFixture fixture)
        {
            _fixture = fixture;
        }

        public async Task DisposeAsync()
        {
            if (_browser != null)
                await _browser.DisposeAsync();
        }

        public async Task InitializeAsync()
        {
            _browser = await _fixture.PlaywrightDriver.Chromium.LaunchAsync();
            _page = await _browser.NewPageAsync();
            await _page.GoToAsync(_fixture.LobbyUrl);
            var userNameTextbox = await _page.QuerySelectorAsync("[id=user-name]");
            await userNameTextbox.TypeAsync("test-user");
            var joinButton = await _page.GetByTestId("join-lobby-button");
            await joinButton.ClickAsync();
        }

        [Fact]
        public async Task Lobby_count_should_update_on_presenter()
        {            
            var presenterLobbyLink = await _fixture.LobbyPage.GetByTestId("menu-lobby");
            var presenterLobbyLinkText = await presenterLobbyLink.GetTextContentAsync();
            presenterLobbyLinkText.ShouldBe("Lobby (1)");
        }

        [Fact]
        public async Task Lobby_count_should_update_on_client() 
        {
            var clientLobbyLink = await _page.GetByTestId("menu-lobby");
            var clientLobbyLinkText = await clientLobbyLink.GetTextContentAsync();
            clientLobbyLinkText.ShouldBe("Lobby (1)");
        }
    }
}
