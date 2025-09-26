import { NavLink } from 'react-router-dom';
import { BurgerIcon } from '../ui/icons/BurgerIcon';
import styles from './Header.module.css';

const navLinks = [
  { to: '/labwork', label: 'LabWork' },
  { to: '/coordinates', label: 'Coordinates' },
  { to: '/discipline', label: 'Discipline' },
  { to: '/person', label: 'Person' },
  { to: '/location', label: 'Location' },
];

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button onClick={onMenuClick} className={styles.menuButton}>
          <BurgerIcon />
        </button>
        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={styles.right}>
        <div className={styles.user}>
          <div className={styles.avatar}>SD</div>
          <span>SavaDanko</span>
        </div>
      </div>
    </header>
  );
};