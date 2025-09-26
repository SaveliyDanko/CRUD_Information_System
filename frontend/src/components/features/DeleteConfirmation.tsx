import { Button } from '../ui/Button';
import formStyles from '../ui/Form.module.css';

interface DeleteConfirmationProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName?: string | number | null;
}

export const DeleteConfirmation = ({ onClose, onConfirm, itemName }: DeleteConfirmationProps) => {
  return (
    <div>
      <p>Are you sure you want to delete "{itemName || 'this item'}"?</p>
      <div className={formStyles.formActions}>
        <Button type="button" onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="danger">Delete</Button>
      </div>
    </div>
  );
};