// ── Shift ──────────────────────────────────────────────────────────────────────
export type Shift = "Pagi" | "Siang" | "Sore";

// ── Request ────────────────────────────────────────────────────────────────────
export interface JadwalObatItem {
  jam: string;   // format "HH:MM"
  shift: Shift;
}

export interface TambahObatRequest {
  lansia_id: string;
  nama_obat: string;
  dosis: string;
  cara_pemberian: string;
  keterangan: string;
  jadwals: JadwalObatItem[];
}

// ── Response ───────────────────────────────────────────────────────────────────
export interface ObatData {
  id: string;
  lansia_id: string;
  nama_obat: string;
  dosis: string;
  cara_pemberian: string;
  keterangan: string;
  is_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface JadwalObatData {
  id: string;
  obat_id: string;
  jam: string;
  shift: Shift;
  created_at: string;
}

export interface TambahObatData {
  obat: ObatData;
  jadwals: JadwalObatData[];
}

export interface TambahObatResponse {
  success: boolean;
  message: string;
  data: TambahObatData;
}