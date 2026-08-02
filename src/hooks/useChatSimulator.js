import { useCallback, useState } from "react";
import { useAppContext } from "./useAppContext";
import { getAvailableSlots } from "@/utils/slotEngine";
import { matchService } from "@/utils/matchService";
import { clientContactSchema } from "@/utils/validationRules";
import { toISODate, addDays, formatDateLong, formatCurrencyBRL, weekdayIndex } from "@/utils/dateHelpers";

const STAGE = {
  SERVICE: "service",
  DATE: "date",
  TIME: "time",
  NAME: "name",
  WHATSAPP: "whatsapp",
  DONE: "done",
};

let msgId = 0;
function makeMessage(role, text, quickReplies) {
  msgId += 1;
  return { id: msgId, role, text, quickReplies };
}

function greeting(services) {
  return [
    makeMessage(
      "bot",
      "Olá! 👋 Eu sou o assistente da Cadêci. Qual serviço você gostaria de agendar?",
      services.map((s) => ({ label: s.name, value: s.id })),
    ),
  ];
}

export function useChatSimulator() {
  const { services, appointments, businessRules, today, addAppointment, findOrCreateClient } = useAppContext();

  const [messages, setMessages] = useState(() => greeting(services));
  const [stage, setStage] = useState(STAGE.SERVICE);
  const [draft, setDraft] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  const pushBot = useCallback((text, quickReplies) => {
    setMessages((prev) => [...prev, makeMessage("bot", text, quickReplies)]);
  }, []);

  const pushUser = useCallback((text) => {
    setMessages((prev) => [...prev, makeMessage("user", text)]);
  }, []);

  const buildDateOptions = useCallback(
    (service) => {
      const options = [];
      for (let offset = 0; offset <= 13 && options.length < 4; offset++) {
        const date = addDays(today, offset);
        const iso = toISODate(date);
        if (!businessRules.openDays.includes(weekdayIndex(iso))) continue;
        const slots = getAvailableSlots({ isoDate: iso, service, appointments, businessRules, now: today });
        if (slots.length === 0) continue;
        const label = offset === 0 ? "Hoje" : offset === 1 ? "Amanhã" : formatDateLong(date);
        options.push({ label, value: iso });
      }
      return options;
    },
    [today, businessRules, appointments],
  );

  const selectService = useCallback(
    (service) => {
      setDraft((d) => ({ ...d, service }));
      const dateOptions = buildDateOptions(service);
      if (dateOptions.length === 0) {
        pushBot(
          `No momento não encontrei horários livres para "${service.name}" nos próximos dias. Tente novamente mais tarde ou escolha outro serviço.`,
          services.map((s) => ({ label: s.name, value: s.id })),
        );
        setStage(STAGE.SERVICE);
        return;
      }
      pushBot(`Ótima escolha! ${service.name} dura ${service.durationMinutes} minutos. Para qual dia?`, dateOptions);
      setStage(STAGE.DATE);
    },
    [buildDateOptions, pushBot, services],
  );

  const handleQuickReply = useCallback(
    (value) => {
      if (stage === STAGE.SERVICE) {
        const service = services.find((s) => s.id === value);
        if (!service) return;
        pushUser(service.name);
        selectService(service);
        return;
      }

      if (stage === STAGE.DATE) {
        const date = value;
        pushUser(formatDateLong(date));
        const slots = getAvailableSlots({
          isoDate: date,
          service: draft.service,
          appointments,
          businessRules,
          now: today,
        });
        setAvailableSlots(slots);
        setDraft((d) => ({ ...d, date }));
        if (slots.length === 0) {
          pushBot("Esse dia acabou de lotar. Escolha outra data:", buildDateOptions(draft.service));
          setStage(STAGE.DATE);
          return;
        }
        pushBot(
          "Temos esses horários disponíveis:",
          slots.slice(0, 12).map((s) => ({ label: s.start, value: s.start })),
        );
        setStage(STAGE.TIME);
        return;
      }

      if (stage === STAGE.TIME) {
        const slot = availableSlots.find((s) => s.start === value);
        if (!slot) return;
        pushUser(slot.start);
        setDraft((d) => ({ ...d, time: slot.start, end: slot.end }));
        pushBot("Perfeito! Para confirmar, qual é o seu nome completo?");
        setStage(STAGE.NAME);
        return;
      }

      if (stage === STAGE.DONE && value === "restart") {
        setDraft({});
        setAvailableSlots([]);
        setStage(STAGE.SERVICE);
        setMessages(greeting(services));
      }
    },
    [stage, services, draft, appointments, businessRules, today, availableSlots, pushBot, pushUser, selectService, buildDateOptions],
  );

  const handleUserText = useCallback(
    async (text) => {
      pushUser(text);

      if (stage === STAGE.SERVICE) {
        const match = matchService(text, services);
        if (match) {
          selectService(match);
        } else {
          pushBot(
            "Não encontrei esse serviço no nosso catálogo. Escolha uma das opções:",
            services.map((s) => ({ label: s.name, value: s.id })),
          );
        }
        return;
      }

      if (stage === STAGE.DATE) {
        pushBot("Escolha uma das datas disponíveis abaixo, por favor:", buildDateOptions(draft.service));
        return;
      }

      if (stage === STAGE.TIME) {
        pushBot(
          "Escolha um dos horários disponíveis abaixo, por favor:",
          availableSlots.slice(0, 12).map((s) => ({ label: s.start, value: s.start })),
        );
        return;
      }

      if (stage === STAGE.NAME) {
        if (text.trim().length < 2) {
          pushBot("Pode me dizer seu nome completo?");
          return;
        }
        setDraft((d) => ({ ...d, name: text.trim() }));
        pushBot("E qual o seu WhatsApp com DDD, para confirmarmos o horário?");
        setStage(STAGE.WHATSAPP);
        return;
      }

      if (stage === STAGE.WHATSAPP) {
        const parsed = clientContactSchema.safeParse({ name: draft.name, whatsapp: text.trim() });
        if (!parsed.success) {
          pushBot("Esse número não parece válido. Pode enviar novamente com DDD? Ex: (11) 90000-0000");
          return;
        }
        try {
          const client = await findOrCreateClient(parsed.data.name, parsed.data.whatsapp);
          const finalDraft = { ...draft, whatsapp: parsed.data.whatsapp };
          await addAppointment({
            date: finalDraft.date,
            start: finalDraft.time,
            end: finalDraft.end,
            serviceId: finalDraft.service.id,
            durationMinutes: finalDraft.service.durationMinutes,
            bufferMinutes: finalDraft.service.bufferMinutes,
            price: finalDraft.service.price,
            clientId: client.id,
            source: "ia",
          });
          setDraft(finalDraft);
          pushBot(
            `Agendado! ✅\n\n${finalDraft.service.name}\n${formatDateLong(finalDraft.date)} às ${finalDraft.time}\n${formatCurrencyBRL(finalDraft.service.price)}\n\nAté breve, ${client.name.split(" ")[0]}!`,
            [{ label: "Novo agendamento", value: "restart" }],
          );
          setStage(STAGE.DONE);
        } catch {
          pushBot("Tive um problema para confirmar seu agendamento. Pode tentar novamente?");
        }
      }
    },
    [stage, services, draft, availableSlots, buildDateOptions, selectService, pushBot, pushUser, findOrCreateClient, addAppointment],
  );

  const composerPlaceholder =
    stage === STAGE.NAME
      ? "Digite seu nome completo"
      : stage === STAGE.WHATSAPP
        ? "Digite seu WhatsApp"
        : stage === STAGE.SERVICE
          ? "Ou digite o serviço desejado"
          : "Use os botões acima para responder";

  const composerDisabled = stage === STAGE.DONE;

  return { messages, stage, draft, handleQuickReply, handleUserText, composerPlaceholder, composerDisabled };
}
