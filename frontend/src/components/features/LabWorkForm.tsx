import { useState, useEffect } from 'react';
import Select from 'react-select';
import { Button } from '../ui/Button';
import { LabWorkDTO, PersonDTO, DisciplineDTO, CoordinatesDTO, Difficulty } from '../../types';
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

interface LabWorkFormProps {
  onSuccess: () => void;
  initialData?: LabWorkDTO | null;
}

export const LabWorkForm = ({ onSuccess, initialData }: LabWorkFormProps) => {
    const isUpdateMode = !!initialData;
    const [isLoading, setIsLoading] = useState(true);
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [minimalPoint, setMinimalPoint] = useState<number | string>(initialData?.minimalPoint || 1); 
    const [difficulty, setDifficulty] = useState<Difficulty>(initialData?.difficulty || 'VERY_EASY');
    const [personOptions, setPersonOptions] = useState<SelectOption[]>([]);
    const [disciplineOptions, setDisciplineOptions] = useState<SelectOption[]>([]);
    const [coordinatesOptions, setCoordinatesOptions] = useState<SelectOption[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState<SelectOption | null>(null);
    const [selectedDiscipline, setSelectedDiscipline] = useState<SelectOption | null>(null);
    const [selectedCoordinates, setSelectedCoordinates] = useState<SelectOption | null>(null);
    const difficultyOptions: Difficulty[] = ['VERY_EASY', 'EASY', 'INSANE', 'HOPELESS'];

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [persons, disciplines, coordinates] = await Promise.all([
                    fetchEntities<PersonDTO>('/persons'),
                    fetchEntities<DisciplineDTO>('/disciplines'),
                    fetchEntities<CoordinatesDTO>('/coordinates'),
                ]);

                const personOpts = persons.map(p => ({ value: p.id, label: p.name }));
                setPersonOptions(personOpts);
                if (initialData?.authorId) {
                    setSelectedAuthor(personOpts.find(p => p.value === initialData.authorId) || null);
                }

                const disciplineOpts = disciplines.map(d => ({ value: d.id, label: d.name }));
                setDisciplineOptions(disciplineOpts);
                 if (initialData?.disciplineId) {
                    setSelectedDiscipline(disciplineOpts.find(d => d.value === initialData.disciplineId) || null);
                }

                const coordinatesOpts = coordinates.map(c => ({ value: c.id, label: `ID:${c.id} (x:${c.x}, y:${c.y})` }));
                setCoordinatesOptions(coordinatesOpts);
                 if (initialData?.coordinatesId) {
                    setSelectedCoordinates(coordinatesOpts.find(c => c.value === initialData.coordinatesId) || null);
                }
            } catch (error) {
                alert("Failed to load related data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDropdownData();
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert('Name cannot be empty.');
            return;
        }
        if (Number(minimalPoint) <= 0) {
            alert('Minimal Point must be greater than 0.');
            return;
        }
        if (!selectedCoordinates) {
            alert('Please select coordinates.');
            return;
        }

        const payload = {
            name, 
            description, 
            minimalPoint: Number(minimalPoint), 
            difficulty,
            coordinatesId: selectedCoordinates.value,
            authorId: selectedAuthor?.value,
            disciplineId: selectedDiscipline?.value,
        };

        try {
            if (isUpdateMode && initialData) {
                await updateEntity('/labworks', initialData.id, payload);
            } else {
                await createEntity('/labworks', payload);
            }
            onSuccess();
        } catch (error: any) {
            const errorData = error.response?.data;
            let errorMessage = 'Failed to save LabWork.';
            if (errorData && errorData.errors) {
                errorMessage += '\n' + errorData.errors.map((e: any) => e.defaultMessage).join('\n');
            }
            alert(errorMessage);
        }
    };
    
    if (isLoading) return <p>Loading form data...</p>;

    return (
        <form className={formStyles.form} onSubmit={handleSubmit}>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Name:</label>
                <input className={formStyles.formInput} type="text" value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Description:</label>
                <input className={formStyles.formInput} type="text" value={description || ''} onChange={e => setDescription(e.target.value)} />
            </div>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Minimal Point:</label>
                <input className={formStyles.formInput} type="number" min="1" value={minimalPoint} onChange={e => setMinimalPoint(e.target.value)} required />
            </div>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Difficulty:</label>
                <select className={formStyles.formSelect} value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
                    {difficultyOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <hr className={formStyles.hr} />

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Coordinates:</label>
                <Select options={coordinatesOptions} value={selectedCoordinates} onChange={setSelectedCoordinates} styles={customSelectStyles} isClearable required />
            </div>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Discipline (optional):</label>
                <Select options={disciplineOptions} value={selectedDiscipline} onChange={setSelectedDiscipline} styles={customSelectStyles} isClearable />
            </div>

            <div className={formStyles.formGroup}>
                <label className={formStyles.formLabel}>Author (optional):</label>
                <Select options={personOptions} value={selectedAuthor} onChange={setSelectedAuthor} styles={customSelectStyles} isClearable />
            </div>
            
            <div className={formStyles.formActions}>
                <Button type="button" onClick={onSuccess}>Cancel</Button>
                <Button type="submit">{isUpdateMode ? 'Update' : 'Create'}</Button>
            </div>
        </form>
    );
};