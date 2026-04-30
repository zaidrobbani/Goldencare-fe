'use server'
import { axiosPrivate } from "@/lib/axios";
import { tryCatch } from "@/lib/try-catch";
import type { ActionResult } from "@/lib/return-response";
import type {
  TambahObatRequest,
  TambahObatData,
  TambahObatResponse,
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