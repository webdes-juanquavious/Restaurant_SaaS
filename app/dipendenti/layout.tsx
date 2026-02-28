'use client';

import styles from '../admin/admin.module.css';

export default function DipendentiLayout({
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
