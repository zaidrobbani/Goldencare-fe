"use client";

import { useState } from "react";
import { BaseModal, ModalBody, ModalFooter, ModalHeader } from "@/shared/Modal/Modal";
import { TextField, TextArea } from "@/shared/TextField/TextField";
import DropDown from "@/shared/DropDown/DropDown";
import { useTambahObat } from "@/repository/obat/query";
import { useGetLansiaByPengurus } from "@/repository/lansia/query";
import { useToast } from "@/shared/Toast/ToastProvider";
import type { Shift, TambahObatRequest, JadwalObatItem } from "@/repository/obat/dto";

const SHIFT_OPTIONS: { value: Shift; label: string }[] = [
  { value: "Pagi", label: "Pagi" },
  { value: "Siang", label: "Siang" },
  { value: "Sore", label: "Sore" },
];

interface JadwalRowProps {
  index: number;
  item: JadwalObatItem;
  onChange: (index: number, updated: JadwalObatItem) => void;
  onRemove: (index: number) => void;
  disabled: boolean;
}

const JadwalRow = ({ index, item, onChange, onRemove, disabled }: JadwalRowProps) => {
  return (
    <div className="flex items-end gap-2">
      {/* Shift dropdown */}
      <div className="flex-1">
        <DropDown<Shift>
          label={index === 0 ? "Shift" : ""}
          placeholder="Pilih shift"
          value={item.shift}
          options={SHIFT_OPTIONS}
          onChange={(val) => onChange(index, { ...item, shift: val })}
          disabled={disabled}
        />
      </div>

      {/* Jam input */}
      <div className="flex-1">
        <TextField
          label={index === 0 ? "Jam" : ""}
          type="time"
          value={item.jam}
          onChange={(e) => onChange(index, { ...item, jam: e.target.value })}
          disabled={disabled}
        />
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={disabled}
        className="mb-0.5 w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-error-container hover:text-error transition-colors disabled:opacity-40 shrink-0"
      >
        ✕
      </button>
    </div>
  );
};

interface TambahObatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TambahModal({ isOpen, onClose }: TambahObatModalProps) {
  const { mutate: tambah, isPending } = useTambahObat();
  const { data: lansiaList = [], isLoading: lansiaLoading } = useGetLansiaByPengurus();
  const { success: showSuccess, error: showError } = useToast();

  const [lansiaId, setLansiaId] = useState<string | null>(null);
  const [namaObat, setNamaObat] = useState("");
  const [dosis, setDosis] = useState("");
  const [caraPemberian, setCaraPemberian] = useState<string | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [jadwals, setJadwals] = useState<JadwalObatItem[]>([{ shift: "Pagi", jam: "08:00" }]);

  function resetForm() {
    setLansiaId(null);
    setNamaObat("");
    setDosis("");
    setCaraPemberian(null);
    setKeterangan("");
    setJadwals([{ shift: "Pagi", jam: "08:00" }]);
  }

  function handleClose() {
    if (isPending) return;
    resetForm();
    onClose();
  }

  function handleJadwalChange(index: number, updated: JadwalObatItem) {
    setJadwals((prev) => prev.map((j, i) => (i === index ? updated : j)));
  }

  function handleJadwalRemove(index: number) {
    setJadwals((prev) => prev.filter((_, i) => i !== index));
  }

  function handleJadwalAdd() {
    setJadwals((prev) => [...prev, { shift: "Pagi", jam: "08:00" }]);
  }

  function handleSubmit() {
    if (!lansiaId || !namaObat || !dosis || !caraPemberian) {
      showError("Semua field wajib diisi");
      return;
    }

    if (jadwals.length === 0) {
      showError("Jadwal pemberian obat minimal satu");
      return;
    }

    const incomplateJadwal = jadwals.find((j) => !j.shift || !j.jam);
    if (incomplateJadwal) {
      showError("Semua jadwal harus lengkap (shift dan jam)");
      return;
    }

    const payload: TambahObatRequest = {
      lansia_id: lansiaId,
      nama_obat: namaObat,
      dosis,
      cara_pemberian: caraPemberian,
      keterangan,
      jadwals,
    };

    tambah(payload, {
      onSuccess: (results) => {
        if (!results.success) {
          showError(results.error || "Gagal menambahkan obat");
          return;
        }

        showSuccess("Obat berhasil ditambahkan");
        resetForm();
        onClose();
      },
      onError: (error) => {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          error?.message ??
          "Gagal menambahkan obat";
        showError(message);
      },
    });
  }

  const lansiaOptions = lansiaList.map((l) => ({ value: l.id, label: l.nama }));

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} disabled={isPending} maxWidth="max-w-lg">
      <ModalHeader
        title="Tambah Obat"
        subtitle="Isi data obat dan jadwal pemberian dengan lengkap."
        onClose={handleClose}
        disabled={isPending}
      />

      <ModalBody>
        {/* Lansia */}
        <DropDown<string>
          label="Lansia"
          placeholder={lansiaLoading ? "Memuat data lansia..." : "Pilih lansia"}
          value={lansiaId}
          options={lansiaOptions}
          onChange={setLansiaId}
          disabled={isPending || lansiaLoading}
        />

        {/* Nama Obat */}
        <TextField
          label="Nama Obat"
          placeholder="Contoh: Amoxicillin"
          value={namaObat}
          onChange={(e) => setNamaObat(e.target.value)}
          disabled={isPending}
        />

        {/* Dosis */}
        <TextField
          label="Dosis"
          placeholder="Contoh: 500mg"
          value={dosis}
          onChange={(e) => setDosis(e.target.value)}
          disabled={isPending}
        />

        {/* Cara Pemberian */}
        <TextField
            label="Cara Pemberian"
            placeholder="Contoh: Oral, 3 kali sehari setelah makan"
            value={caraPemberian!}
            onChange={(e) => setCaraPemberian(e.target.value)}
            disabled={isPending}
        />

        {/* Keterangan */}
        <TextArea
          label="Keterangan"
          placeholder="Contoh: Diminum setelah makan"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          disabled={isPending}
          rows={2}
        />

        {/* Jadwal section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold font-body text-on-surface">
              Jadwal Pemberian
            </label>
            <button
              type="button"
              onClick={handleJadwalAdd}
              disabled={isPending || jadwals.length >= 3}
              className="text-xs font-semibold font-body text-primary hover:underline disabled:opacity-40 disabled:no-underline transition-all"
            >
              + Tambah Jadwal
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {jadwals.map((jadwal, i) => (
              <JadwalRow
                key={i}
                index={i}
                item={jadwal}
                onChange={handleJadwalChange}
                onRemove={handleJadwalRemove}
                disabled={isPending}
              />
            ))}
          </div>

          {jadwals.length === 0 && (
            <p className="text-xs text-outline font-body text-center py-2">
              Belum ada jadwal. Klik &quot;+ Tambah Jadwal&quot; untuk menambahkan.
            </p>
          )}
        </div>
      </ModalBody>

      <ModalFooter
        onCancel={handleClose}
        onConfirm={handleSubmit}
        confirmLabel="Tambah Obat"
        loadingLabel="Menyimpan..."
        isLoading={isPending}
      />
    </BaseModal>
  );
}
