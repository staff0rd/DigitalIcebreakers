using System;
using PlaywrightSharp;
using PlaywrightSharp.Chromium;
using System.Threading.Tasks;

namespace DigitalIcebreakers.EndToEndTests
{
    public class BrowserFactory
    {
        private readonly IServiceProvider _provider;
        private readonly TestSettings _settings;
        private readonly IPlaywright _playwright;
        private readonly DisposableServices _disposableServices;

        public BrowserFactory(IServiceProvider provider, TestSettings settings, IPlaywright playwright, DisposableServices disposableServices)
        {
            _provider = provider;
            _settings = settings;
            _playwright = playwright;
            _disposableServices = disposableServices;
        }

        private async Task<IChromiumBrowser> Create(bool? headless = null)
        {
            var browser = await _playwright.Chromium.LaunchAsync(headless: headless ?? _settings.Headless);
            _disposableServices.ServicesAsync.Add(browser);
            return browser;
        }

        public async Task<Presenter> CreatePresenter()
        {
            var browser = await Create();
            var page = await browser.NewPageAsync();
            await page.GoToAsync(_settings.Url);
            await page.ClickAsync("text='Present'", delay: 1000);
            await page.ClickAsync("text='Create'", timeout: 2000);
            var url = await page.GetAttributeAsync("[data-testid=qrcode-link]", "href", 1000);
            return new Presenter(browser, page, url);
        }

        public async Task<Player> CreatePlayer(string lobbyUrl, string playerName = "test-user", bool? headless = null)
        {
            var browser = await Create(headless);
            var page = await browser.NewPageAsync();
            await page.GoToAsync(lobbyUrl);
            var userNameTextbox = await page.QuerySelectorAsync("[id=user-name]");
            await userNameTextbox.TypeAsync(playerName);
            var joinButton = await page.GetByTestId("join-lobby-button");
            await joinButton.ClickAsync();
            return new Player(browser, page);
        }
    }
}