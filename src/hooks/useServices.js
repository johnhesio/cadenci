import { useAppContext } from "./useAppContext";

export function useServices() {
  const { services, addService, updateService, deleteService } = useAppContext();
  return { services, addService, updateService, deleteService };
}
