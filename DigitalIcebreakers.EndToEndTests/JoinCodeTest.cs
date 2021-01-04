using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class JoinCodeTest : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;
        private string _joinCode;

        public JoinCodeTest(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            _joinCode = await _presenter.Page.GetTextContentByTestId("lobby-id");
            _player = await _browsers.CreatePlayerByJoinCode(_joinCode, headless: false);
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Should_be_connected_to_lobby()
        {            
            var lobbyId = await _player.Page.GetTextContentByTestId("lobby-id");
            lobbyId.ShouldBe(_joinCode);
        }
    }
}
