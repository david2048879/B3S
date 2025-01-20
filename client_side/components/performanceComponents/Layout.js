import Sidebar from './Sidebar';
import styles from './Layout.module.css'; // Use CSS Modules for scoped styles

export default function PerformanceLayout({ children }) {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
