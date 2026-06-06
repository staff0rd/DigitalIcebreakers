import { describe, it, expect, afterEach } from "vitest";
import { createTransport, getTransportKind } from "./transportFactory";
import { FirebaseTransport } from "./FirebaseTransport";

describe("transport selection", () => {
  afterEach(() => {
    window.localStorage.removeItem("transport");
  });

  it("defaults to signalr", () => {
    expect(getTransportKind()).toBe("signalr");
  });

  describe("when the browser has a transport override", () => {
    it("uses the override", () => {
      window.localStorage.setItem("transport", "firebase");
      expect(getTransportKind()).toBe("firebase");
    });

    it("ignores unknown overrides", () => {
      window.localStorage.setItem("transport", "carrier-pigeon");
      expect(getTransportKind()).toBe("signalr");
    });
  });

  describe("creating the transport", () => {
    it("creates a firebase transport when overridden", () => {
      window.localStorage.setItem("transport", "firebase");
      expect(createTransport()).toBeInstanceOf(FirebaseTransport);
    });
  });
});
