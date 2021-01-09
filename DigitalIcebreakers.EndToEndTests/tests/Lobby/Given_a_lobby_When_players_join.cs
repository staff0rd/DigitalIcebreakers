using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class Given_a_lobby_When_players_join : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;

        public Given_a_lobby_When_players_join(BrowserFactory browsers)
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
        public async Task Then_lobby_count_should_update_on_presenter()
        {
            var presenterLobbyLink = await _presenter.Page.GetByTestId("menu-lobby");
            var presenterLobbyLinkText = await presenterLobbyLink.GetTextContentAsync();
            presenterLobbyLinkText.ShouldBe("Lobby (1)");
        }

        [Fact]
        public async Task Then_lobby_count_should_update_on_player()
        {
            var clientLobbyLink = await _player.Page.GetByTestId("menu-lobby");
            var clientLobbyLinkText = await clientLobbyLink.GetTextContentAsync();
            clientLobbyLinkText.ShouldBe("Lobby (1)");
        }
    }
}
