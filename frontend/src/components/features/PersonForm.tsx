import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '../ui/Button';
import { PersonDTO, LocationDTO, Color, Country } from '../../types';
import { fetchEntities, createEntity, updateEntity } from '../../api/apiClient';
import formStyles from '../ui/Form.module.css';

const customSelectStyles = {
    control: (base: any) => ({ ...base, backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)' }),
    input: (base: any) => ({ ...base, color: 'var(--color-text)' }),
    singleValue: (base: any) => ({ ...base, color: 'var(--color-text)' }),
    menu: (base: any) => ({ ...base, backgroundColor: 'var(--color-surface)' }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--color-primary)' : 'var(--color-surface)',
      color: state.isFocused ? 'var(--color-bg)' : 'var(--color-text)',
    }),
};

type SelectOption = { value: number; label: string };

interface PersonFormProps {
  onSuccess: () => void;
  initialData?: PersonDTO | null;
}

export const PersonForm = ({ onSuccess, initialData }: PersonFormProps) => {
  const isUpdateMode = !!initialData;
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number | string>('');
  const [eyeColor, setEyeColor] = useState<Color>('GREEN');
  const [hairColor, setHairColor] = useState<Color>('BROWN');
  const [nationality, setNationality] = useState<Country>('INDIA');
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>(null);

  useEffect(() => {
    if (initialData) {
        setName(initialData.name);
        setWeight(initialData.weight);
        setEyeColor(initialData.eyeColor);
        setHairColor(initialData.hairColor);
        setNationality(initialData.nationality);
    }

    const fetchLocations = async () => {
      try {
        const locations = await fetchEntities<LocationDTO>('/locations');
        const locOpts = locations.map(l => ({ value: l.id, label: l.name }));
        setLocationOptions(locOpts);

        if (initialData?.locationId) {
          setSelectedLocation(locOpts.find(l => l.value === initialData.locationId) || null);
        }
      } catch (error) {
        alert("Failed to load locations for the dropdown.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLocations();
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      weight: Number(weight),
      eyeColor,
      hairColor,
      nationality,
      locationId: selectedLocation?.value || null,
    };

    try {
      if (isUpdateMode) {
        await updateEntity('/persons', initialData.id, payload);
      } else {
        await createEntity('/persons', payload);
      }
      onSuccess();
    } catch (error: any) {
      alert(`Failed to save Person: ${error.response?.data?.message || error.message}`);
    }
  };

  if (isLoading) return <p>Loading dependent data...</p>;

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Name:</label>
        <input className={formStyles.formInput} type="text" value={name} onChange={e => setName(e.target.value)} required />
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Weight:</label>
        <input className={formStyles.formInput} type="number" step="any" min="1" value={weight} onChange={e => setWeight(e.target.value)} required />
      </div>
      
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Eye Color:</label>
        <select className={formStyles.formSelect} value={eyeColor} onChange={e => setEyeColor(e.target.value as Color)}>
            <option value="GREEN">GREEN</option><option value="RED">RED</option><option value="WHITE">WHITE</option><option value="BROWN">BROWN</option>
        </select>
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Hair Color:</label>
        <select className={formStyles.formSelect} value={hairColor} onChange={e => setHairColor(e.target.value as Color)} required>
            <option value="GREEN">GREEN</option><option value="RED">RED</option><option value="WHITE">WHITE</option><option value="BROWN">BROWN</option>
        </select>
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Nationality:</label>
        <select className={formStyles.formSelect} value={nationality} onChange={e => setNationality(e.target.value as Country)}>
            <option value="UNITED_KINGDOM">UNITED_KINGDOM</option><option value="GERMANY">GERMANY</option><option value="INDIA">INDIA</option>
        </select>
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel}>Location:</label>
        <Select options={locationOptions} value={selectedLocation} onChange={setSelectedLocation} styles={customSelectStyles} isClearable placeholder="Select a location..." />
      </div>

      <div className={formStyles.formActions}>
        <Button type="button" onClick={onSuccess}>Cancel</Button>
        <Button type="submit">{isUpdateMode ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};