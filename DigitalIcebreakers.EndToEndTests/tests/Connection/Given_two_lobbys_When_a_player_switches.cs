using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class Given_two_lobbys_When_a_player_switches : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter1;
        private Presenter _presenter2;
        private Player _player;

        public Given_two_lobbys_When_a_player_switches(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter1 = await _browsers.CreatePresenter();
            await _presenter1.StartBroadcast();
            await _presenter1.Page.TypeAsync("[type=text]", "presenter1");
            _presenter2 = await _browsers.CreatePresenter();
            await _presenter2.StartBroadcast();
            await _presenter2.Page.TypeAsync("[type=text]", "presenter2");
            _player = await _browsers.CreatePlayer(_presenter1.Url);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Then_should_be_connected_to_second_lobby()
        {
            await BrowserFactory.JoinLobby(_presenter2.Url, _player.Page);
            var text = await _player.Page.GetTextContentByTestId("client-text");
            text.ShouldBe("presenter2");
        }
    }
}
