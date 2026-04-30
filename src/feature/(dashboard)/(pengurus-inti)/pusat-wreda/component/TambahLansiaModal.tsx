"use client";

import { BaseModal, ModalHeader, ModalBody, ModalFooter } from "@/shared/Modal/Modal";
import { TextField, TextArea } from "@/shared/TextField/TextField";
import Dropdown from "@/shared/DropDown/DropDown";
import { useTambahLansia } from "@/repository/lansia/query";
import { useToast } from "@/shared/Toast/ToastProvider";
import type { JenisKelamin, GolonganDarah, TambahLansiaRequest } from "@/repository/lansia/dto";
import { useState } from "react";

interface TambahLansiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TambahLansiaModal({ isOpen, onClose }: TambahLansiaModalProps) {
  const { mutate: tambah, isPending } = useTambahLansia();
  const { success: showSuccess, error: showError } = useToast();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState<JenisKelamin | null>(null);
  const [alamatAsal, setAlamatAsal] = useState("");
  const [golonganDarah, setGolonganDarah] = useState<GolonganDarah | null>(null);
  const [riwayatPenyakit, setRiwayatPenyakit] = useState("");
  const [alergi, setAlergi] = useState("");

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function resetForm() {
    setNama("");
    setNik("");
    setTanggalLahir("");
    setJenisKelamin(null);
    setAlamatAsal("");
    setGolonganDarah(null);
    setRiwayatPenyakit("");
    setAlergi("");
  }

  function handleClose() {
    if (isPending) return;
    resetForm();
    onClose();
  }

  function handleSubmit() {
    if (!nama || !nik || !tanggalLahir || !jenisKelamin || !alamatAsal || !golonganDarah || !riwayatPenyakit || !alergi) {
      showError("Semua field wajib diisi.");
      return;
    }

    const payload: TambahLansiaRequest = {
      nama,
      nik,
      tanggal_lahir: tanggalLahir,
      jenis_kelamin: jenisKelamin,
      alamat_asal: alamatAsal,
      golongan_darah: golonganDarah,
      riwayat_penyakit: riwayatPenyakit,
      alergi,
    };

    tambah(payload, {
      onSuccess: (result) => {
        if (!result.success) {
          showError(result.error || "Gagal menambahkan lansia.");
          return;
        }
        showSuccess(`Lansia "${result.data.nama}" berhasil ditambahkan.`);
        resetForm();
        onClose();
      },
      onError: (err) => {
        showError(err.message || "Terjadi kesalahan. Coba lagi.");
      },
    });
  }

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} disabled={isPending} maxWidth="max-w-lg">
      <ModalHeader
        title="Tambah Lansia"
        subtitle="Isi data lansia dengan lengkap dan benar."
        onClose={handleClose}
        disabled={isPending}
      />

      <ModalBody>
        <TextField
          label="Nama Lengkap"
          placeholder="Contoh: Siti Rahayu"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          disabled={isPending}
        />

        <TextField
          label="NIK"
          placeholder="16 digit NIK"
          value={nik}
          onChange={(e) => setNik(e.target.value.replace(/\D/g, "").slice(0, 16))}
          disabled={isPending}
          maxLength={16}
        />

        <TextField
          label="Tanggal Lahir"
          type="date"
          value={tanggalLahir}
          onChange={(e) => setTanggalLahir(e.target.value)}
          disabled={isPending}
        />

        <Dropdown<JenisKelamin>
          label="Jenis Kelamin"
          placeholder="Pilih jenis kelamin"
          value={jenisKelamin}
          options={[
            { value: "L", label: "Laki-laki" },
            { value: "P", label: "Perempuan" },
          ]}
          onChange={setJenisKelamin}
          disabled={isPending}
        />

        <TextField
          label="Alamat Asal"
          placeholder="Contoh: Ngijo, Semarang"
          value={alamatAsal}
          onChange={(e) => setAlamatAsal(e.target.value)}
          disabled={isPending}
        />

        <Dropdown<GolonganDarah>
          label="Golongan Darah"
          placeholder="Pilih golongan darah"
          value={golonganDarah}
          options={[
            { value: "A", label: "A" },
            { value: "B", label: "B" },
            { value: "AB", label: "AB" },
            { value: "O", label: "O" },
          ]}
          onChange={setGolonganDarah}
          disabled={isPending}
        />

        <TextArea
          label="Riwayat Penyakit"
          placeholder="Contoh: Hipertensi, Diabetes"
          value={riwayatPenyakit}
          onChange={(e) => setRiwayatPenyakit(e.target.value)}
          disabled={isPending}
          rows={2}
        />

        <TextArea
          label="Alergi"
          placeholder="Contoh: Penisilin, Seafood"
          value={alergi}
          onChange={(e) => setAlergi(e.target.value)}
          disabled={isPending}
          rows={2}
        />
      </ModalBody>

      <ModalFooter
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmLabel="Tambah Lansia"
        loadingLabel="Menyimpan..."
        isLoading={isPending}
      />
    </BaseModal>
  );
}