using PlaywrightSharp;

namespace DigitalIcebreakers.EndToEndTests
{
    public abstract class AbstractBrowser
    {
        protected readonly IBrowser _browser;
        public IBrowser Browser
        {
            get { return _browser; }
        }
        protected readonly IPage _page;
        public IPage Page
        {
            get { return _page; }
        }

        public AbstractBrowser(IBrowser browser, IPage page)
        {
            _browser = browser;
            _page = page;
        }
    }
}