using System.Threading.Tasks;
using Xunit;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests.Trivia
{
    [Collection("Playwright")]
    public class Given_Poll_When_switching_to_Trivia : IAsyncLifetime
    {
        private readonly BrowserFactory _browsers;
        private Presenter _presenter;
        private Player _player;

        public Given_Poll_When_switching_to_Trivia(BrowserFactory browsers)
        {
            _browsers = browsers;
        }

        public async Task InitializeAsync()
        {
            _presenter = await _browsers.CreatePresenter();
            _player = await _browsers.CreatePlayer(_presenter.Url);
            await _presenter.LoadPollQuestions("questions1.json");
            await _presenter.LoadTriviaQuestions("questions2.json");
        }

        public Task DisposeAsync()
        {
            return Task.CompletedTask;
        }

        [Fact]
        public async Task Then_Poll_Question_is_displayed_on_Presenter()
        {
            await _presenter.StartPoll();
            await Task.Delay(500);
            var text = await _presenter.Page.GetTextContentAsync("#question");
            text.ShouldBe("question1");
        }

        [Fact]
        public async Task Then_Trivia_Question_is_displayed_on_Presenter()
        {
            await _presenter.StartTrivia();
            await Task.Delay(500);
            var text = await _presenter.Page.GetTextContentAsync("#question");
            text.ShouldBe("question2");
        }

        [Fact]
        public async Task Then_Poll_Answers_are_displayed_on_Player()
        {
            await _presenter.StartPoll();
            await Task.Delay(500);
            var text = await _player.Page.GetTextContentAsync(".answer");
            text.ShouldBe("answer1");
        }

        [Fact]
        public async Task Then_Trivia_Answers_are_displayed_on_Player()
        {
            await _presenter.StartTrivia();
            await Task.Delay(500);
            var text = await _player.Page.GetTextContentAsync(".answer");
            text.ShouldBe("answer2");
        }
    }
}