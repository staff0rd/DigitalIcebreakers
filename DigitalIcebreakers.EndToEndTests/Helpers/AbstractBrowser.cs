using PlaywrightSharp;
using PlaywrightSharp.Chromium;

namespace DigitalIcebreakers.EndToEndTests
{
    public abstract class AbstractBrowser
    {
        protected readonly IChromiumBrowser _browser;
        public IChromiumBrowser Browser
        {
            get { return _browser; }
        }
        protected readonly IPage _page;
        public IPage Page
        {
            get { return _page; }
        }
        
        public AbstractBrowser(IChromiumBrowser browser, IPage page)
        {
            _browser = browser;
            _page = page;
        }
    }
}