using System.Threading.Tasks;
using PlaywrightSharp;

namespace DigitalIcebreakers.EndToEndTests
{
    public static class IPageExtensions
    {
        public static Task<IElementHandle> GetByTestId(this IPage page, string testId)
        {
            return page.QuerySelectorAsync($"[data-testid={testId}");
        }
    }
}