using DigitalIcebreakers.Robot.Commands;
using Microsoft.Extensions.CommandLineUtils;
using System;

namespace DigitalIcebreakers.Robot
{
    class Program
    {
        static void Main(string[] args)
        {
            var app = new CommandLineApplication();
            app.Description = "Digital Icebreakers Robot";
            app.HelpOption("-h|--help");

            JoinCommand.Register(app);

            app.Command("help", cmd =>
            {
                var commandArgument = cmd.Argument("<COMMAND>", "The command to get help for.");

                cmd.OnExecute(() =>
                {
                    app.ShowHelp(commandArgument.Value);
                    return 0;
                });
            });

            app.OnExecute(() =>
            {
                app.ShowHelp();
                return 0;
            });

            app.Execute(args);
        }
    }
}
