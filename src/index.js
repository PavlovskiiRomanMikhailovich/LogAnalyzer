import fs from "fs";
import { parseLogFile } from "./parser.js";
import { analyzeLogs } from "./analyzer.js";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Не указан путь к лог-файлу");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.error("Файл не найден:", filePath);
  process.exit(1);
}

let stat;
try {
  stat = fs.statSync(filePath);
} catch {
  console.error("Нет доступа к файлу");
  process.exit(1);
}

if (!stat.isFile()) {
  console.error("Это не файл:", filePath);
  process.exit(1);
}

if (stat.size === 0) {
  console.error("Файл пуст");
  process.exit(1);
}

if (stat.size > 50 * 1024 * 1024) {
  console.error("Файл слишком большой.");
  process.exit(1);
}

let text;
try {
  text = fs.readFileSync(filePath, "utf-8");
} catch (e) {
  console.error("Ошибка чтения файла:", e.message);
  process.exit(1);
}

const { logs, invalidCount } = parseLogFile(text);
console.log("Файл логов прочитан, кол-во битых строк:", invalidCount);

const result = analyzeLogs(logs);

console.log("\n");
console.log("Всего строк:", result.totalLines + invalidCount);
console.log("Всего ошибок:", result.errorsCount);
console.log("Топ 3 пользователей по ошибкам:");
console.table(result.topUsers);
