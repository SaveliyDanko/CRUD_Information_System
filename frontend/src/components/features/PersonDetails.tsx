import { PersonFullDTO } from '../../types';
import styles from '../ui/DetailsView.module.css';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <>
        <div className={styles.label}>{label}:</div>
        <div className={styles.value}>{value}</div>
    </>
);

interface PersonDetailsProps {
  itemData: PersonFullDTO | null;
}

export const PersonDetails = ({ itemData }: PersonDetailsProps) => {
  if (!itemData) {
    return <p>No data to display. Please select a row.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.detailGrid}>
            <DetailItem label="ID" value={itemData.id} />
            <DetailItem label="Name" value={itemData.name} />
            <DetailItem label="Weight" value={`${itemData.weight} kg`} />
            <DetailItem label="Nationality" value={itemData.nationality || 'N/A'} />
            <DetailItem label="Eye Color" value={itemData.eyeColor || 'N/A'} />
            <DetailItem label="Hair Color" value={itemData.hairColor} />
        </div>
      </section>

      {itemData.location && (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location Information</h2>
            <div className={styles.detailGrid}>
                <DetailItem label="Location ID" value={itemData.location.id} />
                <DetailItem label="Location Name" value={itemData.location.name} />
                <DetailItem label="Location X" value={itemData.location.x} />
                <DetailItem label="Location Y" value={itemData.location.y} />
            </div>
        </section>
      )}
    </div>
  );
};