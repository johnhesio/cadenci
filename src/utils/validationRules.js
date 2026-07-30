import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(2, "Informe o nome do serviço"),
  category: z.string().min(1, "Informe a categoria"),
  durationMinutes: z.coerce
    .number({ invalid_type_error: "Duração inválida" })
    .int()
    .min(5, "Duração mínima de 5 minutos")
    .max(480, "Duração máxima de 8 horas"),
  bufferMinutes: z.coerce
    .number({ invalid_type_error: "Respiro inválido" })
    .int()
    .min(0, "Respiro não pode ser negativo")
    .max(120, "Respiro máximo de 2 horas"),
  price: z.coerce
    .number({ invalid_type_error: "Preço inválido" })
    .min(0, "Preço não pode ser negativo"),
});

export const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido (HH:mm)");

export const businessSettingsSchema = z
  .object({
    openDays: z.array(z.number().min(0).max(6)).min(1, "Selecione ao menos um dia"),
    workHours: z.object({
      start: timeStringSchema,
      end: timeStringSchema,
    }),
    lunchBreak: z.object({
      enabled: z.boolean(),
      start: timeStringSchema,
      end: timeStringSchema,
    }),
    slotGridMinutes: z.coerce.number().int().min(5).max(60),
    bufferMinutes: z.coerce.number().int().min(0).max(120),
    minAdvanceHours: z.coerce.number().min(0).max(72),
  })
  .refine((data) => data.workHours.start < data.workHours.end, {
    message: "O horário de abertura deve ser antes do fechamento",
    path: ["workHours", "end"],
  })
  .refine(
    (data) =>
      !data.lunchBreak.enabled || data.lunchBreak.start < data.lunchBreak.end,
    {
      message: "O início do almoço deve ser antes do fim",
      path: ["lunchBreak", "end"],
    },
  );

export const clientContactSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  whatsapp: z
    .string()
    .min(10, "Informe um WhatsApp válido")
    .regex(/^[\d()\s-]+$/, "Use apenas números, espaços, ( ) ou -"),
});
