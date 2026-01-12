import fs from "fs";
import { parseLogFile } from "./parser.js";
import { analyzeLogs } from "./analyzer.js";

const text = fs.readFileSync("./sample.log", "utf-8");

const logs = parseLogFile(text);
const result = analyzeLogs(logs);

console.log("Всего строк:", result.totalLines);
console.log("Всего ошибок:", result.errorsCount);
console.table(result.topUsers);
