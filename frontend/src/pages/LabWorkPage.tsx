import { useState, useEffect } from 'react';
import { Table, ColumnDef } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { LabWorkFullDTO, LabWorkDTO, Difficulty } from '../types';
import { LabWorkForm } from '../components/features/LabWorkForm';
import { DeleteConfirmation } from '../components/features/DeleteConfirmation';
import { ActionByIdForm } from '../components/features/ActionByIdForm';
import { FilterForm } from '../components/features/FilterForm';
import { LabWorkDetails } from '../components/features/LabWorkDetails';
import { fetchEntities, deleteEntity, fetchEntityById } from '../api/apiClient';
import styles from './LabWorkPage.module.css';

const difficultyOrder: Record<Difficulty, number> = {
    VERY_EASY: 0,
    EASY: 1,
    INSANE: 2,
    HOPELESS: 3,
};

const labWorkColumns: ColumnDef<LabWorkDTO>[] = [
    { accessorKey: 'id', header: 'ID' },
    { 
      accessorKey: 'name',
      header: 'Name' },
    { 
      accessorKey: 'coordinatesId', 
      header: 'Coordinates ID' 
    },
    { 
      accessorKey: 'description', 
      header: 'Description' 
    },
    { 
      accessorKey: 'disciplineName', 
      header: 'Discipline',
      sortFn: (a, b) => (a.disciplineName || '').localeCompare(b.disciplineName || ''),
    },
    { 
      accessorKey: 'authorName', 
      header: 'Author',
      sortFn: (a, b) => (a.authorName || '').localeCompare(b.authorName || ''),
    },
    { 
      accessorKey: 'difficulty', 
      header: 'Difficulty',
      sortFn: (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
    },
    { accessorKey: 'minimalPoint', header: 'Min. Point' },
    { 
      accessorKey: 'creationDate', 
      header: 'Time', 
      cell: ({ value }: { value: string }) => new Date(value).toLocaleDateString() 
    },
];


type ModalType = 'filter' | 'create' | 'read' | 'update' | 'delete' | 'readById' | 'updateById' | 'deleteById' | null;

export const LabWorkPage = () => {
    const [originalData, setOriginalData] = useState<LabWorkDTO[]>([]);
    const [filteredData, setFilteredData] = useState<LabWorkDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedRow, setSelectedRow] = useState<LabWorkDTO | null>(null);
    const [detailedItem, setDetailedItem] = useState<LabWorkFullDTO | null>(null);

    const fetchData = async () => {
        setIsLoading(true); setError(null);
        try {
            const labWorks = await fetchEntities<LabWorkDTO>('/labworks');
            setOriginalData(labWorks);
            setFilteredData(labWorks);
        } catch (err) {
            setError('Failed to fetch LabWorks.');
        } finally {
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
            const fullData = await fetchEntityById<LabWorkFullDTO>('/labworks', id, true);
            setDetailedItem(fullData);
        } catch (error) {
            alert(`Failed to fetch full details for item #${id}.`);
            closeModal();
        }
    };

    const handleAction = (type: 'filter' | 'read' | 'update' | 'delete', row: LabWorkDTO) => {
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
                const itemFound = await fetchEntityById<LabWorkDTO>('/labworks', numericId);
                setSelectedRow(itemFound);
                setActiveModal(nextModal);
            } catch (error) {
                alert(`LabWork with ID ${id} not found.`);
            }
        }
    };
    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await deleteEntity('/labworks', selectedRow.id);
            handleSuccess();
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) { alert('Deletion failed: This item is referenced by other entities.'); } 
            else if (status === 404) { alert('Deletion failed: Item not found.'); }
            else { alert('An error occurred during deletion.'); }
        }
    };

    const handleFilterSubmit = (filterBy: string, filterValue: string) => {
        const key = filterBy as keyof LabWorkDTO; 
        
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

    if (isLoading) return <p className={styles.centered}>Loading LabWorks...</p>;
    if (error) return <p className={`${styles.centered} ${styles.error}`}>{error}</p>;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблица LabWork</h1>
            <div className={styles.actions}>
                <Button onClick={() => handleTopButtonClick('filter')}>Filter</Button>
                {originalData.length !== filteredData.length && (<Button onClick={resetFilter} variant="danger">Reset Filter</Button>)}
                <Button onClick={() => handleTopButtonClick('create')}>Create</Button>
                <Button onClick={() => handleTopButtonClick('read')}>Read</Button>
                <Button onClick={() => handleTopButtonClick('update')}>Update</Button>
                <Button onClick={() => handleTopButtonClick('delete')} variant="danger">Delete</Button>
            </div>
            
            <Table columns={labWorkColumns} data={filteredData} onAction={handleAction} />

            <Modal isOpen={activeModal === 'filter'} onClose={closeModal} title="Filter"><FilterForm onClose={closeModal} columns={labWorkColumns} onSubmit={handleFilterSubmit} /></Modal>
            <Modal isOpen={activeModal === 'create'} onClose={closeModal} title="Create LabWork"><LabWorkForm onSuccess={handleSuccess} /></Modal>
            <Modal isOpen={activeModal === 'read'} onClose={closeModal} title={`Details for LabWork #${detailedItem?.id || ''}`}>{detailedItem ? <LabWorkDetails labWork={detailedItem} /> : <p>Loading details...</p>}</Modal>
            <Modal isOpen={activeModal === 'update'} onClose={closeModal} title={`Update LabWork #${selectedRow?.id}`}><LabWorkForm onSuccess={handleSuccess} initialData={selectedRow} /></Modal>
            <Modal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Confirmation"><DeleteConfirmation onClose={closeModal} onConfirm={handleDeleteConfirm} itemName={selectedRow?.name} /></Modal>
            
            <Modal isOpen={activeModal === 'readById'} onClose={closeModal} title="Read by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'read')} actionName="Read" /></Modal>
            <Modal isOpen={activeModal === 'updateById'} onClose={closeModal} title="Update by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'update')} actionName="Update" /></Modal>
            <Modal isOpen={activeModal === 'deleteById'} onClose={closeModal} title="Delete by ID"><ActionByIdForm onClose={closeModal} onSubmit={(id) => handleIdSubmit(id, 'delete')} actionName="Delete" /></Modal>
        </div>
    );
};