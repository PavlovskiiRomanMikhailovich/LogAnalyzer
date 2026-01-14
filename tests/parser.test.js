import { test, describe } from "node:test";
import assert from "node:assert";
import { parseLogLine, parseLogFile } from "../src/parser.js";

describe("parseLogLine", () => {
  test("parses valid log line", () => {
    const line = "2024-12-01T12:00:01Z ERROR user=42 action=login";

    const result = parseLogLine(line);

    assert.deepStrictEqual(result, {
      timestamp: "2024-12-01T12:00:01Z",
      type: "ERROR",
      user: 42,
      action: "login",
    });
  });

  test("returns null for invalid format", () => {
    const result = parseLogLine("garbage");
    assert.strictEqual(result, null);
  });

  test("supports unknown log levels", () => {
    const line = "2024-12-01T12:00:01Z TEST_LOG user=5 action=explode";

    const result = parseLogLine(line);

    assert.strictEqual(result.type, "TEST_LOG");
  });

  test("supports actions with spaces", () => {
    const line = "2024-12-01T12:00:01Z ERROR user=7 action=reset password";

    const result = parseLogLine(line);

    assert.strictEqual(result.action, "reset password");
  });
});

describe("parseLogFile", () => {
  test("parses multiple lines", () => {
    const text = `
2024-12-01T12:00:01Z INFO user=1 action=login
2024-12-01T12:00:02Z ERROR user=2 action=fail
`;

    const { logs, invalidCount } = parseLogFile(text);

    assert.strictEqual(logs.length, 2);
    assert.strictEqual(invalidCount, 0);
  });

  test("counts invalid lines", () => {
    const text = `
2024-12-01T12:00:01Z INFO user=1 action=login
garbage
2024-12-01T12:00:02Z ERROR user=2 action=fail
`;

    const { logs, invalidCount } = parseLogFile(text);

    assert.strictEqual(logs.length, 2);
    assert.strictEqual(invalidCount, 1);
  });

  test("ignores empty lines", () => {
    const text = `

2024-12-01T12:00:01Z INFO user=1 action=login

`;

    const { logs, invalidCount } = parseLogFile(text);

    assert.strictEqual(logs.length, 1);
    assert.strictEqual(invalidCount, 0);
  });
});
