"use client";
 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tambahObatAction } from "./action";
import type { TambahObatRequest, TambahObatData } from "./dto";
import type { ActionResult } from "@/lib/return-response";
 
export function useTambahObat() {
  const queryClient = useQueryClient();
 
  return useMutation<ActionResult<TambahObatData>, Error, TambahObatRequest>({
    mutationFn: (payload) => tambahObatAction(payload),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["obat"] });
      }
    },
  });
}