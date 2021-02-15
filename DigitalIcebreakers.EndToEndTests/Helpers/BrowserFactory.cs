using System;
using PlaywrightSharp;
using PlaywrightSharp.Chromium;
using System.Threading.Tasks;
using System.Linq;

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

        private async Task<IBrowser> Create(bool? headless = null)
        {
            IBrowser browser = null;
            switch (_settings.Browser)
            {
                case "Chrome":
                    {
                        browser = await _playwright.Chromium.LaunchAsync(headless: headless ?? _settings.Headless);
                        break;
                    }
                case "Firefox":
                    {
                        browser = await _playwright.Firefox.LaunchAsync(headless: headless ?? _settings.Headless);
                        break;
                    }
                case "Webkit":
                    {
                        browser = await _playwright.Webkit.LaunchAsync(headless: headless ?? _settings.Headless);
                        break;
                    }
                default: throw new Exception("Unknown browser");
            }

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
            await JoinLobby(lobbyUrl, page, playerName);
            return new Player(browser, page);
        }

        public async Task<Player[]> CreatePlayers(string lobbyUrl, int playerCount)
        {
            return await Task.WhenAll(Enumerable.Range(1, playerCount)
                .ToList()
                .Select(ix => CreatePlayer(lobbyUrl, $"Player {ix}")));
        }

        public static async Task JoinLobby(string lobbyUrl, IPage page, string playerName = "test-user")
        {
            await page.GoToAsync(lobbyUrl);
            await page.TypeAsync("[id=user-name]", playerName);
            var joinButton = await page.GetByTestId("join-lobby-button");
            await joinButton.ClickAsync();
        }

        public async Task<Player> CreatePlayerByJoinCode(string joinCode, string playerName = "test-user", bool? headless = null)
        {
            var browser = await Create(headless);
            var page = await browser.NewPageAsync();
            await page.GoToAsync(_settings.Url);
            await page.ClickAsync("text='Join'", delay: 1000);
            await page.TypeAsync("[id=lobby-code]", joinCode);
            await page.ClickByTestId("join-lobby");
            await page.TypeAsync("[id=user-name]", playerName);
            await page.ClickByTestId("join-lobby-button");
            return new Player(browser, page);
        }
    }
}