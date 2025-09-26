import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onFilter: () => void;
  onRead: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export const ContextMenu = ({ x, y, onClose, onFilter, onRead, onUpdate, onDelete }: ContextMenuProps) => {
  return (
    <div className={styles.menu} style={{ top: y, left: x }}>
      <button onClick={onFilter} className={styles.menuItem}>Filter</button>
      <button onClick={onRead} className={styles.menuItem}>Read</button>
      <button onClick={onUpdate} className={styles.menuItem}>Update</button>
      <button onClick={onDelete} className={styles.menuItem}>Delete</button>
    </div>
  );
};