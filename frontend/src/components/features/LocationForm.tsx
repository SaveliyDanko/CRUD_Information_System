import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { LocationDTO } from '../../types';
import { createEntity, updateEntity } from '../../api/apiClient';
import formStyles from '../ui/Form.module.css';

interface LocationFormProps {
  onSuccess: () => void;
  initialData?: LocationDTO | null;
}

export const LocationForm = ({ onSuccess, initialData }: LocationFormProps) => {
  const isUpdateMode = !!initialData;
  const [name, setName] = useState('');
  const [x, setX] = useState<number | string>('');
  const [y, setY] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setX(initialData.x);
      setY(initialData.y);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      x: Number(x),
      y: Number(y),
    };

    try {
      if (isUpdateMode && initialData) {
        await updateEntity('/locations', initialData.id, payload);
      } else {
        await createEntity('/locations', payload);
      }
      onSuccess();
    } catch (error: any) {
      alert(`Failed to save Location: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Location Name:</label>
        <input
          className={formStyles.formInput}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Coordinate X:</label>
        <input
          className={formStyles.formInput}
          type="number"
          step="any"
          value={x}
          onChange={(e) => setX(e.target.value)}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Coordinate Y:</label>
        <input
          className={formStyles.formInput}
          type="number"
          value={y}
          onChange={(e) => setY(e.target.value)}
          required
        />
      </div>
      <div className={formStyles.formActions}>
        <Button type="button" onClick={onSuccess}>Cancel</Button>
        <Button type="submit">{isUpdateMode ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};