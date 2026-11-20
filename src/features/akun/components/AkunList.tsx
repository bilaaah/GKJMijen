'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, IconButton, Modal, PageHeader, Person, SearchInput, Table } from '@/components/common';
import { Field, FilterSelect, FormInput, FormSelect, RadioPills } from '@/components/forms';
import { Alert, useConfirm, useToast } from '@/components/feedback';
import { useData, type Peran, type Profile } from '@/lib/data';
import { formatTanggalPendek } from '@/utils/formatters';
import { routeJemaatDetail } from '@/lib/constants/routes';

const UbahAkunModal: React.FC<{ akun: Profile; onClose: () => void }> = ({ akun, onClose }) => {
  const { db, setDb, user } = useData();
  const toast = useToast();
  const self = akun.id === user?.id;
  const tertaut = db.jemaat.find((j) => j.id_profiles === akun.id);
  const [nama, setNama] = useState(akun.nama);
  const [peran, setPeran] = useState<Peran>(akun.peran);
  const [jemaatId, setJemaatId] = useState(tertaut?.id ?? '');
  const [error, setError] = useState('');
  const opsiJemaat = db.jemaat.filter((j) => !j.id_profiles || j.id_profiles === akun.id).sort((a, b) => a.nama.localeCompare(b.nama));

  const simpan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return setError('Nama wajib diisi.');
    setDb((d) => ({
      ...d,
      profiles: d.profiles.map((p) => (p.id === akun.id ? { ...p, nama: nama.trim(), peran: self ? p.peran : peran } : p)),
      jemaat: d.jemaat.map((j) => {
        if (j.id === jemaatId) return { ...j, id_profiles: akun.id };
        if (j.id_profiles === akun.id) return { ...j, id_profiles: null };
        return j;
      }),
    }));
    toast(`Akun ${nama.trim()} diperbarui.`);
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Ubah Akun" subtitle={akun.email}>
      <form className="form-stack" onSubmit={simpan} noValidate>
        <FormInput id="akun-nama" label="Nama" required value={nama} onChange={(e) => setNama(e.target.value)} error={error} />
        <FormInput id="akun-email" label="Email" value={akun.email} readOnly />
        <Field
          label="Peran"
          helperText={self ? 'Anda tidak dapat mengubah peran akun sendiri.' : 'Pengurus dapat membuka seluruh menu admin. Warga hanya dapat mengajukan surat dan mengelola profil sendiri.'}
        >
          <RadioPills<Peran>
            name="peran"
            value={peran}
            onChange={setPeran}
            options={[
              { value: 'warga', label: 'Warga', disabled: self },
              { value: 'pengurus', label: 'Pengurus', disabled: self },
            ]}
          />
        </Field>
        <FormSelect
          id="akun-jemaat"
          label="Jemaat Tertaut"
          placeholder="— Tidak ditautkan —"
          helperText="Satu akun hanya mewakili satu jemaat (relasi 1 : 0..1)."
          options={opsiJemaat.map((j) => ({ value: j.id, label: `${j.nama} · ${j.wilayah}` }))}
          value={jemaatId}
          onChange={(e) => setJemaatId(e.target.value)}
        />
        <div className="modal-acts" style={{ marginTop: 6 }}>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" icon="check-lg">
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/** Daftar akun pengguna: ubah peran dan tautan ke data jemaat. */
export const AkunList: React.FC = () => {
  const { db, setDb, user } = useData();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const [peran, setPeran] = useState('');
  const [edit, setEdit] = useState<Profile | null>(null);
  const jemaatByProfile = useMemo(() => new Map(db.jemaat.filter((j) => j.id_profiles).map((j) => [j.id_profiles as string, j])), [db.jemaat]);

  const rows = db.profiles
    .filter((p) => (!q || `${p.nama} ${p.email}`.toLowerCase().includes(q.toLowerCase())) && (!peran || p.peran === peran))
    .sort((a, b) => (a.peran === b.peran ? a.nama.localeCompare(b.nama) : a.peran === 'pengurus' ? -1 : 1));

  const hapus = (p: Profile) => {
    const j = jemaatByProfile.get(p.id);
    confirm({
      title: 'Hapus akun?',
      message: (
        <>
          <b style={{ color: 'var(--espresso)' }}>
            {p.nama} ({p.email})
          </b>{' '}
          akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
        </>
      ),
      extra: j ? <Alert icon="link-45deg">Tautan ke data jemaat {j.nama} akan dilepas. Data jemaatnya tetap tersimpan.</Alert> : undefined,
      onConfirm: () => {
        setDb((d) => ({ ...d, profiles: d.profiles.filter((x) => x.id !== p.id), jemaat: d.jemaat.map((x) => (x.id_profiles === p.id ? { ...x, id_profiles: null } : x)) }));
        toast('Akun berhasil dihapus.');
      },
    });
  };

  return (
    <>
      <PageHeader eyebrow="Pengaturan" title="Akun Pengguna" description="Kelola peran akun (warga atau pengurus) dan tautan akun ke data jemaat." />
      <div className="filters">
        <SearchInput id="q-akun" value={q} onChange={setQ} placeholder="Cari nama atau email…" />
        <FilterSelect id="f-peran" label="Filter peran" value={peran} onChange={setPeran} options={[{ value: '', label: 'Semua peran' }, { value: 'warga', label: 'Warga' }, { value: 'pengurus', label: 'Pengurus' }]} />
      </div>
      <Table<Profile>
        key={`${q}|${peran}`}
        data={rows}
        rowKey={(p) => p.id}
        columns={[
          { header: 'Nama', cell: (p) => <Person name={p.nama + (p.id === user?.id ? ' (Anda)' : '')} /> },
          { header: 'Email', cell: (p) => p.email },
          { header: 'Peran', cell: (p) => (p.peran === 'pengurus' ? <Badge tone="rose">Pengurus</Badge> : <Badge tone="neu">Warga</Badge>) },
          {
            header: 'Jemaat Tertaut',
            cell: (p) => {
              const j = jemaatByProfile.get(p.id);
              return j ? (
                <button type="button" className="link" onClick={() => router.push(routeJemaatDetail(j.id))}>
                  {j.nama}
                </button>
              ) : (
                <span className="dim">–</span>
              );
            },
          },
          { header: 'Tanggal Daftar', className: 'nowrap', hideMd: true, cell: (p) => formatTanggalPendek(p.created_at) },
          {
            header: '',
            className: 'acts',
            cell: (p) => (
              <>
                <IconButton icon="pencil" label="Ubah akun" onClick={() => setEdit(p)} />
                {p.id === user?.id ? (
                  <span className="tip" data-tip="Anda tidak dapat menghapus akun sendiri" tabIndex={0}>
                    <IconButton icon="trash3" label="Hapus (tidak tersedia)" disabled />
                  </span>
                ) : (
                  <IconButton icon="trash3" label="Hapus akun" danger onClick={() => hapus(p)} />
                )}
              </>
            ),
          },
        ]}
      />
      {edit && <UbahAkunModal akun={edit} onClose={() => setEdit(null)} />}
    </>
  );
};
