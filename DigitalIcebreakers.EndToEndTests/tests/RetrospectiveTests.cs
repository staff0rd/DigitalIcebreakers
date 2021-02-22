using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class RetrospectiveTests : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;

        public RetrospectiveTests(BrowserFactory browsers)
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
        public async Task Custom_section_can_have_ideas()
        {
            await _presenter.StartRetrospective();
            await _presenter.Page.ClickAsync("text='Set categories'");
            await _presenter.Page.ClickAsync("text='Ok'");
            await _presenter.Page.FocusAsync("#custom-categories");
            await _presenter.Page.Keyboard.DownAsync("Shift");
            await _presenter.Page.Keyboard.PressAsync("End");
            await _presenter.Page.Keyboard.PressAsync("Backspace");
            await _presenter.Page.TypeAsync("#custom-categories", "one\ntwo\nthree");
            await _presenter.Page.ClickByTestId("select-custom");

            await _player.Page.TypeAsync("#idea-value", "my idea");
            await _player.Page.ClickAsync("text='three'");

            var element = await _presenter.Page.QuerySelectorAsync("text='my idea'");
            element.ShouldNotBeNull();
        }
    }
}