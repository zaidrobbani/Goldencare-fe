export type TingkatDarurat = "ringan" | "sedang" | "tinggi" | "kritis";

export interface TambahGaleriRequest {
  lansia_id: string;
  foto: File;
  lokasi_luka: string;
  deskripsi: string;
  jenis_kondisi: string
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