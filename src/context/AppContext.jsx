import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as api from "@/services/api";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const today = useMemo(() => new Date(), []);

  const [businessId, setBusinessId] = useState(null);
  const [businessRules, setBusinessRules] = useState(null);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const business = await api.fetchBusiness();
        if (cancelled) return;
        setBusinessId(business.id);
        setBusinessRules(business);

        const [servicesData, clientsData, appointmentsData] = await Promise.all([
          api.fetchServices(business.id),
          api.fetchClients(business.id),
          api.fetchAppointments(business.id),
        ]);
        if (cancelled) return;
        setServices(servicesData);
        setClients(clientsData);
        setAppointments(appointmentsData);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!businessId) return undefined;
    return api.subscribeToChanges(businessId, {
      onServicesChange: () => api.fetchServices(businessId).then(setServices),
      onClientsChange: () => api.fetchClients(businessId).then(setClients),
      onAppointmentsChange: () => api.fetchAppointments(businessId).then(setAppointments),
    });
  }, [businessId]);

  const addService = useCallback(
    async (service) => {
      const created = await api.createService(businessId, service);
      setServices((prev) => [...prev, created]);
      return created;
    },
    [businessId],
  );

  const updateService = useCallback(async (id, patch) => {
    const updated = await api.updateServiceById(id, patch);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  }, []);

  const deleteService = useCallback(async (id) => {
    await api.deleteServiceById(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const findOrCreateClient = useCallback(
    async (name, whatsapp) => {
      const client = await api.findOrCreateClientByWhatsapp(businessId, name, whatsapp);
      setClients((prev) =>
        prev.some((c) => c.id === client.id) ? prev.map((c) => (c.id === client.id ? client : c)) : [...prev, client],
      );
      return client;
    },
    [businessId],
  );

  const registerClientVisit = useCallback(async (clientId, isoDate) => {
    const client = await api.registerClientVisitById(clientId, isoDate);
    setClients((prev) => prev.map((c) => (c.id === clientId ? client : c)));
    return client;
  }, []);

  const addAppointment = useCallback(
    async (appointment) => {
      const created = await api.createAppointment(businessId, appointment);
      setAppointments((prev) => [...prev, created]);
      if (created.clientId) await registerClientVisit(created.clientId, created.date);
      return created;
    },
    [businessId, registerClientVisit],
  );

  const cancelAppointment = useCallback(async (id) => {
    const updated = await api.cancelAppointmentById(id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
  }, []);

  const updateBusinessRules = useCallback(
    async (patch) => {
      const updated = await api.updateBusiness(businessId, patch);
      setBusinessRules(updated);
      return updated;
    },
    [businessId],
  );

  const value = useMemo(
    () => ({
      today,
      loading,
      error,
      businessId,
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
      loading,
      error,
      businessId,
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
