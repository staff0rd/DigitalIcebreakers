import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const connectionFactory = () => {
  const connection = new HubConnectionBuilder()
    .withUrl("/gameHub")
    .configureLogging(LogLevel.Debug)
    .withKeepAliveInterval(2000)
    .withServerTimeout(4000)
    .build();
  return connection;
};
