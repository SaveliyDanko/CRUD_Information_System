import { useState, useEffect } from 'react';
import { Table, ColumnDef } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { CoordinatesDTO } from '../types';
import { CoordinatesForm } from '../components/features/CoordinatesForm';
import { DeleteConfirmation } from '../components/features/DeleteConfirmation';
import { ActionByIdForm } from '../components/features/ActionByIdForm';
import { FilterForm } from '../components/features/FilterForm';
import { CoordinatesDetails } from '../components/features/CoordinatesDetails';
import { fetchEntities, deleteEntity, fetchEntityById } from '../api/apiClient';
import styles from './LabWorkPage.module.css';

const columns: ColumnDef<CoordinatesDTO>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'x', header: 'X' },
    { accessorKey: 'y', header: 'Y' },
];

type ModalType =
    | 'filter'
    | 'create'
    | 'read'
    | 'update'
    | 'delete'
    | 'readById'
    | 'updateById'
    | 'deleteById'
    | null;

type ActiveFilter = { by: keyof CoordinatesDTO; value: string } | null;

export const CoordinatesPage = () => {
    const [originalData, setOriginalData] = useState<CoordinatesDTO[]>([]);
    const [filteredData, setFilteredData] = useState<CoordinatesDTO[]>([]);
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedRow, setSelectedRow] = useState<CoordinatesDTO | null>(null);

    const applyFilter = (data: CoordinatesDTO[], f: ActiveFilter) => {
        if (!f) return data;
        return data.filter((it) =>
            String((it as any)[f.by] ?? '').toLowerCase() === f.value.toLowerCase()
        );
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const coordinates = await fetchEntities<CoordinatesDTO>('/coordinates');
            setOriginalData(coordinates); // filtered пересчитается ниже из activeFilter
        } catch (err) {
            setError('Failed to fetch Coordinates.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Пересчёт таблицы при изменении исходных данных или фильтра
    useEffect(() => {
        setFilteredData(applyFilter(originalData, activeFilter));
    }, [originalData, activeFilter]);

    const closeModal = () => {
        setActiveModal(null);
        setSelectedRow(null);
    };

    // После успешных create/update/delete перезагружаем данные — фильтр сохранится
    const handleSuccess = () => {
        closeModal();
        fetchData();
    };

    const handleAction = (type: 'filter' | 'read' | 'update' | 'delete', row: CoordinatesDTO) => {
        setSelectedRow(row);
        setActiveModal(type);
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
        try {
            const itemFound = await fetchEntityById<CoordinatesDTO>('/coordinates', parseInt(id, 10));
            setSelectedRow(itemFound);
            setActiveModal(nextModal);
        } catch (error) {
            alert(`Coordinates with ID ${id} not found.`);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await deleteEntity('/coordinates', selectedRow.id);
            handleSuccess();
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) alert('Deletion failed: This item is referenced by other entities.');
            else if (status === 404) alert('Deletion failed: Item not found.');
            else alert('An error occurred during deletion.');
        }
    };

    // Сохраняем фильтр; таблица пересчитается через useEffect
    const handleFilterSubmit = (filterBy: string, filterValue: string) => {
        const by = filterBy as keyof CoordinatesDTO;
        const preview = applyFilter(originalData, { by, value: filterValue });
        if (preview.length === 0) {
            alert(`No items found with ${filterBy} = "${filterValue}"`);
        }
        setActiveFilter({ by, value: filterValue });
        setActiveModal(null);
    };

    const resetFilter = () => setActiveFilter(null);

    if (isLoading) return <p className={styles.centered}>Loading Coordinates...</p>;
    if (error) return <p className={`${styles.centered} ${styles.error}`}>{error}</p>;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблица Coordinates</h1>
            <div className={styles.actions}>
                <Button onClick={() => handleTopButtonClick('filter')}>Filter</Button>

                {activeFilter && (
                    <Button onClick={resetFilter} variant="danger">
                        Reset Filter ({String(activeFilter.by)} = "{activeFilter.value}")
                    </Button>
                )}

                <Button onClick={() => handleTopButtonClick('create')}>Create</Button>
                <Button onClick={() => handleTopButtonClick('read')}>Read</Button>
                <Button onClick={() => handleTopButtonClick('update')}>Update</Button>
                <Button onClick={() => handleTopButtonClick('delete')} variant="danger">Delete</Button>
            </div>

            <Table columns={columns} data={filteredData} onAction={handleAction} />

            <Modal isOpen={activeModal === 'filter'} onClose={closeModal} title="Filter">
                <FilterForm onClose={closeModal} columns={columns} onSubmit={handleFilterSubmit} />
            </Modal>

            <Modal isOpen={activeModal === 'create'} onClose={closeModal} title="Create Coordinates">
                <CoordinatesForm onSuccess={handleSuccess} />
            </Modal>

            <Modal
                isOpen={activeModal === 'read'}
                onClose={closeModal}
                title={`Details for Coordinates #${selectedRow?.id}`}
            >
                <CoordinatesDetails itemData={selectedRow} />
            </Modal>

            <Modal
                isOpen={activeModal === 'update'}
                onClose={closeModal}
                title={`Update Coordinates #${selectedRow?.id}`}
            >
                <CoordinatesForm onSuccess={handleSuccess} initialData={selectedRow} />
            </Modal>

            <Modal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Confirmation">
                <DeleteConfirmation
                    onClose={closeModal}
                    onConfirm={handleDeleteConfirm}
                    itemName={`Coordinates #${selectedRow?.id}`}
                />
            </Modal>

            <Modal isOpen={activeModal === 'readById'} onClose={closeModal} title="Read by ID">
                <ActionByIdForm
                    onClose={closeModal}
                    onSubmit={(id) => handleIdSubmit(id, 'read')}
                    actionName="Read"
                />
            </Modal>

            <Modal isOpen={activeModal === 'updateById'} onClose={closeModal} title="Update by ID">
                <ActionByIdForm
                    onClose={closeModal}
                    onSubmit={(id) => handleIdSubmit(id, 'update')}
                    actionName="Update"
                />
            </Modal>

            <Modal isOpen={activeModal === 'deleteById'} onClose={closeModal} title="Delete by ID">
                <ActionByIdForm
                    onClose={closeModal}
                    onSubmit={(id) => handleIdSubmit(id, 'delete')}
                    actionName="Delete"
                />
            </Modal>
        </div>
    );
};
