using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    [Collection("Playwright")]
    public class Given_a_Presenter_When_page_loaded : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;

        public Given_a_Presenter_When_page_loaded(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Then_should_be_connected()
        {
            var connectionIcon = await _presenter.Page.GetByTestId("connection-status");
            var status = await connectionIcon.GetAttributeAsync("data-status");
            status.ShouldBe("Connected");
        }
    }
}
