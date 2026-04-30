"use server";

import type { ActionResult } from "@/lib/return-response";
import { tryCatch } from "@/lib/try-catch";
import { axiosPrivate } from "@/lib/axios";
import type { TambahGaleriRequest, GaleriData, TambahGaleriResponse } from "./dto";

export async function tambahGaleriAction(
  formData: FormData
): Promise<ActionResult<GaleriData>> {
  const { data: res, error } = await tryCatch<TambahGaleriResponse>(
    axiosPrivate
      .post("/api/pengurus/galeri", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal menyimpan dokumentasi.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}