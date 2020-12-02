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
        public static async Task ClickByTestId(this IPage page, string testId)
        {
            var element = await page.QuerySelectorAsync($"[data-testid={testId}");
            await element.ClickAsync();
        }
    }
}