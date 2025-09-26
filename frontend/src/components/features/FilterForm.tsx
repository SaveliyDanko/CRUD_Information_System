import { useState } from 'react';
import { Button } from '../ui/Button';
import formStyles from '../ui/Form.module.css';
import { ColumnDef } from '../ui/Table';

interface FilterFormProps {
  onClose: () => void;
  columns: ColumnDef<any>[];
  onSubmit: (filterBy: string, filterValue: string) => void; 
}

export const FilterForm = ({ onClose, columns, onSubmit }: FilterFormProps) => {
  const [filterBy, setFilterBy] = useState<string>('id');
  const [filterValue, setFilterValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterValue.trim()) {
      alert('Please enter a value to filter by.');
      return;
    }
    onSubmit(filterBy, filterValue);
    onClose();
  };

  const filterableColumns = columns.filter(col => 
    !col.cell && !col.sortFn
  );
  
  useState(() => {
      if(filterableColumns.length > 0) {
          setFilterBy(String(filterableColumns[0].accessorKey))
      }
  })

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Choose attribute:</label>
        <select 
          className={formStyles.formSelect} 
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
        >
          {filterableColumns.map(col => (
            <option key={String(col.accessorKey)} value={String(col.accessorKey)}>
              {col.header}
            </option>
          ))}
        </select>
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Input filter:</label>
        <input 
          className={formStyles.formInput} 
          type="text"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      </div>
      <div className={formStyles.formActions}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Filter</Button>
      </div>
    </form>
  );
};