import { Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LabWorkPage } from '../pages/LabWorkPage';
import { FunctionsPage } from '../pages/FunctionsPage';
import { CoordinatesPage } from '../pages/CoordinatesPage';
import { DisciplinePage } from '../pages/DisciplinePage';
import { PersonPage } from '../pages/PersonPage';
import { LocationPage } from '../pages/LocationPage';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LabWorkPage />} /> 
        <Route path="labwork" element={<LabWorkPage />} />
        <Route path="coordinates" element={<CoordinatesPage />} />
        <Route path="discipline" element={<DisciplinePage />} />
        <Route path="person" element={<PersonPage />} />
        <Route path="location" element={<LocationPage />} />
        <Route path="functions" element={<FunctionsPage />} />
      </Route>
    </Routes>
  );
};