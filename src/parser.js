const LOG_REGEX =
  /^(\S+)\s+([A-Z]+)\s+user=(\d+)\s+action=(.+)$/;

export function parseLogLine(line) {
  const match = line.match(LOG_REGEX);

  if (!match) {
    console.error(`Invalid format: ${line}`)
    return null;
  }

  return {
    timestamp: match[1],
    type: match[2],
    user: Number(match[3]),
    action: match[4],
  };
}

export function parseLogFile(text) {
  const lines = text.split(/\r?\n/);

  const logs = [];
  let invalidCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    const parsed = parseLogLine(line);

    if (parsed) {
      logs.push(parsed);
    } else {
      invalidCount++;
    }
  }

  return { logs, invalidCount };
}

