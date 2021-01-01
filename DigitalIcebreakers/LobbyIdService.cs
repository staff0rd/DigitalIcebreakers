using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalIcebreakers
{
    public class LobbyIdService
    {
        private static Random random = new Random();
        protected virtual string RandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public string GetCode(List<Lobby> existingLobbys)
        {
            var newCode = RandomString(4);
            if (existingLobbys.Any(p => p.Id == newCode))
            {
                return GetCode(existingLobbys);
            }
            return newCode;
        }
    }
}