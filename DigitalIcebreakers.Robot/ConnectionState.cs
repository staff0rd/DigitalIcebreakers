using System;
using System.Collections.Generic;
using System.Text;

namespace DigitalIcebreakers.Robot
{
    public enum ConnectionState
    {
        Connecting,
        Connected,
        Reconnecting,
        Disconnected,
        Faulted,
    }
}
