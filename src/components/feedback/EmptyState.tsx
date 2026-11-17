import React from 'react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
  action,
}) => {
  return (
    <div className="text-center py-5 px-3 bg-light rounded-3 border">
      <h5 className="text-secondary mb-2">{title}</h5>
      <p className="text-muted mb-3">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
