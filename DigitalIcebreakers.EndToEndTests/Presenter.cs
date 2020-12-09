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
        public Presenter(IChromiumBrowser browser, IPage page, string url) : base(browser, page)
        {
            _url = url;
        }

        private async Task StartGame(string gameId)
        {
            await _page.ClickAsync("text='New Activity'");
            await _page.ClickByTestId($"game-{gameId}");
        }

        public async Task StartTrivia()
        {
            await StartGame("poll");
            await _page.ClickAsync("text='Questions'");
            var element = await _page.QuerySelectorAsync("[type=file]");
            await element.SetInputFilesAsync("./questions.json");
            await _page.ClickAsync("text='Poll'");
        }
    }
}