using System;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;

public static class Helpers
{
    public static string ToValidCamelCaseFileName(string name)
    {
        // Remove invalid file name characters
        var invalidChars = Path.GetInvalidFileNameChars();
        var cleaned = new string(name.Where(c => !invalidChars.Contains(c)).ToArray());

        // Replace all non-letter/digit with space for word separation
        cleaned = Regex.Replace(cleaned, @"[^A-Za-z0-9]+", " ");

        // Split into words
        var words = cleaned.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);

        if (words.Length == 0) return string.Empty;

        // Convert to camelCase
        var sb = new StringBuilder();
        sb.Append(words[0].ToLowerInvariant()); // first word all lowercase
        for (int i = 1; i < words.Length; i++)
        {
            sb.Append(CultureInfo.InvariantCulture.TextInfo.ToTitleCase(words[i].ToLowerInvariant()));
        }

        return sb.ToString();
    }
}
