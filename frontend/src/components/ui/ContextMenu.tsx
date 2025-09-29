import { useEffect, useRef } from "react";
import styles from "./ContextMenu.module.css";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);

    const onAnyScroll = () => onClose();
    window.addEventListener("resize", onAnyScroll);
    document.addEventListener("scroll", onAnyScroll, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("resize", onAnyScroll);
      document.removeEventListener("scroll", onAnyScroll, true);
    };
  }, [onClose]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={menuRef}
      className={styles.menu}
      style={{ top: y, left: x, position: "absolute" }}
      onClick={stop}
    >
      <button onClick={onFilter} className={styles.menuItem}>Filter</button>
      <button onClick={onRead} className={styles.menuItem}>Read</button>
      <button onClick={onUpdate} className={styles.menuItem}>Update</button>
      <button onClick={onDelete} className={styles.menuItem}>Delete</button>
    </div>
  );
};
