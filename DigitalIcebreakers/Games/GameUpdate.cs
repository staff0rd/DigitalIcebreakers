using System;

namespace DigitalIcebreakers
{
    public class GameMessage<T>
    {
        public T Payload { get; private set; }
        public Guid? Id { get; private set; }
        public string Name { get; private set; }

        public GameMessage(T payload, Player player = null)
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