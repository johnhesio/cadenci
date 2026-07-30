const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
const WEEKDAY_LABELS_LONG = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];
const MONTH_LABELS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseISODate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function weekdayIndex(dateOrISO) {
  const date = typeof dateOrISO === "string" ? parseISODate(dateOrISO) : dateOrISO;
  return date.getDay();
}

export function weekdayLabel(dateOrISO, long = false) {
  const idx = weekdayIndex(dateOrISO);
  return long ? WEEKDAY_LABELS_LONG[idx] : WEEKDAY_LABELS[idx];
}

export function formatDateLong(dateOrISO) {
  const date = typeof dateOrISO === "string" ? parseISODate(dateOrISO) : dateOrISO;
  return `${weekdayLabel(date, true)}, ${date.getDate()} de ${MONTH_LABELS[date.getMonth()]}`;
}

export function formatDateShort(dateOrISO) {
  const date = typeof dateOrISO === "string" ? parseISODate(dateOrISO) : dateOrISO;
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function addDays(dateOrISO, days) {
  const date = typeof dateOrISO === "string" ? parseISODate(dateOrISO) : new Date(dateOrISO);
  date.setDate(date.getDate() + days);
  return date;
}

export function isSameISODate(isoA, isoB) {
  return isoA === isoB;
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (totalMinutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function addMinutesToTime(timeStr, minutes) {
  return minutesToTime(timeToMinutes(timeStr) + minutes);
}

export function combineDateTime(isoDate, timeStr) {
  const date = parseISODate(isoDate);
  const [h, m] = timeStr.split(":").map(Number);
  date.setHours(h, m, 0, 0);
  return date;
}

export function getWeekDates(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = addDays(date, diffToMonday);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function formatCurrencyBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
