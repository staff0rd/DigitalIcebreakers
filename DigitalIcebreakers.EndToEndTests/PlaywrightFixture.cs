using System;
using System.Threading.Tasks;
using Xunit;
using PlaywrightSharp;

namespace DigitalIcebreakers.EndToEndTests
{
    public class PlaywrightFixture : IDisposable, IAsyncLifetime
    {
        public PlaywrightFixture() {}

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
            LobbyBrowser = await PlaywrightDriver.Chromium.LaunchAsync();
            LobbyPage = await LobbyBrowser.NewPageAsync();
            await LobbyPage.GoToAsync("http://0.0.0.0:5000");
            var presentButton = await LobbyPage.GetByTestId("present-button");
            await presentButton.ClickAsync();
            var createButton = await LobbyPage.GetByTestId("create-lobby-button");
            await createButton.ClickAsync();
            var qrCode = await LobbyPage.GetByTestId("qrcode-link");
            LobbyUrl = await qrCode.GetAttributeAsync("href");
        }

        public IPlaywright PlaywrightDriver { get; private set; }
        public PlaywrightSharp.Chromium.IChromiumBrowser LobbyBrowser { get; private set; }
        public IPage LobbyPage { get; private set; }
        public string LobbyUrl { get; private set; }
    }

    [CollectionDefinition("Playwright")]
    public class PlaywrightCollection : ICollectionFixture<PlaywrightFixture>
    {
        // This class has no code, and is never created. Its purpose is simply
        // to be the place to apply [CollectionDefinition] and all the
        // ICollectionFixture<> interfaces.
    }
}