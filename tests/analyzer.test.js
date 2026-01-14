import { test, describe } from "node:test";
import assert from "node:assert";
import { analyzeLogs } from "../src/analyzer.js";

describe("analyzeLogs", () => {
  test("counts total lines and errors", () => {
    const logs = [
      { type: "INFO", user: 1 },
      { type: "ERROR", user: 2 },
      { type: "ERROR", user: 2 },
      { type: "WARN", user: 3 },
    ];

    const result = analyzeLogs(logs);

    assert.strictEqual(result.totalLines, 4);
    assert.strictEqual(result.errorsCount, 2);
  });

  test("groups errors by user", () => {
    const logs = [
      { type: "ERROR", user: 1 },
      { type: "ERROR", user: 1 },
      { type: "ERROR", user: 2 },
      { type: "INFO", user: 1 },
    ];

    const result = analyzeLogs(logs);

    assert.deepStrictEqual(result.topUsers, [
      { user: 1, errors: 2 },
      { user: 2, errors: 1 },
    ]);
  });

  test("returns only top 3 users", () => {
    const logs = [
      { type: "ERROR", user: 1 },
      { type: "ERROR", user: 2 },
      { type: "ERROR", user: 3 },
      { type: "ERROR", user: 4 },
      { type: "ERROR", user: 4 },
    ];

    const result = analyzeLogs(logs);

    assert.strictEqual(result.topUsers.length, 3);
    assert.deepStrictEqual(result.topUsers, [
      { user: 4, errors: 2 },
      { user: 1, errors: 1 },
      { user: 2, errors: 1 },
    ]);
  });

  test("handles empty input", () => {
    const result = analyzeLogs([]);

    assert.strictEqual(result.totalLines, 0);
    assert.strictEqual(result.errorsCount, 0);
    assert.deepStrictEqual(result.topUsers, []);
  });

  test("skips null or undefined logs safely", () => {
    const logs = [
      { type: "ERROR", user: 1 },
      null,
      undefined,
      { type: "ERROR", user: 2 },
    ];

    const result = analyzeLogs(logs);

    assert.strictEqual(result.totalLines, 4);
    assert.strictEqual(result.errorsCount, 2);
  });

  test("returns empty topUsers when there are no errors", () => {
    const logs = [
      { type: "INFO", user: 1 },
      { type: "WARN", user: 2 },
    ];

    const result = analyzeLogs(logs);

    assert.strictEqual(result.errorsCount, 0);
    assert.deepStrictEqual(result.topUsers, []);
  });
});
