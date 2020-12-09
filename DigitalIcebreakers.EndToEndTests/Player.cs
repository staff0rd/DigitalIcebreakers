using PlaywrightSharp;
using PlaywrightSharp.Chromium;

namespace DigitalIcebreakers.EndToEndTests
{
    public class Player : AbstractBrowser
    {
        public Player(IChromiumBrowser browser, IPage page) : base(browser, page)
        {
        }
    }
}