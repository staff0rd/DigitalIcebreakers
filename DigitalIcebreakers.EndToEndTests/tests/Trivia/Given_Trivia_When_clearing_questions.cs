using System.Threading.Tasks;
using Xunit;
using Shouldly;
using System.Linq;

namespace DigitalIcebreakers.EndToEndTests.Trivia
{
    [Collection("Playwright")]
    public class Given_Trivia_When_clearing_questions : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;

        public Given_Trivia_When_clearing_questions(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            await _presenter.LoadTriviaQuestions();
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Should_clear_questions()
        {
            await _presenter.Page.ClickAsync("text='Questions'");
            await _presenter.Page.ClickAsync("text='Clear all questions'");
            await _presenter.Page.ClickAsync("text='Ok'");
            var rowsWithHeader = (await _presenter.Page.QuerySelectorAllAsync("#questions-table tr")).Count();
            rowsWithHeader.ShouldBe(1);
        }
    }
}