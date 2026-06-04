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
