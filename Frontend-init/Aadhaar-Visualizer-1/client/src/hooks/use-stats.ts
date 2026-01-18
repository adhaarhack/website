import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// Hook for KPI Stats (Cards)
export function useKpiStats() {
  return useQuery({
    queryKey: [api.stats.kpi.path],
    queryFn: async () => {
      const res = await fetch(api.stats.kpi.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch KPI stats");
      return api.stats.kpi.responses[200].parse(await res.json());
    },
  });
}

// Hook for State-wise Stats (Bar Charts)
export function useStateWiseStats() {
  return useQuery({
    queryKey: [api.stats.stateWise.path],
    queryFn: async () => {
      const res = await fetch(api.stats.stateWise.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch state-wise stats");
      return api.stats.stateWise.responses[200].parse(await res.json());
    },
  });
}

// Hook for Trends (Line Charts)
export function useTrendsStats() {
  return useQuery({
    queryKey: [api.stats.trends.path],
    queryFn: async () => {
      const res = await fetch(api.stats.trends.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch trends");
      return api.stats.trends.responses[200].parse(await res.json());
    },
  });
}
