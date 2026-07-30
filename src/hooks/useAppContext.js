import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext deve ser usado dentro de AppProvider");
  return ctx;
}
