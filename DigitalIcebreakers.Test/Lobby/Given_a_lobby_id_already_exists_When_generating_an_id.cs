
using System.Collections.Generic;
using Shouldly;
using Xunit;

namespace DigitalIcebreakers.Test
{
    class MockLobbyIdService : LobbyIdService
    {
        int called = 0;
        private readonly string[] _ids;
        public MockLobbyIdService(params string[] ids)
        {
            _ids = ids;
        }

        protected override string RandomString(int length)
        {
            if (called < _ids.Length)
            {
                return _ids[called++];
            }
            return base.RandomString(length);
        }
    }

    public class Given_a_lobby_id_already_exists_When_generating_an_id
    {
        string actual;
        public Given_a_lobby_id_already_exists_When_generating_an_id()
        {
            var lobbys = new List<Lobby> { new Lobby { Id = "ONE" } };
            actual = new MockLobbyIdService("ONE", "TWO").GetCode(lobbys);
        }
        
        [Fact]
        public void Then_generate_another()
        {
            actual.ShouldBe("TWO");
        }
    }
}