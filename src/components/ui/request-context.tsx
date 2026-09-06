"use client";
import { createContext, useContext, useState } from "react";
interface RequestContextValue {
  category: string | null;
  selectCategory: (value: string | null) => void;
}
const RequestContext = createContext<RequestContextValue | null>(null);
export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [category, selectCategory] = useState<string | null>(null);
  return (
    <RequestContext.Provider value={{ category, selectCategory }}>
      {children}
    </RequestContext.Provider>
  );
}
export function useRequest() {
  const context = useContext(RequestContext);
  if (!context) throw new Error("RequestProvider is required");
  return context;
}
