using Shouldly;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_development_environment_When_signalr_is_configured
    {
        [Fact]
        public void Then_detailed_errors_are_sent_to_clients()
        {
            ObjectMother.GetConfiguredHubOptions("Development").EnableDetailedErrors.ShouldBe(true);
        }
    }
}
