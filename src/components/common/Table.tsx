'use client';

import React, { useState } from 'react';
import { IconButton } from './Button';
import { EmptyState } from '../feedback/EmptyState';

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  rowClassName?: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: string;
  flat?: boolean;
}

/** Tabel data dengan pagination sederhana (8 baris per halaman). */
export function Table<T>({
  columns,
  data,
  rowKey,
  pageSize = 8,
  rowClassName,
  onRowClick,
  emptyTitle = 'Tidak ada data yang cocok',
  emptyMessage = 'Ubah kata kunci atau filter, atau tambahkan data baru.',
  flat = false,
}: TableProps<T>) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(data.length / pageSize));
  const current = Math.min(page, pages);
  const rows = data.slice((current - 1) * pageSize, current * pageSize);
  const from = data.length ? (current - 1) * pageSize + 1 : 0;
  const to = Math.min(current * pageSize, data.length);

  return (
    <>
      <div className={`tbl-wrap ${flat ? 'flat' : ''}`}>
        {data.length === 0 ? (
          <EmptyState title={emptyTitle} description={emptyMessage} />
        ) : (
          <table className="tbl">
            <thead>
              <tr>
                {columns.map((c, i) => (
                  <th key={i} className={c.className}>
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={rowKey(r)}
                  className={`${rowClassName ? rowClassName(r) : ''} ${onRowClick ? 'click' : ''}`.trim() || undefined}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                >
                  {columns.map((c, i) => (
                    <td key={i} className={c.className}>
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {data.length > pageSize && (
        <div className="pager">
          <span>
            Menampilkan {from}–{to} dari {data.length} data
          </span>
          <div className="pager-btns">
            <IconButton icon="chevron-left" label="Halaman sebelumnya" disabled={current <= 1} onClick={() => setPage(current - 1)} />
            <span className="pg-num">
              {current} / {pages}
            </span>
            <IconButton icon="chevron-right" label="Halaman berikutnya" disabled={current >= pages} onClick={() => setPage(current + 1)} />
          </div>
        </div>
      )}
      {data.length > 0 && data.length <= pageSize && (
        <div className="pager">
          <span>Menampilkan {data.length} data</span>
        </div>
      )}
    </>
  );
}
