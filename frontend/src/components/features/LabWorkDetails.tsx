import { LabWorkFullDTO } from '../../types';
import styles from '../ui/DetailsView.module.css';

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <>
        <div className={styles.label}>{label}:</div>
        <div className={styles.value}>{value}</div>
    </>
);

interface LabWorkDetailsProps {
  labWork: LabWorkFullDTO | null;
}

export const LabWorkDetails = ({ labWork }: LabWorkDetailsProps) => {
  if (!labWork) {
    return <p>No data to display. Please select a row.</p>;
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Information</h2>
        <div className={styles.detailGrid}>
            <DetailItem label="ID" value={labWork.id} />
            <DetailItem label="Name" value={labWork.name} />
            <DetailItem label="Description" value={labWork.description || 'N/A'} />
            <DetailItem label="Minimal Point" value={labWork.minimalPoint} />
            <DetailItem label="Difficulty" value={labWork.difficulty} />
            <DetailItem label="Creation Date" value={new Date(labWork.creationDate).toLocaleString()} />
        </div>
      </section>

      {labWork.coordinates && (
        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Coordinates</h2>
            <div className={styles.detailGrid}>
                <DetailItem label="ID" value={labWork.coordinates.id} />
                <DetailItem label="X" value={labWork.coordinates.x} />
                <DetailItem label="Y" value={labWork.coordinates.y} />
            </div>
        </section>
      )}

      {labWork.discipline && (
          <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Discipline</h2>
              <div className={styles.detailGrid}>
                  <DetailItem label="ID" value={labWork.discipline.id} />
                  <DetailItem label="Name" value={labWork.discipline.name} />
                  <DetailItem label="Practice Hours" value={labWork.discipline.practiceHours} />
                  <DetailItem label="Labs Count" value={labWork.discipline.labsCount} />
              </div>
          </section>
      )}

      {labWork.author && (
          <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Author</h2>
              <div className={styles.detailGrid}>
                  <DetailItem label="ID" value={labWork.author.id} />
                  <DetailItem label="Name" value={labWork.author.name} />
                  <DetailItem label="Weight" value={`${labWork.author.weight} kg`} />
                  <DetailItem label="Nationality" value={labWork.author.nationality || 'N/A'} />
                  <DetailItem label="Eye Color" value={labWork.author.eyeColor || 'N/A'} />
                  <DetailItem label="Hair Color" value={labWork.author.hairColor || 'N/A'} />
              </div>
              {labWork.author.location && (
                  <>
                    <h3 className={styles.subSectionTitle}>Author's Location</h3>
                    <div className={styles.detailGrid}>
                      <DetailItem label="Location Name" value={labWork.author.location.name} />
                      <DetailItem label="Location X" value={labWork.author.location.x} />
                      <DetailItem label="Location Y" value={labWork.author.location.y} />
                    </div>
                  </>
              )}
          </section>
      )}
    </div>
  );
};