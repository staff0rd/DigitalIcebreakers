import { connectionFactory } from "../connectionFactory";
import { FirebaseTransport } from "./FirebaseTransport";
import { SignalRTransport } from "./SignalRTransport";
import { Transport } from "./Transport";

export type TransportKind = "signalr" | "firebase";

export const getTransportKind = (): TransportKind => {
  const stored = window.localStorage.getItem("transport");
  if (stored === "firebase" || stored === "signalr") {
    return stored;
  }
  return import.meta.env.VITE_TRANSPORT === "firebase" ? "firebase" : "signalr";
};

export const createTransport = (): Transport => {
  return getTransportKind() === "firebase"
    ? new FirebaseTransport()
    : new SignalRTransport(connectionFactory);
};
