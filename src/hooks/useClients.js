import { useAppContext } from "./useAppContext";

export function useClients() {
  const { clients, findOrCreateClient, registerClientVisit } = useAppContext();
  return { clients, findOrCreateClient, registerClientVisit };
}
