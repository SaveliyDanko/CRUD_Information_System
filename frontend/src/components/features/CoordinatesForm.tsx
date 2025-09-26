import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { CoordinatesDTO } from '../../types';
import { createEntity, updateEntity } from '../../api/apiClient';
import formStyles from '../ui/Form.module.css';

interface CoordinatesFormProps {
  onSuccess: () => void;
  initialData?: CoordinatesDTO | null;
}

export const CoordinatesForm = ({ onSuccess, initialData }: CoordinatesFormProps) => {
  const isUpdateMode = !!initialData;
  const [x, setX] = useState<number | string>('');
  const [y, setY] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setX(initialData.x);
      setY(initialData.y);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { x: Number(x), y: Number(y) };
    try {
      if (isUpdateMode) {
        await updateEntity('/coordinates', initialData.id, payload);
      } else {
        await createEntity('/coordinates', payload);
      }
      onSuccess();
    } catch (error: any) {
      alert(`Failed to save Coordinates: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Coordinate X:</label>
        <input className={formStyles.formInput} type="number" step="any" value={x} onChange={e => setX(e.target.value)} required />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Coordinate Y:</label>
        <input className={formStyles.formInput} type="number" step="any" value={y} onChange={e => setY(e.target.value)} required />
      </div>
      <div className={formStyles.formActions}>
        <Button type="button" onClick={onSuccess}>Cancel</Button>
        <Button type="submit">{isUpdateMode ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};