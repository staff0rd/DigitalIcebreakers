using System;
using System.Threading.Tasks;
using PlaywrightSharp;
using PlaywrightSharp.Chromium;

namespace DigitalIcebreakers.EndToEndTests
{
    public class Presenter : AbstractBrowser
    {
        public readonly string _url;
        public string Url => _url;
        public Presenter(IBrowser browser, IPage page, string url) : base(browser, page)
        {
            _url = url;
        }

        private async Task StartGame(string gameId)
        {
            await _page.ClickAsync("text='New Activity'");
            await _page.ClickByTestId($"game-{gameId}");
        }

        public async Task LoadTriviaQuestions(string json = "questions.json")
        {
            await StartTrivia();
            await _page.ClickAsync("text='Questions'");
            var element = await _page.QuerySelectorAsync("[type=file]");
            await element.SetInputFilesAsync($"./tests/Trivia/{json}");
            await _page.ClickAsync("text='Trivia'");
        }

        public async Task LoadPollQuestions(string json = "questions.json")
        {
            await StartPoll();
            await _page.ClickAsync("text='Questions'");
            var element = await _page.QuerySelectorAsync("[type=file]");
            await element.SetInputFilesAsync($"./tests/Trivia/{json}");
            await _page.ClickAsync("text='Poll'");
        }

        public async Task StartBroadcast()
        {
            await StartGame("broadcast");
        }

        public async Task StartTrivia()
        {
            await StartGame("trivia");
        }

        public async Task StartPoll()
        {
            await StartGame("poll");
        }

        public async Task StartPong()
        {
            await StartGame("pong");
        }
    }
}