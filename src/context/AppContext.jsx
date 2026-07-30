import { createContext, useCallback, useMemo, useState } from "react";
import { addDays, toISODate, addMinutesToTime } from "../utils/dateHelpers";

export const AppContext = createContext(null);

const INITIAL_SERVICES = [
  { id: "s1", name: "Limpeza de pele profunda", category: "Facial", durationMinutes: 60, bufferMinutes: 15, price: 150 },
  { id: "s2", name: "Massagem relaxante", category: "Corporal", durationMinutes: 50, bufferMinutes: 10, price: 130 },
  { id: "s3", name: "Design de sobrancelhas", category: "Design", durationMinutes: 30, bufferMinutes: 5, price: 60 },
  { id: "s4", name: "Drenagem linfática", category: "Corporal", durationMinutes: 45, bufferMinutes: 10, price: 120 },
  { id: "s5", name: "Peeling químico", category: "Facial", durationMinutes: 40, bufferMinutes: 15, price: 180 },
  { id: "s6", name: "Limpeza + Hidratação facial", category: "Facial", durationMinutes: 90, bufferMinutes: 15, price: 220 },
];

const CLIENT_NAMES = [
  "Marina Torres",
  "Beatriz Andrade",
  "Camila Souza",
  "Fernanda Lima",
  "Juliana Ramos",
  "Patrícia Gomes",
  "Rafaela Duarte",
  "Larissa Nogueira",
  "Vanessa Pires",
  "Aline Barbosa",
];

const ENGAGEMENT_BY_INDEX = ["alto", "alto", "médio", "alto", "baixo", "médio", "médio", "baixo", "alto", "médio"];

function buildInitialClients(today) {
  return CLIENT_NAMES.map((name, i) => ({
    id: `c${i + 1}`,
    name,
    whatsapp: `(11) 9${String(6000 + i * 137).padStart(4, "0")}-${String(1000 + i * 91).padStart(4, "0")}`,
    totalAppointments: 3 + ((i * 5) % 14),
    engagement: ENGAGEMENT_BY_INDEX[i],
    lastVisit: toISODate(addDays(today, -((i * 3) % 20))),
  }));
}

const DAILY_TEMPLATE = [
  { time: "09:00", serviceIdx: 0 },
  { time: "10:15", serviceIdx: 2 },
  { time: "14:00", serviceIdx: 1 },
  { time: "15:30", serviceIdx: 3 },
  { time: "17:00", serviceIdx: 4 },
];

function buildInitialAppointments(today, services, clients) {
  const appointments = [];
  let counter = 1;

  for (let offset = -6; offset <= 2; offset++) {
    const date = addDays(today, offset);
    const dow = date.getDay();
    if (dow === 0) continue; // fechado aos domingos

    const isFuture = offset > 0;
    const isToday = offset === 0;
    const template = DAILY_TEMPLATE.slice(0, isFuture ? 3 : DAILY_TEMPLATE.length);

    template.forEach(({ time, serviceIdx }, i) => {
      const service = services[serviceIdx];
      const client = clients[(Math.abs(offset) * 3 + i) % clients.length];
      const end = addMinutesToTime(time, service.durationMinutes);

      let status = "confirmado";
      if (!isFuture && !isToday) status = "concluido";
      if (isToday && time < "13:00") status = "concluido";

      appointments.push({
        id: `a${counter++}`,
        date: toISODate(date),
        start: time,
        end,
        serviceId: service.id,
        serviceName: service.name,
        durationMinutes: service.durationMinutes,
        bufferMinutes: service.bufferMinutes,
        price: service.price,
        clientId: client.id,
        clientName: client.name,
        clientWhatsapp: client.whatsapp,
        status,
        source: (i + Math.abs(offset)) % 3 === 0 ? "ia" : "manual",
      });
    });
  }

  return appointments;
}

const DEFAULT_BUSINESS_RULES = {
  businessName: "Espaço Cadência",
  openDays: [1, 2, 3, 4, 5, 6],
  workHours: { start: "09:00", end: "19:00" },
  lunchBreak: { enabled: true, start: "12:00", end: "13:00" },
  slotGridMinutes: 15,
  bufferMinutes: 10,
  minAdvanceHours: 2,
};

function nextId(prefix, list) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}${list.length}`;
}

export function AppProvider({ children }) {
  const today = useMemo(() => new Date(), []);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [clients, setClients] = useState(() => buildInitialClients(today));
  const [appointments, setAppointments] = useState(() =>
    buildInitialAppointments(today, INITIAL_SERVICES, buildInitialClients(today)),
  );
  const [businessRules, setBusinessRules] = useState(DEFAULT_BUSINESS_RULES);

  const addService = useCallback((service) => {
    setServices((prev) => [...prev, { ...service, id: nextId("s", prev) }]);
  }, []);

  const updateService = useCallback((id, patch) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const deleteService = useCallback((id) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const findOrCreateClient = useCallback((name, whatsapp) => {
    let created = null;
    setClients((prev) => {
      const existing = prev.find((c) => c.whatsapp === whatsapp);
      if (existing) {
        created = existing;
        return prev;
      }
      const newClient = {
        id: nextId("c", prev),
        name,
        whatsapp,
        totalAppointments: 0,
        engagement: "baixo",
        lastVisit: null,
      };
      created = newClient;
      return [...prev, newClient];
    });
    return created;
  }, []);

  const registerClientVisit = useCallback((clientId, isoDate) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? {
              ...c,
              totalAppointments: c.totalAppointments + 1,
              lastVisit: isoDate,
              engagement: c.totalAppointments + 1 >= 8 ? "alto" : c.totalAppointments + 1 >= 3 ? "médio" : "baixo",
            }
          : c,
      ),
    );
  }, []);

  const addAppointment = useCallback(
    (appointment) => {
      const id = nextId("a", []);
      const full = { status: "confirmado", source: "manual", ...appointment, id };
      setAppointments((prev) => [...prev, full]);
      if (full.clientId) registerClientVisit(full.clientId, full.date);
      return full;
    },
    [registerClientVisit],
  );

  const cancelAppointment = useCallback((id) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a)));
  }, []);

  const updateBusinessRules = useCallback((patch) => {
    setBusinessRules((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({
      today,
      services,
      addService,
      updateService,
      deleteService,
      clients,
      findOrCreateClient,
      registerClientVisit,
      appointments,
      addAppointment,
      cancelAppointment,
      businessRules,
      updateBusinessRules,
    }),
    [
      today,
      services,
      addService,
      updateService,
      deleteService,
      clients,
      findOrCreateClient,
      registerClientVisit,
      appointments,
      addAppointment,
      cancelAppointment,
      businessRules,
      updateBusinessRules,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
