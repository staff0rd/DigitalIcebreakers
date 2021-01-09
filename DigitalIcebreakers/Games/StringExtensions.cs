using System;
using System.Linq;
using System.Text.RegularExpressions;

public static class StringExtensions
{
    public static string PascalToKebabCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
            return value;

        return Regex.Replace(
            value,
            "(?<!^)([A-Z][a-z]|(?<=[a-z])[A-Z])",
            "-$1",
            RegexOptions.Compiled)
            .Trim()
            .ToLower();
    }

    public static string KebabCaseToPascalCase(this string value)
    {
        if (string.IsNullOrEmpty(value))
            return value;
        return
            string.Join("", value.Split(new[] { '-' }, StringSplitOptions.RemoveEmptyEntries)
            .Select(s => $"{s.Substring(0, 1).ToUpper()}{s.Substring(1)}"));
    }
}