import { Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/pages/Dashboard";
import DailyAgenda from "@/pages/DailyAgenda";
import ServiceCatalog from "@/pages/ServiceCatalog";
import CRM from "@/pages/CRM";
import BusinessSettings from "@/pages/BusinessSettings";
import SimulateClient from "@/pages/SimulateClient";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<DailyAgenda />} />
        <Route path="/catalog" element={<ServiceCatalog />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/settings" element={<BusinessSettings />} />
        <Route path="/simulate" element={<SimulateClient />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
