import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.css';

export const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.mainContent}>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className={styles.page}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};