// components/admin/AdminTable.tsx
"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { IoPencil, IoTrash, IoEye } from "react-icons/io5";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
  actions?: boolean;
}

export function AdminTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
  actions = true,
}: AdminTableProps<T>): ReactNode {
  if (data.length === 0) {
    return (
      <Card variant="bordered" className="py-12 text-center">
        <p className="font-body text-sm text-slate-light">Aucune donnée disponible</p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full min-w-[640px]">
        <thead className="border-b border-border bg-cream-dark">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key as string}
                className="px-4 py-3 text-left font-sans text-xs font-semibold uppercase tracking-wider text-slate-light"
              >
                {col.header}
              </th>
            ))}
            {actions ? (
              <th className="px-4 py-3 text-right font-sans text-xs font-semibold uppercase tracking-wider text-slate-light">
                Actions
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-cream/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key as string} className="px-4 py-3 font-body text-sm text-slate">
                  {col.render ? col.render(item) : (item[col.key as keyof T] as ReactNode)}
                </td>
              ))}
              {actions ? (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onView ? (
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className="rounded-lg p-1.5 text-slate-light transition-colors hover:bg-primary/10 hover:text-primary"
                        aria-label="Voir"
                      >
                        <IoEye size={18} />
                      </button>
                    ) : null}
                    {onEdit ? (
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-1.5 text-slate-light transition-colors hover:bg-gold/15 hover:text-gold"
                        aria-label="Modifier"
                      >
                        <IoPencil size={18} />
                      </button>
                    ) : null}
                    {onDelete ? (
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg p-1.5 text-slate-light transition-colors hover:bg-error/15 hover:text-error"
                        aria-label="Supprimer"
                      >
                        <IoTrash size={18} />
                      </button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}