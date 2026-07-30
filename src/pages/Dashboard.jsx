import { useMemo } from "react";
import Grid from "@mui/material/Grid";
import { CalendarCheck, BadgeDollarSign, Gauge, Bot } from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";
import { toISODate, getWeekDates, weekdayLabel, timeToMinutes, formatCurrencyBRL } from "@/utils/dateHelpers";
import PageHeader from "@/components/layout/PageHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import WeeklyStaffChart from "@/components/dashboard/WeeklyStaffChart";
import TopServices from "@/components/dashboard/TopServices";
import UpcomingAppointments from "@/components/dashboard/UpcomingAppointments";

export default function Dashboard() {
  const { today, appointments, businessRules } = useAppContext();
  const todayISO = toISODate(today);

  const todayAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayISO && a.status !== "cancelado"),
    [appointments, todayISO],
  );

  const revenueToday = useMemo(() => todayAppointments.reduce((sum, a) => sum + a.price, 0), [todayAppointments]);

  const occupancyPct = useMemo(() => {
    const workMinutes =
      timeToMinutes(businessRules.workHours.end) -
      timeToMinutes(businessRules.workHours.start) -
      (businessRules.lunchBreak.enabled
        ? timeToMinutes(businessRules.lunchBreak.end) - timeToMinutes(businessRules.lunchBreak.start)
        : 0);
    const bookedMinutes = todayAppointments.reduce((sum, a) => sum + a.durationMinutes, 0);
    return workMinutes > 0 ? Math.round((bookedMinutes / workMinutes) * 100) : 0;
  }, [todayAppointments, businessRules]);

  const iaPct = useMemo(() => {
    if (todayAppointments.length === 0) return 0;
    return Math.round((todayAppointments.filter((a) => a.source === "ia").length / todayAppointments.length) * 100);
  }, [todayAppointments]);

  const weekData = useMemo(() => {
    const week = getWeekDates(today);
    return week
      .map((date) => {
        const iso = toISODate(date);
        const revenue = appointments
          .filter((a) => a.date === iso && a.status !== "cancelado")
          .reduce((sum, a) => sum + a.price, 0);
        return {
          label: weekdayLabel(date).replace("á", "a"),
          revenue,
          isToday: iso === todayISO,
        };
      })
      .filter((d) => d.label !== "dom" || d.revenue > 0);
  }, [appointments, today, todayISO]);

  const topServices = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      if (a.status === "cancelado") continue;
      const entry = map.get(a.serviceId) || { serviceId: a.serviceId, name: a.serviceName, count: 0, revenue: 0 };
      entry.count += 1;
      entry.revenue += a.price;
      map.set(a.serviceId, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [appointments]);

  const upcoming = useMemo(
    () => todayAppointments.filter((a) => a.status === "confirmado").sort((a, b) => a.start.localeCompare(b.start)).slice(0, 6),
    [todayAppointments],
  );

  return (
    <div>
      <PageHeader title="Dashboard" subtitle={`Hoje é ${weekdayLabel(today, true)}`} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={CalendarCheck} label="Agendamentos hoje" value={todayAppointments.length} accent="pine" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={BadgeDollarSign} label="Faturamento hoje" value={formatCurrencyBRL(revenueToday)} accent="gold" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={Gauge} label="Ocupação do dia" value={`${occupancyPct}%`} accent="sage" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard icon={Bot} label="Agendado via IA" value={`${iaPct}%`} hint="dos atendimentos de hoje" accent="rose" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <WeeklyStaffChart data={weekData} />
        </Grid>
        <Grid item xs={12} lg={5}>
          <TopServices items={topServices} />
        </Grid>
        <Grid item xs={12}>
          <UpcomingAppointments items={upcoming} />
        </Grid>
      </Grid>
    </div>
  );
}
