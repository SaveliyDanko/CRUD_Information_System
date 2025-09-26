import { useState } from 'react';
import { Button } from '../ui/Button';
import formStyles from '../ui/Form.module.css';

interface ActionByIdFormProps {
  onClose: () => void;
  onSubmit: (id: string) => void;
  actionName: string;
}

export const ActionByIdForm = ({ onClose, onSubmit, actionName }: ActionByIdFormProps) => {
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      onSubmit(id);
    } else {
      alert('Please input an ID');
    }
  };

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Input ID:</label>
        <input
          className={formStyles.formInput}
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder={`Enter the ID to ${actionName.toLowerCase()}`}
          autoFocus
        />
      </div>
      <div className={formStyles.formActions}>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant={actionName === 'Delete' ? 'danger' : 'primary'}>
          {actionName}
        </Button>
      </div>
    </form>
  );
};