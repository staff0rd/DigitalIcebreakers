import * as fs from "fs";
import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";

// Flight recorder: appends one JSONL line per test begin/end so the timeline
// survives any kind of process death (global timeout, SIGKILL). A "begin"
// with no matching "end" identifies the test that was in flight.
const file = "test-results/e2e-progress.jsonl";

const append = (entry: Record<string, unknown>) =>
  fs.appendFileSync(file, `${JSON.stringify(entry)}\n`);

export default class ProgressReporter implements Reporter {
  onBegin() {
    fs.mkdirSync("test-results", { recursive: true });
    fs.writeFileSync(file, "");
  }

  onTestBegin(test: TestCase) {
    append({
      t: new Date().toISOString(),
      event: "begin",
      test: test.titlePath().join(" › "),
    });
  }

  onTestEnd(test: TestCase, result: TestResult) {
    append({
      t: new Date().toISOString(),
      event: "end",
      test: test.titlePath().join(" › "),
      status: result.status,
      ms: result.duration,
    });
  }

  printsToStdio() {
    return false;
  }
}
