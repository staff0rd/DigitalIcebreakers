using Shouldly;
using Xunit;

namespace DigitalIcebreakers.Test
{
    public class Given_a_production_environment_When_signalr_is_configured
    {
        [Fact]
        public void Then_detailed_errors_are_not_sent_to_clients()
        {
            ObjectMother.GetConfiguredHubOptions("Production").EnableDetailedErrors.ShouldBe(false);
        }
    }
}
