import { useMemo } from "react";
import { useAppContext } from "./useAppContext";
import { getAvailableSlots } from "../utils/slotEngine";

export function useAppointments() {
  const { appointments, addAppointment, cancelAppointment, businessRules } = useAppContext();

  const forDate = (isoDate) =>
    appointments
      .filter((a) => a.date === isoDate && a.status !== "cancelado")
      .sort((a, b) => a.start.localeCompare(b.start));

  const availableSlots = ({ isoDate, service, now }) =>
    getAvailableSlots({ isoDate, service, appointments, businessRules, now });

  return { appointments, addAppointment, cancelAppointment, forDate, availableSlots };
}

export function useDailyAppointments(isoDate) {
  const { appointments } = useAppContext();
  return useMemo(
    () =>
      appointments
        .filter((a) => a.date === isoDate && a.status !== "cancelado")
        .sort((a, b) => a.start.localeCompare(b.start)),
    [appointments, isoDate],
  );
}
