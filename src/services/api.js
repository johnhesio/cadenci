import { supabase } from "@/lib/supabase";

function toHHMM(time) {
  return time ? time.slice(0, 5) : time;
}

function engagementFor(totalAppointments) {
  if (totalAppointments >= 8) return "alto";
  if (totalAppointments >= 3) return "médio";
  return "baixo";
}

function mapBusiness(row) {
  return {
    id: row.id,
    businessName: row.name,
    openDays: row.open_days,
    workHours: { start: toHHMM(row.work_start), end: toHHMM(row.work_end) },
    lunchBreak: { enabled: row.lunch_enabled, start: toHHMM(row.lunch_start), end: toHHMM(row.lunch_end) },
    slotGridMinutes: row.slot_grid_minutes,
    bufferMinutes: row.buffer_minutes,
    minAdvanceHours: Number(row.min_advance_hours),
  };
}

function mapService(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    durationMinutes: row.duration_minutes,
    bufferMinutes: row.buffer_minutes,
    price: Number(row.price),
  };
}

function mapClient(row) {
  return {
    id: row.id,
    name: row.name,
    whatsapp: row.whatsapp,
    totalAppointments: row.total_appointments,
    lastVisit: row.last_visit,
    engagement: engagementFor(row.total_appointments),
  };
}

function mapAppointment(row) {
  return {
    id: row.id,
    date: row.date,
    start: toHHMM(row.start_time),
    end: toHHMM(row.end_time),
    serviceId: row.service_id,
    serviceName: row.services?.name ?? "",
    durationMinutes: row.duration_minutes,
    bufferMinutes: row.buffer_minutes,
    price: Number(row.price),
    clientId: row.client_id,
    clientName: row.clients?.name ?? "",
    clientWhatsapp: row.clients?.whatsapp ?? "",
    status: row.status,
    source: row.source,
  };
}

export async function fetchBusiness() {
  const { data, error } = await supabase.from("businesses").select("*").limit(1).single();
  if (error) throw error;
  return mapBusiness(data);
}

export async function updateBusiness(businessId, patch) {
  const payload = {};
  if (patch.openDays) payload.open_days = patch.openDays;
  if (patch.workHours) {
    payload.work_start = patch.workHours.start;
    payload.work_end = patch.workHours.end;
  }
  if (patch.lunchBreak) {
    payload.lunch_enabled = patch.lunchBreak.enabled;
    payload.lunch_start = patch.lunchBreak.start;
    payload.lunch_end = patch.lunchBreak.end;
  }
  if (patch.slotGridMinutes != null) payload.slot_grid_minutes = patch.slotGridMinutes;
  if (patch.bufferMinutes != null) payload.buffer_minutes = patch.bufferMinutes;
  if (patch.minAdvanceHours != null) payload.min_advance_hours = patch.minAdvanceHours;

  const { data, error } = await supabase.from("businesses").update(payload).eq("id", businessId).select().single();
  if (error) throw error;
  return mapBusiness(data);
}

export async function fetchServices(businessId) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at");
  if (error) throw error;
  return data.map(mapService);
}

export async function createService(businessId, service) {
  const { data, error } = await supabase
    .from("services")
    .insert({
      business_id: businessId,
      name: service.name,
      category: service.category,
      duration_minutes: service.durationMinutes,
      buffer_minutes: service.bufferMinutes,
      price: service.price,
    })
    .select()
    .single();
  if (error) throw error;
  return mapService(data);
}

export async function updateServiceById(id, patch) {
  const payload = {};
  if (patch.name !== undefined) payload.name = patch.name;
  if (patch.category !== undefined) payload.category = patch.category;
  if (patch.durationMinutes !== undefined) payload.duration_minutes = patch.durationMinutes;
  if (patch.bufferMinutes !== undefined) payload.buffer_minutes = patch.bufferMinutes;
  if (patch.price !== undefined) payload.price = patch.price;

  const { data, error } = await supabase.from("services").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return mapService(data);
}

export async function deleteServiceById(id) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchClients(businessId) {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at");
  if (error) throw error;
  return data.map(mapClient);
}

export async function findOrCreateClientByWhatsapp(businessId, name, whatsapp) {
  const { data: existing, error: findError } = await supabase
    .from("clients")
    .select("*")
    .eq("business_id", businessId)
    .eq("whatsapp", whatsapp)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return mapClient(existing);

  const { data, error } = await supabase
    .from("clients")
    .insert({ business_id: businessId, name, whatsapp })
    .select()
    .single();
  if (error) throw error;
  return mapClient(data);
}

export async function registerClientVisitById(clientId, isoDate) {
  const { data: current, error: fetchError } = await supabase
    .from("clients")
    .select("total_appointments")
    .eq("id", clientId)
    .single();
  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from("clients")
    .update({ total_appointments: current.total_appointments + 1, last_visit: isoDate })
    .eq("id", clientId)
    .select()
    .single();
  if (error) throw error;
  return mapClient(data);
}

const APPOINTMENT_SELECT = "*, services(name), clients(name, whatsapp)";

export async function fetchAppointments(businessId) {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_SELECT)
    .eq("business_id", businessId)
    .order("date")
    .order("start_time");
  if (error) throw error;
  return data.map(mapAppointment);
}

export async function createAppointment(businessId, appointment) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      business_id: businessId,
      client_id: appointment.clientId,
      service_id: appointment.serviceId,
      date: appointment.date,
      start_time: appointment.start,
      end_time: appointment.end,
      duration_minutes: appointment.durationMinutes,
      buffer_minutes: appointment.bufferMinutes,
      price: appointment.price,
      status: appointment.status ?? "confirmado",
      source: appointment.source ?? "manual",
    })
    .select(APPOINTMENT_SELECT)
    .single();
  if (error) throw error;
  return mapAppointment(data);
}

export async function cancelAppointmentById(id) {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "cancelado" })
    .eq("id", id)
    .select(APPOINTMENT_SELECT)
    .single();
  if (error) throw error;
  return mapAppointment(data);
}

export function subscribeToChanges(businessId, { onServicesChange, onClientsChange, onAppointmentsChange }) {
  const channel = supabase
    .channel(`business-${businessId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "services", filter: `business_id=eq.${businessId}` },
      () => onServicesChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "clients", filter: `business_id=eq.${businessId}` },
      () => onClientsChange?.(),
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "appointments", filter: `business_id=eq.${businessId}` },
      () => onAppointmentsChange?.(),
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
