export type JenisKelamin = "L" | "P";
export type GolonganDarah = "A" | "B" | "AB" | "O";

export interface TambahLansiaRequest {
  nama: string;
  nik: string;
  tanggal_lahir: string; // format: YYYY-MM-DD
  jenis_kelamin: JenisKelamin;
  alamat_asal: string;
  golongan_darah: GolonganDarah;
  riwayat_penyakit: string;
  alergi: string;
}

export interface TambahLansiaData {
  id: string;
  nama: string;
}

export interface TambahLansiaResponse {
  success: boolean;
  message: string;
  data: TambahLansiaData;
}

export interface LansiaItem {
  id: string;
  panti_id: string;
  kamar_id: string | null;
  nama: string;
  nik: string;
  tanggal_lahir: string;
  jenis_kelamin: JenisKelamin;
  alamat_asal: string;
  golongan_darah: GolonganDarah;
  riwayat_penyakit: string;
  alergi: string;
  foto_url: string;
  tanggal_masuk: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface GetLansiaResponse {
  success: boolean;
  message: string;
  data: LansiaItem[];
}

export interface DashbordlansiaItem {
    pemeriksaan_hari_ini: number;
    perlu_perhatian: number;
    total_lansia: number;
}

export interface DashboardLansiaResponse {
    success: boolean;
    message: string;
    data: DashbordlansiaItem;
}