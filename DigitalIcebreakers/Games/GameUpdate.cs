using System;

namespace DigitalIcebreakers
{
    public class GameUpdate<T>
    {
        public T Payload { get; private set; }
        public Guid? Id { get; private set; }
        public string Name { get; private set; }

        public GameUpdate(T payload, Player player = null)
        {
            Payload = payload;
            if (player != null)
            {
                Id = player.ExternalId;
                Name = player.Name;
            }
        }
    }
}