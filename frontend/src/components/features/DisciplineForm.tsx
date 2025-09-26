import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { DisciplineDTO } from '../../types';
import { createEntity, updateEntity } from '../../api/apiClient';
import formStyles from '../ui/Form.module.css';

interface DisciplineFormProps {
  onSuccess: () => void;
  initialData?: DisciplineDTO | null;
}

export const DisciplineForm = ({ onSuccess, initialData }: DisciplineFormProps) => {
  const isUpdateMode = !!initialData;
  const [name, setName] = useState('');
  const [practiceHours, setPracticeHours] = useState<number | string>('');
  const [labsCount, setLabsCount] = useState<number | string>('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPracticeHours(initialData.practiceHours);
      setLabsCount(initialData.labsCount);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      practiceHours: Number(practiceHours),
      labsCount: Number(labsCount),
    };

    try {
      if (isUpdateMode) {
        await updateEntity('/disciplines', initialData.id, payload);
      } else {
        await createEntity('/disciplines', payload);
      }
      onSuccess();
    } catch (error: any) {
      alert(`Failed to save Discipline: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Discipline Name:</label>
        <input
          className={formStyles.formInput}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Practice Hours:</label>
        <input
          className={formStyles.formInput}
          type="number"
          min="0"
          value={practiceHours}
          onChange={e => setPracticeHours(e.target.value)}
          required
        />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Labs Count:</label>
        <input
          className={formStyles.formInput}
          type="number"
          min="0"
          value={labsCount}
          onChange={e => setLabsCount(e.target.value)}
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