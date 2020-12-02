using System;
using System.Collections.Generic;

namespace DigitalIcebreakers.EndToEndTests
{
    public class DisposableServices
    {
        public List<IDisposable> Services { get; private set; } = new List<IDisposable>();
        public List<IAsyncDisposable> ServicesAsync { get; private set; } = new List<IAsyncDisposable>();
    }
}