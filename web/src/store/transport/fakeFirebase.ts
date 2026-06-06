/* In-memory simulation of the firebase/database and firebase/auth modules so
 * transport behavior can be tested with multiple clients sharing one
 * database, without a running emulator. */

type ValueListener = {
  type: "value";
  path: string;
  cb: (snapshot: FakeSnapshot) => void;
  lastJson: string;
};

type ChildListener = {
  type: "childAdded";
  path: string;
  cb: (snapshot: FakeSnapshot) => void;
  knownKeys: Set<string>;
};

type Listener = ValueListener | ChildListener;

type FakeSnapshot = {
  exists: () => boolean;
  val: () => unknown;
  key: string | null;
};

type DisconnectOp = { path: string; value: unknown };

let data: Record<string, unknown> = {};
let listeners: Listener[] = [];
let disconnectOps: DisconnectOp[] = [];
let pushCounter = 0;
let uidCounter = 0;
let clock = 0;

export const resetFakeFirebase = () => {
  data = { ".info": { connected: true } };
  listeners = [];
  disconnectOps = [];
  pushCounter = 0;
  uidCounter = 0;
  clock = 0;
};

resetFakeFirebase();

const segments = (path: string) => path.split("/").filter(Boolean);

const getAt = (path: string): unknown =>
  segments(path).reduce<unknown>(
    (node, key) =>
      node && typeof node === "object"
        ? (node as Record<string, unknown>)[key]
        : undefined,
    data
  );

const resolveServerTimestamps = (value: unknown): unknown => {
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record[".sv"] === "timestamp") {
      return ++clock;
    }
    return Object.fromEntries(
      Object.entries(record).map(([k, v]) => [k, resolveServerTimestamps(v)])
    );
  }
  return value;
};

const setAt = (path: string, value: unknown) => {
  const keys = segments(path);
  const leaf = keys.pop();
  if (!leaf) {
    data = (value as Record<string, unknown>) ?? {};
  } else {
    let node = data;
    for (const key of keys) {
      if (!node[key] || typeof node[key] !== "object") {
        node[key] = {};
      }
      node = node[key] as Record<string, unknown>;
    }
    if (value == null) {
      delete node[leaf];
    } else {
      node[leaf] = value;
    }
  }
  notify();
};

const clone = (value: unknown) =>
  value === undefined ? null : JSON.parse(JSON.stringify(value));

const snapshot = (path: string): FakeSnapshot => ({
  exists: () => getAt(path) != null,
  val: () => clone(getAt(path)),
  key: segments(path).pop() ?? null,
});

const notify = () => {
  for (const listener of [...listeners]) {
    if (!listeners.includes(listener)) continue;
    if (listener.type === "value") {
      const json = JSON.stringify(clone(getAt(listener.path)));
      if (json !== listener.lastJson) {
        listener.lastJson = json;
        listener.cb(snapshot(listener.path));
      }
    } else {
      const value = getAt(listener.path);
      const keys =
        value && typeof value === "object"
          ? Object.keys(value as Record<string, unknown>)
          : [];
      for (const key of keys) {
        if (!listener.knownKeys.has(key)) {
          listener.knownKeys.add(key);
          listener.cb(snapshot(`${listener.path}/${key}`));
        }
      }
    }
  }
};

const subscribe = (listener: Listener) => {
  listeners.push(listener);
  if (listener.type === "value") {
    listener.cb(snapshot(listener.path));
  } else {
    const value = getAt(listener.path);
    const keys =
      value && typeof value === "object"
        ? Object.keys(value as Record<string, unknown>)
        : [];
    for (const key of keys) {
      listener.knownKeys.add(key);
      listener.cb(snapshot(`${listener.path}/${key}`));
    }
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

type FakeRef = { path: string };

export const fakeDatabaseModule = {
  getDatabase: () => ({}),
  connectDatabaseEmulator: () => {},
  ref: (_db: unknown, path = "") => ({ path }),
  get: async (r: FakeRef) => snapshot(r.path),
  set: async (r: FakeRef, value: unknown) =>
    setAt(r.path, resolveServerTimestamps(value)),
  update: async (r: FakeRef, values: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(values)) {
      setAt(`${r.path}/${key}`, resolveServerTimestamps(value));
    }
  },
  remove: async (r: FakeRef) => setAt(r.path, null),
  push: async (r: FakeRef, value: unknown) => {
    const key = `push-${String(++pushCounter).padStart(6, "0")}`;
    setAt(`${r.path}/${key}`, resolveServerTimestamps(value));
    return { path: `${r.path}/${key}`, key };
  },
  onValue: (r: FakeRef, cb: (snapshot: FakeSnapshot) => void) =>
    subscribe({ type: "value", path: r.path, cb, lastJson: "__initial__" }),
  onChildAdded: (r: FakeRef, cb: (snapshot: FakeSnapshot) => void) =>
    subscribe({ type: "childAdded", path: r.path, cb, knownKeys: new Set() }),
  onDisconnect: (r: FakeRef) => ({
    set: async (value: unknown) => {
      disconnectOps.push({ path: r.path, value });
    },
    cancel: async () => {
      disconnectOps = disconnectOps.filter((op) => op.path !== r.path);
    },
  }),
  serverTimestamp: () => ({ ".sv": "timestamp" }),
};

export const fakeAuthModule = {
  getAuth: () => ({}),
  connectAuthEmulator: () => {},
  signInAnonymously: async () => ({ user: { uid: `uid-${++uidCounter}` } }),
};

export const fakeFirebaseClientModule = {
  getFirebaseClient: () => ({ db: {}, auth: {} }),
};

export const simulateClientDisconnect = (userId: string) => {
  const ops = disconnectOps.filter((op) =>
    op.path.includes(`/players/${userId}/`)
  );
  disconnectOps = disconnectOps.filter((op) => !ops.includes(op));
  for (const op of ops) {
    setAt(op.path, op.value);
  }
};
