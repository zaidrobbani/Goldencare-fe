"use server";

import type { ActionResult } from "@/lib/return-response";
import { tryCatch } from "@/lib/try-catch";
import { axiosPrivate } from "@/lib/axios";
import type {
  GaleriData,
  GaleriOptions,
  GaleriOptionsResponse,
  GetGaleriResponse,
  TambahGaleriResponse,
  TambahPemeriksaanRequest,
  TambahPemeriksaanResponse,
  TambahPemeriksaanResult,
} from "./dto";

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

export async function getGaleriByLansiaAction(
  lansiaId: string
): Promise<ActionResult<GaleriData[]>> {
  const { data: res, error } = await tryCatch<GetGaleriResponse>(
    axiosPrivate.get(`/api/galeri/lansia/${lansiaId}`).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal memuat riwayat galeri.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function getGaleriOptionsAction(): Promise<ActionResult<GaleriOptions>> {
  const { data: res, error } = await tryCatch<GaleriOptionsResponse>(
    axiosPrivate.get("/api/galeri/options").then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal memuat opsi galeri.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function tambahPemeriksaanAction(
  payload: TambahPemeriksaanRequest
): Promise<ActionResult<TambahPemeriksaanResult>> {
  const { data: res, error } = await tryCatch<TambahPemeriksaanResponse>(
    axiosPrivate.post("/api/pengurus/pemeriksaan", payload).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal menyimpan pemeriksaan.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}