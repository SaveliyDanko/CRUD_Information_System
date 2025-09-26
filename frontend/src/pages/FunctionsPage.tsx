import { FunctionCard } from '../components/features/FunctionCard';
import styles from './FunctionsPage.module.css';
import {
  deleteAllByMinimalPoint,
  getSumOfMinimalPoint,
  getCountByAuthorIdGreaterThan,
  decreaseDifficulty,
  assignTop10ToDiscipline
} from '../api/apiClient';

export const FunctionsPage = () => {
  return (
    <div className={styles.page}>
      
      <h1 className={styles.title}>Functions</h1>

      <div className={styles.functionsList}>

        <FunctionCard
          title="Удалить все объекты, значение поля `minimalPoint` которого эквивалентно заданному."
          inputs={[{ id: 'minimalPoint', placeholder: 'Minimal Point', type: 'number' }]}
          apiFunc={deleteAllByMinimalPoint}
        />

        <FunctionCard
          title="Рассчитать сумму значений поля `minimalPoint` для всех объектов."
          apiFunc={getSumOfMinimalPoint}
        />

        <FunctionCard
          title="Вернуть количество объектов, значение поля `author` которых больше заданного."
          inputs={[{ id: 'authorId', placeholder: 'Author ID', type: 'number' }]}
          apiFunc={getCountByAuthorIdGreaterThan}
        />

        <FunctionCard
          title="Понизить сложность заданной лабораторной работы на указанное число 'шагов'."
          inputs={[
            { id: 'labId', placeholder: 'LabWork ID', type: 'number' },
            { id: 'steps', placeholder: 'Steps', type: 'number' },
          ]}
          apiFunc={decreaseDifficulty}
        />

        <FunctionCard
          title="Добавить в программу указанной дисциплины 10 самых сложных лабораторных работ."
          inputs={[{ id: 'disciplineId', placeholder: 'Discipline ID', type: 'number' }]}
          apiFunc={assignTop10ToDiscipline}
        />
      </div>
    </div>
  );
};