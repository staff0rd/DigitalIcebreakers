// Setup file for Vitest
// Add any global test setup here if needed
import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver, required by recharts ResponsiveContainer
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverStub;
}

// Tests must not hit the network: Changelog fetches a devlog feed on mount,
// which raced past test teardown (DOMParser is gone by then)
globalThis.fetch = (() =>
  Promise.resolve(new Response("<rss></rss>"))) as typeof fetch;

// jsdom returns null for canvas 2d contexts, which breaks pixi.js at import
// time (it paints a white texture on module load); return a permissive no-op
// context instead
const noop = () => {};
HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
  return new Proxy(
    { canvas: this },
    {
      get: (target, prop) =>
        prop in target ? target[prop as keyof typeof target] : noop,
      set: () => true,
    }
  );
} as unknown as typeof HTMLCanvasElement.prototype.getContext;
