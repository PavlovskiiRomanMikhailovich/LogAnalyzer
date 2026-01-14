/*
  Модуль анализа логов

  Аргументы:
  - logs: массив объектов логов, каждый объект должен содержать { timestamp, type, user, action }

  Возвращает объект:
  {
    totalLines: число всех строк (не учитывая битые - invalidLines),
    errorsCount: число ошибок типа "ERROR",
    topUsers: массив из максимум 3 объектов { user, errors }, отсортированных по убыванию числа ошибок
  }
*/

export function analyzeLogs(logs) {
    let totalLines = 0;
    let errorsCount = 0;
    const errorsByUser = new Map();

    for (const log of logs) {
        totalLines++;

        if (!log) continue;

        if (log.type === "ERROR") {
            errorsCount++;

            const prev = errorsByUser.get(log.user) || 0;
            errorsByUser.set(log.user, prev + 1);
        }
    }

    const topUsers = [...errorsByUser.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([user, count]) => ({ user, errors: count }));

    return {
        totalLines,
        errorsCount,
        topUsers,
    };
}