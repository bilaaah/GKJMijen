import React from 'react';
import { Icon } from '../common/Icon';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia untuk ditampilkan saat ini.',
  icon = 'search',
  action,
}) => (
  <div className="empty">
    <div className="ic-circle">
      <Icon name={icon} />
    </div>
    <h4>{title}</h4>
    <p>{description}</p>
    {action && <div style={{ marginTop: 14 }}>{action}</div>}
  </div>
);
