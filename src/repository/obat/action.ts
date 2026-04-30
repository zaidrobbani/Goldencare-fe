'use server'
import { axiosPrivate } from "@/lib/axios";
import { tryCatch } from "@/lib/try-catch";
import type { ActionResult } from "@/lib/return-response";
import type {
  TambahObatRequest,
  TambahObatData,
  TambahObatResponse,
  JadwalHariIniData,
  JadwalHariIniResponse,
  ObatLansiaItem,
  ObatLansiaResponse,
  ChecklistRequest,
  ChecklistData,
  ChecklistResponse,
} from "./dto";

export async function tambahObatAction(
  payload: TambahObatRequest
): Promise<ActionResult<TambahObatData>> {
  const { data: res, error } = await tryCatch<TambahObatResponse>(
    axiosPrivate.post("/api/pengurus/obat", payload).then((r) => r.data)
  );
 
  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ??
      error?.message ??
      "Gagal menambahkan obat.";
    return { success: false, error: message };
  }
 
  return { success: true, data: res.data };
}

export async function getJadwalHariIniAction(): Promise<ActionResult<JadwalHariIniData>> {
  const { data: res, error } = await tryCatch<JadwalHariIniResponse>(
    axiosPrivate.get("/api/pengurus/obat/jadwal-hari-ini").then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ??
      error?.message ??
      "Gagal memuat jadwal obat hari ini.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function getObatLansiaAction(
  lansiaId: string
): Promise<ActionResult<ObatLansiaItem[]>> {
  const { data: res, error } = await tryCatch<ObatLansiaResponse>(
    axiosPrivate.get(`/api/pengurus/obat/lansia/${lansiaId}`).then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ??
      error?.message ??
      "Gagal memuat daftar obat lansia.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}

export async function checklistObatAction(
  payload: ChecklistRequest
): Promise<ActionResult<ChecklistData>> {
  const { data: res, error } = await tryCatch<ChecklistResponse>(
    axiosPrivate
      .post(`/api/pengurus/obat/checklist/${payload.jadwal_obat_id}`, {
        catatan: payload.catatan,
      })
      .then((r) => r.data)
  );

  if (error || !res?.success) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response
        ?.data?.message ??
      error?.message ??
      "Gagal mencatat pemberian obat.";
    return { success: false, error: message };
  }

  return { success: true, data: res.data };
}
