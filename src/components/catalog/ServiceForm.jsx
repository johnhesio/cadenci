import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { serviceSchema } from "@/utils/validationRules";

export default function ServiceForm({ defaultValues, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues ?? {
      name: "",
      category: "",
      durationMinutes: 30,
      bufferMinutes: 10,
      price: 0,
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name">Nome do serviço</Label>
        <Input id="name" {...register("name")} placeholder="Ex: Limpeza de pele" />
        {errors.name && <p className="text-xs text-rose">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Categoria</Label>
        <Input id="category" {...register("category")} placeholder="Ex: Facial" />
        {errors.category && <p className="text-xs text-rose">{errors.category.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="durationMinutes">Duração (min)</Label>
          <Input id="durationMinutes" type="number" {...register("durationMinutes")} />
          {errors.durationMinutes && <p className="text-xs text-rose">{errors.durationMinutes.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bufferMinutes">Respiro (min)</Label>
          <Input id="bufferMinutes" type="number" {...register("bufferMinutes")} />
          {errors.bufferMinutes && <p className="text-xs text-rose">{errors.bufferMinutes.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Preço (R$)</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} />
          {errors.price && <p className="text-xs text-rose">{errors.price.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
