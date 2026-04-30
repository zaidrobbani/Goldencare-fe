"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tambahGaleriAction } from "./action";
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