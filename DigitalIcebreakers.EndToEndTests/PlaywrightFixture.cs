using System;
using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DigitalIcebreakers.EndToEndTests
{
    public class PlaywrightFixture : IDisposable, IAsyncLifetime
    {
        public IPlaywright PlaywrightDriver { get; private set; }
        public bool Headless { get; private set; }
        public PlaywrightSharp.Chromium.IChromiumBrowser LobbyBrowser { get; private set; }
        public IPage LobbyPage { get; private set; }
        public string LobbyUrl { get; private set; }

        public string Url { get; private set; }
        public PlaywrightFixture(IConfiguration config)
        {
            Url = config.GetValue<string>("Url") ?? "http://0.0.0.0:5000";
            Headless = config.GetValue<bool?>("Headless") ?? true;
        }

        public void Dispose()
        {
            if (PlaywrightDriver != null)
                PlaywrightDriver.Dispose();
        }

        public async Task DisposeAsync()
        {
            if (LobbyBrowser != null)
                await LobbyBrowser.DisposeAsync();
        }

        public async Task InitializeAsync()
        {
            await Playwright.InstallAsync();
            PlaywrightDriver = await Playwright.CreateAsync();
            await InitialiseLobby();
        }

        private async Task InitialiseLobby()
        {
            LobbyBrowser = await PlaywrightDriver.Chromium.LaunchAsync(headless: Headless);
            LobbyPage = await LobbyBrowser.NewPageAsync();
            await LobbyPage.GoToAsync(Url);
            var presentButton = await LobbyPage.GetByTestId("present-button");
            presentButton.ShouldNotBeNull();
            await presentButton.ClickAsync();
            var createButton = await LobbyPage.GetByTestId("create-lobby-button");
            createButton.ShouldNotBeNull();
            await createButton.ClickAsync();
            var qrCode = await LobbyPage.GetByTestId("qrcode-link");
            qrCode.ShouldNotBeNull();
            LobbyUrl = await qrCode.GetAttributeAsync("href");
        }
    }

    [CollectionDefinition("Playwright")]
    public class PlaywrightCollection : ICollectionFixture<PlaywrightFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}