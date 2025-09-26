import React, { useState, useMemo } from 'react';
import { Button } from './Button';
import { ContextMenu } from './ContextMenu';
import styles from './Table.module.css';

export interface ColumnDef<T> {
  accessorKey: keyof T;
  header: string;
  cell?: (props: { value: any }) => React.ReactNode;
  sortFn?: (a: T, b: T) => number;
}

interface TableProps<T extends { id: number | string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onAction?: (actionType: 'filter' | 'read' | 'update' | 'delete', row: T) => void;
}

type SortDirection = 'asc' | 'desc';

interface ContextMenuState<T> {
  x: number;
  y: number;
  selectedRow: T;
}

export const Table = <T extends { id: number | string }>({ data, columns, onAction }: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [contextMenu, setContextMenu] = useState<ContextMenuState<T> | null>(null);
  const itemsPerPage = 10;

  const handleSort = (key: keyof T) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }

    setCurrentPage(1); 
  };

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    const columnDef = columns.find(c => c.accessorKey === sortColumn);

    return [...data].sort((a, b) => {
      let result = 0;
      
      if (columnDef?.sortFn) {
        result = columnDef.sortFn(a, b);
      } else {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (aValue < bValue) result = -1;
        if (aValue > bValue) result = 1;
      }
      
      return result * (sortDirection === 'asc' ? 1 : -1);
    });
  }, [data, sortColumn, sortDirection, columns]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleContextMenu = (e: React.MouseEvent, row: T) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, selectedRow: row });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleMenuAction = (actionType: 'filter' | 'read' | 'update' | 'delete') => {
    if (onAction && contextMenu?.selectedRow) {
      onAction(actionType, contextMenu.selectedRow);
    }
    closeContextMenu();
  };

  return (
    <div className={styles.tableContainer} onClick={closeContextMenu}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessorKey)} onClick={() => handleSort(col.accessorKey)}>
                {col.header}
                {sortColumn === col.accessorKey && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id} onContextMenu={onAction ? (e) => handleContextMenu(e, row) : undefined}>
              {columns.map((col) => (
                <td key={String(col.accessorKey)}>
                  {col.cell
                    ? col.cell({ value: row[col.accessorKey] })
                    : String(row[col.accessorKey] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className={styles.pagination}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </div>

      {contextMenu && onAction && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={closeContextMenu}
          onFilter={() => handleMenuAction('filter')}
          onRead={() => handleMenuAction('read')}
          onUpdate={() => handleMenuAction('update')}
          onDelete={() => handleMenuAction('delete')}
        />
      )}
    </div>
  );
};