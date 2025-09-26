import { DisciplineDTO } from '../../types';
import styles from '../ui/DetailsView.module.css';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <>
        <div className={styles.label}>{label}:</div>
        <div className={styles.value}>{value}</div>
    </>
);

interface DisciplineDetailsProps {
  itemData: DisciplineDTO | null;
}

export const DisciplineDetails = ({ itemData }: DisciplineDetailsProps) => {
  if (!itemData) {
    return <p>No data to display. Please select a row.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Discipline Information</h2>
        <div className={styles.detailGrid}>
            <DetailItem label="ID" value={itemData.id} />
            <DetailItem label="Name" value={itemData.name} />
            <DetailItem label="Practice Hours" value={itemData.practiceHours} />
            <DetailItem label="Labs Count" value={itemData.labsCount} />
        </div>
      </section>
    </div>
  );
};