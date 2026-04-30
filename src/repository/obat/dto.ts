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

// ── Jadwal Hari Ini ─────────────────────────────────────────────────────
export interface JadwalHariIniItem {
  jadwal_obat_id: string;
  obat_id: string;
  lansia_id: string;
  nama_lansia: string;
  nomor_kamar: string;
  foto_lansia: string;
  nama_obat: string;
  dosis: string;
  cara_pemberian: string;
  jam: string;
  shift: Shift;
  status_pemberian: string;
  diberikan_pada: string | null;
  nama_pengurus: string;
}

export interface JadwalHariIniData {
  tanggal: string;
  hari: string;
  jadwal: Record<Shift, JadwalHariIniItem[]>;
}

export interface JadwalHariIniResponse {
  success: boolean;
  message: string;
  data: JadwalHariIniData;
}

// ── Obat per Lansia ──────────────────────────────────────────────────
export interface ObatLansiaItem {
  obat: ObatData;
  jadwals: JadwalObatData[] | null;
}

export interface ObatLansiaResponse {
  success: boolean;
  message: string;
  data: ObatLansiaItem[];
}

// ── Checklist Obat ──────────────────────────────────────────────
export interface ChecklistRequest {
  jadwal_obat_id: string;
  catatan: string;
}

export interface ChecklistData {
  id: string;
  jadwal_obat_id: string;
  pengurus_id: string;
  diberikan_pada: string;
  catatan: string;
}

export interface ChecklistResponse {
  success: boolean;
  message: string;
  data: ChecklistData;
}