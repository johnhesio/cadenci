import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { businessSettingsSchema } from "@/utils/validationRules";

const WEEKDAYS = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

export default function BusinessRulesForm({ businessRules, onSave }) {
  const [saved, setSaved] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: businessRules,
  });

  const lunchEnabled = watch("lunchBreak.enabled");
  const [saveError, setSaveError] = useState("");

  async function submit(data) {
    setSaveError("");
    try {
      await onSave(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Não foi possível salvar as configurações. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="max-w-2xl space-y-8">
      <section>
        <h3 className="mb-3 font-display text-base font-semibold text-ink">Dias de funcionamento</h3>
        <Controller
          control={control}
          name="openDays"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => {
                const active = field.value.includes(d.value);
                return (
                  <button
                    type="button"
                    key={d.value}
                    onClick={() =>
                      field.onChange(
                        active ? field.value.filter((v) => v !== d.value) : [...field.value, d.value].sort(),
                      )
                    }
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                      active ? "border-pine bg-pine text-paper" : "border-line bg-card text-ink/60 hover:border-pine/40"
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.openDays && <p className="mt-1 text-xs text-rose">{errors.openDays.message}</p>}
      </section>

      <section>
        <h3 className="mb-3 font-display text-base font-semibold text-ink">Expediente</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Abertura</Label>
            <Input type="time" {...register("workHours.start")} />
          </div>
          <div className="space-y-1.5">
            <Label>Fechamento</Label>
            <Input type="time" {...register("workHours.end")} />
          </div>
        </div>
        {errors.workHours?.end && <p className="mt-1 text-xs text-rose">{errors.workHours.end.message}</p>}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-ink">Pausa de almoço</h3>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" {...register("lunchBreak.enabled")} className="h-4 w-4 accent-pine" />
            Ativa
          </label>
        </div>
        {lunchEnabled && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Input type="time" {...register("lunchBreak.start")} />
            </div>
            <div className="space-y-1.5">
              <Label>Fim</Label>
              <Input type="time" {...register("lunchBreak.end")} />
            </div>
          </div>
        )}
        {errors.lunchBreak?.end && <p className="mt-1 text-xs text-rose">{errors.lunchBreak.end.message}</p>}
      </section>

      <section>
        <h3 className="mb-3 font-display text-base font-semibold text-ink">Grade de horários</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label>Intervalo da grade (min)</Label>
            <Input type="number" step="5" {...register("slotGridMinutes")} />
          </div>
          <div className="space-y-1.5">
            <Label>Respiro padrão (min)</Label>
            <Input type="number" {...register("bufferMinutes")} />
          </div>
          <div className="space-y-1.5">
            <Label>Antecedência mínima (h)</Label>
            <Input type="number" step="0.5" {...register("minAdvanceHours")} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando…" : "Salvar configurações"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-sage">
            <Check className="h-4 w-4" /> Salvo
          </span>
        )}
        {saveError && <span className="text-sm text-rose">{saveError}</span>}
      </div>
    </form>
  );
}
