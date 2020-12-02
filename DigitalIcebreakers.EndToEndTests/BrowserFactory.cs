using System;
using PlaywrightSharp;
using PlaywrightSharp.Chromium;
using System.Threading.Tasks;
using Shouldly;

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

        public async Task<(IChromiumBrowser Browser, IPage Page, string Url)> CreatePresenter()
        {
            var browser = await Create();
            var page = await browser.NewPageAsync();
            await page.GoToAsync(_settings.Url);
            var presentButton = await page.GetByTestId("present-button");
            presentButton.ShouldNotBeNull();
            await presentButton.ClickAsync();
            var createButton = await page.GetByTestId("create-lobby-button");
            createButton.ShouldNotBeNull();
            await createButton.ClickAsync();
            var qrCode = await page.GetByTestId("qrcode-link");
            qrCode.ShouldNotBeNull();
            var url = await qrCode.GetAttributeAsync("href");
            return (browser, page, url);
        }

        public async Task<(IChromiumBrowser Browser, IPage Page)> CreatePlayer(string lobbyUrl, string playerName = "test-user", bool? headless = null)
        {
            var browser = await Create(headless);
            var page = await browser.NewPageAsync();
            await page.GoToAsync(lobbyUrl);
            var userNameTextbox = await page.QuerySelectorAsync("[id=user-name]");
            await userNameTextbox.TypeAsync(playerName);
            var joinButton = await page.GetByTestId("join-lobby-button");
            await joinButton.ClickAsync();
            return (browser, page);
        }
    }
}