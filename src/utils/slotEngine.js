import {
  timeToMinutes,
  minutesToTime,
  weekdayIndex,
  combineDateTime,
  toISODate,
} from "./dateHelpers";

function getWorkWindowForDay(businessRules, isoDate) {
  const dow = weekdayIndex(isoDate);
  if (!businessRules.openDays.includes(dow)) return null;
  return businessRules.workHours;
}

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

/**
 * Calcula os horários de início disponíveis (HH:mm) para um serviço em uma data,
 * respeitando expediente, pausa de almoço, respiro entre atendimentos, grade de
 * horários e antecedência mínima.
 */
export function getAvailableSlots({
  isoDate,
  service,
  appointments,
  businessRules,
  now = new Date(),
}) {
  const workWindow = getWorkWindowForDay(businessRules, isoDate);
  if (!workWindow) return [];

  const dayStart = timeToMinutes(workWindow.start);
  const dayEnd = timeToMinutes(workWindow.end);
  const duration = service.durationMinutes;
  const serviceBuffer = service.bufferMinutes ?? businessRules.bufferMinutes;
  const grid = businessRules.slotGridMinutes;

  const dayAppointments = appointments
    .filter((a) => a.date === isoDate && a.status !== "cancelado")
    .map((a) => {
      const aBuffer = a.bufferMinutes ?? businessRules.bufferMinutes;
      return {
        blockStart: timeToMinutes(a.start) - aBuffer,
        blockEnd: timeToMinutes(a.end) + aBuffer,
      };
    });

  const lunch = businessRules.lunchBreak?.enabled
    ? {
        start: timeToMinutes(businessRules.lunchBreak.start),
        end: timeToMinutes(businessRules.lunchBreak.end),
      }
    : null;

  const minAdvanceMs = businessRules.minAdvanceHours * 60 * 60 * 1000;
  const earliestAllowed = new Date(now.getTime() + minAdvanceMs);
  const isToday = toISODate(now) === isoDate;

  const slots = [];
  for (let start = dayStart; start + duration <= dayEnd; start += grid) {
    const end = start + duration;
    const blockStart = start - serviceBuffer;
    const blockEnd = end + serviceBuffer;

    if (lunch && rangesOverlap(start, end, lunch.start, lunch.end)) continue;

    const conflicts = dayAppointments.some((a) =>
      rangesOverlap(blockStart, blockEnd, a.blockStart, a.blockEnd),
    );
    if (conflicts) continue;

    if (isToday) {
      const slotDateTime = combineDateTime(isoDate, minutesToTime(start));
      if (slotDateTime < earliestAllowed) continue;
    }

    slots.push({
      start: minutesToTime(start),
      end: minutesToTime(end),
    });
  }

  return slots;
}

export function isSlotStillValid({ isoDate, start, end, appointments, businessRules, excludeAppointmentId }) {
  const workWindow = getWorkWindowForDay(businessRules, isoDate);
  if (!workWindow) return false;

  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  if (startMin < timeToMinutes(workWindow.start) || endMin > timeToMinutes(workWindow.end)) {
    return false;
  }

  const lunch = businessRules.lunchBreak?.enabled
    ? {
        start: timeToMinutes(businessRules.lunchBreak.start),
        end: timeToMinutes(businessRules.lunchBreak.end),
      }
    : null;
  if (lunch && rangesOverlap(startMin, endMin, lunch.start, lunch.end)) return false;

  const buffer = businessRules.bufferMinutes;
  const conflicts = appointments
    .filter((a) => a.date === isoDate && a.status !== "cancelado" && a.id !== excludeAppointmentId)
    .some((a) => {
      const aBuffer = a.bufferMinutes ?? buffer;
      return rangesOverlap(
        startMin - buffer,
        endMin + buffer,
        timeToMinutes(a.start) - aBuffer,
        timeToMinutes(a.end) + aBuffer,
      );
    });

  return !conflicts;
}
