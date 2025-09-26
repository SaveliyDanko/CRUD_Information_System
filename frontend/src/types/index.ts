export type Color = 'GREEN' | 'RED' | 'WHITE' | 'BROWN';
export type Country = 'UNITED_KINGDOM' | 'GERMANY' | 'INDIA';
export type Difficulty = 'VERY_EASY' | 'EASY' | 'INSANE' | 'HOPELESS';

export interface CoordinatesDTO {
  id: number;
  x: number;
  y: number;
}

export interface DisciplineDTO {
  id: number;
  name: string;
  practiceHours: number;
  labsCount: number;
}

export interface LocationDTO {
  id: number;
  name: string;
  x: number;
  y: number;
}

export interface PersonDTO {
  id: number;
  name: string;
  eyeColor: Color;
  hairColor: Color;
  weight: number;
  nationality: Country;
  locationId: number | null;
  locationName: string | null;
}

export interface LabWorkDTO {
  id: number;
  name: string;
  description: string | null;
  difficulty: Difficulty;
  minimalPoint: number;
  creationDate: string; // ISO 8601
  coordinatesId: number;
  authorId: number | null;
  authorName: string | null;
  disciplineId: number | null;
  disciplineName: string | null;
}

export interface SumDTO {
  sum: number;
}

export interface CountDTO {
  count: number;
}

export interface DeleteResultDTO {
  deleted: number;
}

export interface PersonFullDTO extends Omit<PersonDTO, 'locationId' | 'locationName'> {
  location: LocationDTO | null;
}

export interface LabWorkFullDTO extends Omit<LabWorkDTO, 'coordinatesId' | 'authorId' | 'authorName' | 'disciplineId' | 'disciplineName'> {
  coordinates: CoordinatesDTO | null;
  author: PersonFullDTO | null;
  discipline: DisciplineDTO | null;
}