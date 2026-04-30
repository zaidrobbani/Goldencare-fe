export type TingkatDarurat = "ringan" | "sedang" | "tinggi" | "kritis";

export interface TambahGaleriRequest {
  lansia_id: string;
  foto: File;
  lokasi_luka: string;
  deskripsi: string;
  jenis_kondisi: string;
}

// ── Pemeriksaan ───────────────────────────────────────────────────────────────
export interface TambahPemeriksaanRequest {
  lansia_id: string;
  tekanan_darah: string;
  detak_jantung: number;
  suhu_tubuh: number;
  gula_darah: number;
  berat_badan: number;
  keluhan: string;
}

export interface PemeriksaanData {
  id: string;
  lansia_id: string;
  pengurus_id: string;
  tekanan_darah: string;
  detak_jantung: number;
  gula_darah: number;
  suhu_tubuh: number;
  berat_badan: number;
  keluhan: string;
  status: string;
  rekomendasi: string;
  status_darurat: string;
  created_at: string;
}

export interface PemeriksaanRecommendation {
  status: string;
  color: string;
  title: string;
  description: string;
  action_items: string[];
  anomalies_found: string[];
  follow_up_interval: string;
}

export interface TambahPemeriksaanResult {
  pemeriksaan: PemeriksaanData;
  recommendation: PemeriksaanRecommendation;
}

export interface TambahPemeriksaanResponse {
  success: boolean;
  message: string;
  data: TambahPemeriksaanResult;
}

export interface GaleriData {
  id: string;
  lansia_id: string;
  pengurus_id: string;
  foto_url: string;
  lokasi_luka: string;
  deskripsi: string;
  analisis_ai: string;
  tingkat_darurat: TingkatDarurat;
  prediksi_penyakit: string;
  created_at: string;
}

export interface TambahGaleriResponse {
  success: boolean;
  message: string;
  data: GaleriData;
}

export interface GetGaleriResponse {
  success: boolean;
  message: string;
  data: GaleriData[];
}

export interface GaleriOptions {
  jenis_kondisi: string[];
  lokasi_tubuh: string[];
}

export interface GaleriOptionsResponse {
  success: boolean;
  message: string;
  data: GaleriOptions;
}