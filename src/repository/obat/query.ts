"use client";
 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tambahObatAction, getJadwalHariIniAction, getObatLansiaAction, checklistObatAction } from "./action";
import type {
  TambahObatRequest,
  TambahObatData,
  JadwalHariIniData,
  ObatLansiaItem,
  ChecklistRequest,
  ChecklistData,
} from "./dto";
import type { ActionResult } from "@/lib/return-response";
 
export function useTambahObat() {
  const queryClient = useQueryClient();
 
  return useMutation<ActionResult<TambahObatData>, Error, TambahObatRequest>({
    mutationFn: (payload) => tambahObatAction(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["obat"] });
        queryClient.invalidateQueries({ queryKey: ["jadwal-hari-ini"] });
      }
    },
  });
}

export function useGetJadwalHariIni() {
  return useQuery<JadwalHariIniData, Error>({
    queryKey: ["jadwal-hari-ini"],
    queryFn: async () => {
      const result = await getJadwalHariIniAction();
      if (!result.success) throw new Error(result.error);
      return result.data!;
    },
  });
}

export function useGetObatLansia(lansiaId: string | null) {
  return useQuery<ObatLansiaItem[], Error>({
    queryKey: ["obat-lansia", lansiaId],
    queryFn: async () => {
      if (!lansiaId) return [];
      const result = await getObatLansiaAction(lansiaId);
      if (!result.success) throw new Error(result.error);
      return result.data ?? [];
    },
    enabled: !!lansiaId,
  });
}

export function useChecklistObat() {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<ChecklistData>, Error, ChecklistRequest>({
    mutationFn: (payload) => checklistObatAction(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["jadwal-hari-ini"] });
      }
    },
  });
}