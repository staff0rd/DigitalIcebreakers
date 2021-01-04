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
        public static async Task<string> GetTextContentByTestId(this IPage page, string testId)
        {
            return await page.GetTextContentAsync($"[data-testid={testId}");
        }

        public static async Task<string> GetAttributeByTestId(this IPage page, string testId, string attributeName)
        {
            return await page.GetAttributeAsync(($"[data-testid={testId}"), attributeName);
        }
    }
}