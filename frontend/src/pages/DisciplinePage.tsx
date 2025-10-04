import { useState, useEffect } from 'react';
import { Table, ColumnDef } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { DisciplineDTO } from '../types';
import { DisciplineForm } from '../components/features/DisciplineForm';
import { DeleteConfirmation } from '../components/features/DeleteConfirmation';
import { ActionByIdForm } from '../components/features/ActionByIdForm';
import { FilterForm } from '../components/features/FilterForm';
import { DisciplineDetails } from '../components/features/DisciplineDetails';
import { fetchEntities, deleteEntity, fetchEntityById } from '../api/apiClient';
import styles from './LabWorkPage.module.css';

const columns: ColumnDef<DisciplineDTO>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'practiceHours', header: 'Practice Hours' },
    { accessorKey: 'labsCount', header: 'Labs Count' },
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

type ActiveFilter = { by: keyof DisciplineDTO; value: string } | null;

export const DisciplinePage = () => {
    const [originalData, setOriginalData] = useState<DisciplineDTO[]>([]);
    const [filteredData, setFilteredData] = useState<DisciplineDTO[]>([]);
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [selectedRow, setSelectedRow] = useState<DisciplineDTO | null>(null);

    const applyFilter = (data: DisciplineDTO[], f: ActiveFilter) => {
        if (!f) return data;
        return data.filter((it) =>
            String((it as any)[f.by] ?? '').toLowerCase() === f.value.toLowerCase()
        );
    };

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const disciplines = await fetchEntities<DisciplineDTO>('/disciplines');
            setOriginalData(disciplines); // filteredData пересчитается ниже
        } catch (err) {
            setError('Failed to fetch Disciplines.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Пересчитываем таблицу при изменении исходных данных или фильтра
    useEffect(() => {
        setFilteredData(applyFilter(originalData, activeFilter));
    }, [originalData, activeFilter]);

    const closeModal = () => {
        setActiveModal(null);
        setSelectedRow(null);
    };

    // После create/update/delete — обновляем данные; фильтр сохранится
    const handleSuccess = () => {
        closeModal();
        fetchData();
    };

    const handleAction = (type: 'filter' | 'read' | 'update' | 'delete', row: DisciplineDTO) => {
        setSelectedRow(row);
        setActiveModal(type);
    };

    const handleTopButtonClick = (type: 'filter' | 'create' | 'read' | 'update' | 'delete') => {
        switch (type) {
            case 'read':
                setActiveModal('readById');
                break;
            case 'update':
                setActiveModal('updateById');
                break;
            case 'delete':
                setActiveModal('deleteById');
                break;
            default:
                setActiveModal(type);
                break;
        }
    };

    const handleIdSubmit = async (id: string, nextModal: 'read' | 'update' | 'delete') => {
        try {
            const itemFound = await fetchEntityById<DisciplineDTO>('/disciplines', parseInt(id, 10));
            setSelectedRow(itemFound);
            setActiveModal(nextModal);
        } catch (error) {
            alert(`Discipline with ID ${id} not found.`);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedRow) return;
        try {
            await deleteEntity('/disciplines', selectedRow.id);
            handleSuccess();
        } catch (err: any) {
            const status = err.response?.status;
            if (status === 409) alert('Deletion failed: This item is referenced by other entities.');
            else if (status === 404) alert('Deletion failed: Item not found.');
            else alert('An error occurred during deletion.');
        }
    };

    // Сохраняем выбранный фильтр; список пересчитается в useEffect
    const handleFilterSubmit = (filterBy: string, filterValue: string) => {
        const by = filterBy as keyof DisciplineDTO;
        const preview = applyFilter(originalData, { by, value: filterValue });
        if (preview.length === 0) {
            alert(`No items found with ${filterBy} = "${filterValue}"`);
        }
        setActiveFilter({ by, value: filterValue });
        setActiveModal(null);
    };

    const resetFilter = () => setActiveFilter(null);

    if (isLoading) return <p className={styles.centered}>Loading Disciplines...</p>;
    if (error) return <p className={`${styles.centered} ${styles.error}`}>{error}</p>;

    return (
        <div className={styles.page}>
            <h1 className={styles.title}>Таблица Discipline</h1>

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
                <Button onClick={() => handleTopButtonClick('delete')} variant="danger">
                    Delete
                </Button>
            </div>

            <Table columns={columns} data={filteredData} onAction={handleAction} />

            <Modal isOpen={activeModal === 'filter'} onClose={closeModal} title="Filter">
                <FilterForm onClose={closeModal} columns={columns} onSubmit={handleFilterSubmit} />
            </Modal>

            <Modal isOpen={activeModal === 'create'} onClose={closeModal} title="Create Discipline">
                <DisciplineForm onSuccess={handleSuccess} />
            </Modal>

            <Modal
                isOpen={activeModal === 'read'}
                onClose={closeModal}
                title={`Details for Discipline #${selectedRow?.id}`}
            >
                <DisciplineDetails itemData={selectedRow} />
            </Modal>

            <Modal
                isOpen={activeModal === 'update'}
                onClose={closeModal}
                title={`Update Discipline #${selectedRow?.id}`}
            >
                <DisciplineForm onSuccess={handleSuccess} initialData={selectedRow} />
            </Modal>

            <Modal isOpen={activeModal === 'delete'} onClose={closeModal} title="Delete Confirmation">
                <DeleteConfirmation
                    onClose={closeModal}
                    onConfirm={handleDeleteConfirm}
                    itemName={selectedRow?.name}
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
