import AppointmentCard from "./AppointmentCard";

export default function AgendaRail({ items, onCancel }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-card/50 p-10 text-center">
        <p className="text-sm text-ink/50">Nenhum atendimento neste dia.</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div key={item.id} className="flex gap-4">
          <div className="relative flex w-6 shrink-0 flex-col items-center">
            <span className="mt-2 h-3 w-3 shrink-0 rounded-full bg-gold ring-4 ring-paper" />
            {idx < items.length - 1 && <span className="w-0 flex-1 border-l-2 border-dashed border-line" />}
          </div>
          <div className="min-w-0 flex-1 pb-5">
            <AppointmentCard appointment={item} onCancel={onCancel} />
          </div>
        </div>
      ))}
    </div>
  );
}
