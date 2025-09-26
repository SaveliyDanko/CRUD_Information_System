import { useState, useEffect } from 'react';
import { Table, ColumnDef } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PersonDTO, PersonFullDTO } from '../types';
import { PersonForm } from '../components/features/PersonForm';
import { DeleteConfirmation } from '../components/features/DeleteConfirmation';
import { ActionByIdForm } from '../components/features/ActionByIdForm';
import { FilterForm } from '../components/features/FilterForm';
import { PersonDetails } from '../components/features/PersonDetails';
import { fetchEntities, deleteEntity, fetchEntityById } from '../api/apiClient';
import styles from './LabWorkPage.module.css';

const personColumns: ColumnDef<PersonDTO>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'weight', header: 'Weight' },
    { accessorKey: 'nationality', header: 'Nationality' },
    { 
      accessorKey: 'locationName', 
      header: 'Location',
      sortFn: (a, b) => (a.locationName || '').localeCompare(b.locationName || ''),
    },
    { accessorKey: 'eyeColor', header: 'Eye Color' },
    { accessorKey: 'hairColor', header: 'Hair Color' },
];

type ModalType = 'filter' | 'create' | 'read' | 'update' | 'delete' | 'readById' | 'updateById' | 'deleteById' | null;

export const PersonPage = () => {
    const [originalData, setOriginalData] = useState<PersonDTO[]>([]);
    const [filteredData, setFilteredData] = useState<PersonDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedRow, setSelectedRow] = useState<PersonDTO | null>(null);
    const [detailedItem, setDetailedItem] = useState<PersonFullDTO | null>(null);

    const fetchData = async () => {
        setIsLoading(true); setError(null);
        try {
            const persons = await fetchEntities<PersonDTO>('/persons');
            setOriginalData(persons);
            setFilteredData(persons);
        }
        catch (err) {
            setError('Failed to fetch Persons.');
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const closeModal = () => { setActiveModal(null); setSelectedRow(null); };
    const handleSuccess = () => { closeModal(); fetchData(); };

        const openReadModal = async (id: number) => {
        setActiveModal('read');
        setDetailedItem(null);
        try {
            const fullData = await fetchEntityById<PersonFullDTO>('/persons', id, true);
            setDetailedItem(fullData);
        } catch (error) {
            alert(`Failed to fetch full details for person #${id}.`);
            closeModal();
        }
    };
    
    const handleAction = (type: 'filter' | 'read' | 'update' | 'delete', row: PersonDTO) => {
        if (type === 'read') {
            openReadModal(row.id);
        } else {
            setSelectedRow(row);
            setActiveModal(type);
        }
    };

    const handleTopButtonClick = (type: 'filter' | 'create' | 'read' | 'update' | 'delete') => {
        switch (type) {
            case 'read': setActiveModal('readById'); break;
            case 'update': setActiveModal('updateById'); break;
            case 'delete': setActiveModal('deleteById'); break;
            default: setActiveModal(type); break;
        }
    };
    
    const handleIdSubmit = async (id: string, nextModal: 'read' | 'update' | 'delete') => {
        const numericId = parseInt(id, 10);
        if (nextModal === 'read') {
            openReadModal(numericId);
        } else {
            try {
                const itemFound = await fetchEntityById<PersonDTO>('/persons', numericId);
                setSelectedRow(itemFound);
                setActiveModal(nextModal);
            } catch (error) {
                alert(`Person with ID ${id} not found.`);
            }
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;

        try {
            await deleteEntity('/persons', selectedRow.id);
            handleSuccess();
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) { alert('Deletion failed: This item is referenced by other entities.'); } 
            else if (status === 404) { alert('Deletion failed: Item not found.'); }
            else { alert('An error occurred during deletion.'); }
        }
    };

    const handleFilterSubmit = (filterBy: string, filterValue: string) => {
        const key = filterBy as keyof PersonDTO; 
        
        const result = originalData.filter(item => {
            const itemValue = item[key];
            return String(itemValue).toLowerCase() === filterValue.toLowerCase();
        });

        if (result.length === 0) {
            alert(`No items found with ${filterBy} = "${filterValue}"`);
        }

        setFilteredData(result);
    };

    const resetFilter = () => {
        setFilteredData(originalData);
    };

    if (isLoading) return <p className={styles.centered}>Loading Persons...</p>;
    if (error) return <p className={`${styles.centered} ${styles.error}`}>{error}</p>;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблица Person</h1>
            <div className={styles.actions}>
                <Button onClick={() => handleTopButtonClick('filter')}>Filter</Button>
                {originalData.length !== filteredData.length && (<Button onClick={resetFilter} variant="danger">Reset Filter</Button>)}
                <Button onClick={() => handleTopButtonClick('create')}>Create</Button>
                <Button onClick={() => handleTopButtonClick('read')}>Read</Button>
                <Button onClick={() => handleTopButtonClick('update')}>Update</Button>
                <Button onClick={() => handleTopButtonClick('delete')} variant="danger">Delete</Button>
            </div>

            <Table columns={personColumns} data={filteredData} onAction={handleAction} />

            <Modal isOpen={activeModal === 'filter'} onClose={closeModal} title="Filter"><FilterForm onClose={closeModal} columns={personColumns} onSubmit={handleFilterSubmit} /></Modal>
            <Modal isOpen={activeModal === 'create'} onClose={closeModal} title="Create Person"><PersonForm onSuccess={handleSuccess} /></Modal>
            <Modal isOpen={activeModal === 'read'} onClose={closeModal} title={`Details for Person #${detailedItem?.id || ''}`}>{detailedItem ? <PersonDetails itemData={detailedItem} /> : <p>Loading details...</p>}</Modal>
            <Modal isOpen={activeModal === 'update'} onClose={closeModal} title={`Update Person #${selectedRow?.id}`}><PersonForm onSuccess={handleSuccess} initialData={selectedRow} /></Modal>
            <Modal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Confirmation"><DeleteConfirmation onClose={closeModal} onConfirm={handleDeleteConfirm} itemName={selectedRow?.name} /></Modal>
            
            <Modal isOpen={activeModal === 'readById'} onClose={closeModal} title="Read by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'read')} actionName="Read" /></Modal>
            <Modal isOpen={activeModal === 'updateById'} onClose={closeModal} title="Update by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'update')} actionName="Update" /></Modal>
            <Modal isOpen={activeModal === 'deleteById'} onClose={closeModal} title="Delete by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'delete')} actionName="Delete" /></Modal>
        </div>
    );
};