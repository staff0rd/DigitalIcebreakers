using System;
using System.Threading.Tasks;
using Xunit;

namespace DigitalIcebreakers.EndToEndTests
{
    public static class ObjectMother
    {
        public class Presenter
        {

        }
    }
    public class PlaywrightFixture : IDisposable, IAsyncLifetime
    {
        private readonly DisposableServices _disposableServices;
        

        public PlaywrightFixture(DisposableServices disposableServices)
        {
            _disposableServices = disposableServices;
        }

        public void Dispose()
        {
            _disposableServices.Services.ForEach(service => service.Dispose());
        }

        public async Task DisposeAsync()
        {
            foreach ( var service in _disposableServices.ServicesAsync)
            {
                await service.DisposeAsync();
            }
        }

        public Task InitializeAsync()
        {
            return Task.CompletedTask;
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