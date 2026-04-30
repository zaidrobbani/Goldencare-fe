"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGaleriByLansiaAction, tambahGaleriAction } from "./action";
import type { GaleriData } from "./dto";
import type { ActionResult } from "@/lib/return-response";

export function useTambahGaleri() {
  const queryClient = useQueryClient();

  return useMutation<ActionResult<GaleriData>, Error, FormData>({
    mutationFn: (formData) => tambahGaleriAction(formData),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["galeri"] });
      }
    },
  });
}

export function useGetGaleriByLansia(lansiaId: string | null) {
  return useQuery<GaleriData[], Error>({
    queryKey: ["galeri", lansiaId],
    queryFn: async () => {
      if (!lansiaId) return [];
      const result = await getGaleriByLansiaAction(lansiaId);
      if (!result.success) throw new Error(result.error);
      return result.data ?? [];
    },
    enabled: !!lansiaId,
  });
}