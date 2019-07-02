using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Shouldly;
using System.Threading.Tasks;

namespace DigitalIceBreakers.Test
{
    [TestClass]
    public class IdeaSerialization
    {
        private Idea _idea;

        [TestInitialize]
        public void Setup()
        {
            string payload = JsonConvert.SerializeObject(new {
                client = new {content = "CONTENT", lane = 0}
            });

            dynamic output = JsonConvert.DeserializeObject(payload);
            _idea = output.client.ToObject<Idea>();
        }

        [TestMethod]
        public void Then_can_reserialize()
        {
            _idea.Content.ShouldBe("CONTENT");
        }
    }
}
