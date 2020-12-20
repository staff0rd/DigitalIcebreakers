using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace DigitalIcebreakers.Logging
{
    public static class LobbyLoggerExtensions
    {
        public static Log Append(this Log log, string appendTemplate, params object[] appendArgs)
        {
            return new Log 
            {
                Template = $"{log.Template} {appendTemplate}",
                Args = new List<object>(log.Args).Concat(appendArgs).ToArray()
            };
        }
        public static Log Insert(this Log log, string insertTemplate, params object[] insertArgs)
        {
            return new Log {
                Template = $"{insertTemplate} {log.Template}",
                Args = new List<object>(insertArgs).Concat(log.Args).ToArray()
            };
        }

        public static void Info<T>(this Log log, ILogger<T> logger)
        {
            logger.LogInformation(log.Template, log.Args);
        }
    }
}