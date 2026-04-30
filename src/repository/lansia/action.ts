'use server'
import type { ActionResult } from "@/lib/return-response";
import { tryCatch } from "@/lib/try-catch";
import { axiosPrivate } from "@/lib/axios";
import { DashboardLansiaResponse, DashbordlansiaItem, GetLansiaResponse, LansiaItem, TambahLansiaData, TambahLansiaRequest, TambahLansiaResponse } from "./dto";

export async function TambahLansiaAction(
  payload: TambahLansiaRequest
): Promise<ActionResult<TambahLansiaData>> {
  const { data: res, error } = await tryCatch<TambahLansiaResponse>(
    axiosPrivate.post("/api/pengelola/lansia", payload).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal menambahkan lansia.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function getLansiaByPengelola(): Promise<ActionResult<LansiaItem[]>> {
  const { data: res, error } = await tryCatch<GetLansiaResponse>(
    axiosPrivate.get("/api/pengelola/lansia").then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal memuat data lansia.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function getDashboardLansiaAction(): Promise<ActionResult<DashbordlansiaItem>> {
  const { data: res, error } = await tryCatch<DashboardLansiaResponse>(
    axiosPrivate.get("/api/pengelola/lansia/dashboard").then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal memuat data lansia.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function getLansiaByPengurus(): Promise<ActionResult<LansiaItem[]>> {
  const { data: res, error } = await tryCatch<GetLansiaResponse>(
    axiosPrivate.get("/api/pengurus/lansia").then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ??
      error?.message ??
      "Gagal memuat data lansia.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

