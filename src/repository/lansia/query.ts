"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDashboardLansiaAction,
  getLansiaByPengelola,
  getLansiaByPengurus,
  TambahLansiaAction,
} from "./action";
import type { TambahLansiaRequest, TambahLansiaData, LansiaItem, DashbordlansiaItem } from "./dto";
import type { ActionResult } from "@/lib/return-response";

export function useTambahLansia() {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<TambahLansiaData>, Error, TambahLansiaRequest>({
    mutationFn: (payload) => TambahLansiaAction(payload),
    onSuccess: (result) => {
      if (result.success) {
        // Invalidate supaya list lansia refetch otomatis
        queryClient.invalidateQueries({ queryKey: ["lansia"] });
      }
    },
  });
}

export function useGetLansiaByPengelola() {
  return useQuery<LansiaItem[], Error>({
    queryKey: ["lansia"],
    queryFn: async () => {
      const result = await getLansiaByPengelola();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useGetDashboardLansia() {
  return useQuery<DashbordlansiaItem, Error>({
    queryKey: ["dashboardLansia"],
    queryFn: async () => {
      const result = await getDashboardLansiaAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useGetLansiaByPengurus() {
  return useQuery<LansiaItem[], Error>({
    queryKey: ["lansiaPengurus"],
    queryFn: async () => {
      const result = await getLansiaByPengurus();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}
