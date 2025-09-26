import { LocationDTO } from '../../types';
import styles from '../ui/DetailsView.module.css';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <>
        <div className={styles.label}>{label}:</div>
        <div className={styles.value}>{value}</div>
    </>
);

interface LocationDetailsProps {
  itemData: LocationDTO | null;
}

export const LocationDetails = ({ itemData }: LocationDetailsProps) => {
  if (!itemData) {
    return <p>No data to display. Please select a row.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Location Information</h2>
        <div className={styles.detailGrid}>
            <DetailItem label="ID" value={itemData.id} />
            <DetailItem label="Name" value={itemData.name} />
            <DetailItem label="X Coordinate" value={itemData.x} />
            <DetailItem label="Y Coordinate" value={itemData.y} />
        </div>
      </section>
    </div>
  );
};