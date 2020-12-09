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

        }
    }
}