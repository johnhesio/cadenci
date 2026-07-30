import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useAppContext } from "@/hooks/useAppContext";
import { getAvailableSlots } from "@/utils/slotEngine";
import { formatDateLong } from "@/utils/dateHelpers";
import { clientContactSchema } from "@/utils/validationRules";

export default function ManualBookingDialog({ open, onOpenChange, isoDate }) {
  const { services, appointments, businessRules, addAppointment, findOrCreateClient } = useAppContext();
  const [serviceId, setServiceId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState("");

  const service = services.find((s) => s.id === serviceId);

  const slots = useMemo(() => {
    if (!service) return [];
    return getAvailableSlots({ isoDate, service, appointments, businessRules });
  }, [service, isoDate, appointments, businessRules]);

  function reset() {
    setServiceId("");
    setSelectedSlot(null);
    setName("");
    setWhatsapp("");
    setError("");
  }

  function handleOpenChange(next) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleConfirm() {
    const parsed = clientContactSchema.safeParse({ name, whatsapp });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    const client = findOrCreateClient(parsed.data.name, parsed.data.whatsapp);
    addAppointment({
      date: isoDate,
      start: selectedSlot.start,
      end: selectedSlot.end,
      serviceId: service.id,
      serviceName: service.name,
      durationMinutes: service.durationMinutes,
      bufferMinutes: service.bufferMinutes,
      price: service.price,
      clientId: client.id,
      clientName: client.name,
      clientWhatsapp: client.whatsapp,
      source: "manual",
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Encaixe manual</DialogTitle>
          <DialogDescription>{formatDateLong(isoDate)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Serviço</Label>
            <Select
              value={serviceId}
              onValueChange={(v) => {
                setServiceId(v);
                setSelectedSlot(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} · {s.durationMinutes}min
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {service && (
            <div className="space-y-1.5">
              <Label>Horários disponíveis</Label>
              {slots.length === 0 ? (
                <p className="text-sm text-ink/50">Nenhum horário livre nesse dia para este serviço.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.start}
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                        selectedSlot?.start === slot.start
                          ? "border-pine bg-pine text-paper"
                          : "border-line bg-card text-ink hover:border-pine/40"
                      }`}
                    >
                      {slot.start}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Nome do cliente</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div className="space-y-1.5">
                <Label>WhatsApp</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(11) 90000-0000" />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!selectedSlot} onClick={handleConfirm}>
            Confirmar agendamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
