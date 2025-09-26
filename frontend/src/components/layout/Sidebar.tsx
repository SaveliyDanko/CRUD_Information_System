import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <h2 className={styles.title}>Меню</h2>
        <nav className={styles.nav}>
          <NavLink to="/functions" className={styles.link} onClick={onClose}>
            Functions
          </NavLink>
        </nav>
      </aside>
      {isOpen && <div className={styles.backdrop} onClick={onClose}></div>}
    </>
  );
};