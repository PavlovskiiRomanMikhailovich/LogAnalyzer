const LOG_REGEX =
  /^(\S+)\s+(INFO|ERROR|WARN|DEBUG)\s+user=(\d+)\s+action=(\S+)/;

export function parseLogLine(line) {
  const match = line.match(LOG_REGEX);

  if (!match) return null;

  return {
    timestamp: match[1],
    type: match[2],
    user: match[3],
    action: match[4],
  };
}

export function parseLogFile(text) {
  return text
    .split("\n")
    .filter(line => line.trim() !== "")
    .map(parseLogLine);
}
