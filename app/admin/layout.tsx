'use client';

import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <div className={styles.adminContent}>{children}</div>
    </div>
  );
}
