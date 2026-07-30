import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import AgendaRail from "@/components/agenda/AgendaRail";
import ManualBookingDialog from "@/components/agenda/ManualBookingDialog";
import { useAppContext } from "@/hooks/useAppContext";
import { useDailyAppointments } from "@/hooks/useAppointments";
import { toISODate, addDays, formatDateLong } from "@/utils/dateHelpers";

export default function DailyAgenda() {
  const { today, cancelAppointment } = useAppContext();
  const [isoDate, setIsoDate] = useState(toISODate(today));
  const [dialogOpen, setDialogOpen] = useState(false);
  const items = useDailyAppointments(isoDate);

  function shiftDay(delta) {
    setIsoDate(toISODate(addDays(isoDate, delta)));
  }

  return (
    <div>
      <PageHeader
        title="Agenda do dia"
        subtitle={formatDateLong(isoDate)}
        actions={
          <>
            <Button variant="outline" size="icon" onClick={() => shiftDay(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setIsoDate(toISODate(today))}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => shiftDay(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Encaixe manual
            </Button>
          </>
        }
      />

      <div className="max-w-2xl">
        <AgendaRail items={items} onCancel={cancelAppointment} />
      </div>

      <ManualBookingDialog open={dialogOpen} onOpenChange={setDialogOpen} isoDate={isoDate} />
    </div>
  );
}
