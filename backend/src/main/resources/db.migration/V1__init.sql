-- === ENUM TYPES (idempotent creation) ===
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
    CREATE TYPE difficulty_enum AS ENUM ('VERY_EASY','EASY','INSANE','HOPELESS');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'color_enum') THEN
    CREATE TYPE color_enum AS ENUM ('GREEN','RED','WHITE','BROWN');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'country_enum') THEN
    CREATE TYPE country_enum AS ENUM ('UNITED_KINGDOM','GERMANY','INDIA');
  END IF;
END$$;

-- === TABLES ===

-- Coordinates: x NOT NULL, y NOT NULL (primitive в модели), отдельный PK.
CREATE TABLE IF NOT EXISTS coordinates (
  id BIGSERIAL PRIMARY KEY,
  x  REAL  NOT NULL,
  y  REAL  NOT NULL
);

-- Location: все поля NOT NULL, name не пустая строка.
CREATE TABLE IF NOT EXISTS location (
  id   BIGSERIAL PRIMARY KEY,
  x    DOUBLE PRECISION NOT NULL,
  y    INTEGER          NOT NULL,
  name VARCHAR(255)     NOT NULL,
  CONSTRAINT location_name_not_blank CHECK (length(btrim(name)) > 0)
);

-- Person: name not blank, hairColor NOT NULL, eyeColor nullable, location nullable,
-- weight > 0, nationality nullable.
CREATE TABLE IF NOT EXISTS person (
  id          BIGSERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  eye_color   color_enum   NULL,
  hair_color  color_enum   NOT NULL,
  location_id BIGINT       NULL,
  weight      DOUBLE PRECISION NOT NULL,
  nationality country_enum NULL,
  CONSTRAINT person_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT person_weight_positive CHECK (weight > 0),
  CONSTRAINT person_location_fk FOREIGN KEY (location_id)
    REFERENCES location(id) ON DELETE SET NULL
);

-- Discipline: все поля NOT NULL, name not blank.
CREATE TABLE IF NOT EXISTS discipline (
  id             BIGSERIAL PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  practice_hours BIGINT       NOT NULL,
  labs_count     BIGINT       NOT NULL,
  CONSTRAINT discipline_name_not_blank CHECK (length(btrim(name)) > 0)
);

-- LabWork: id авто, name not blank, coordinates 1:1, creation_date авто,
-- description <= 7529, difficulty NOT NULL, discipline nullable, minimalPoint > 0, author nullable.
CREATE TABLE IF NOT EXISTS lab_work (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(255)  NOT NULL,
  coordinates_id  BIGINT        NOT NULL UNIQUE,
  creation_date   TIMESTAMPTZ   NOT NULL DEFAULT now(),
  description     VARCHAR(7529) NULL,
  difficulty      difficulty_enum NOT NULL,
  discipline_id   BIGINT        NULL,
  minimal_point   INTEGER       NOT NULL,
  author_id       BIGINT        NULL,
  CONSTRAINT lab_work_name_not_blank CHECK (length(btrim(name)) > 0),
  CONSTRAINT lab_work_minimal_point_positive CHECK (minimal_point > 0),
  CONSTRAINT lab_work_coordinates_fk FOREIGN KEY (coordinates_id)
    REFERENCES coordinates(id) ON DELETE RESTRICT,
  CONSTRAINT lab_work_discipline_fk FOREIGN KEY (discipline_id)
    REFERENCES discipline(id) ON DELETE SET NULL,
  CONSTRAINT lab_work_author_fk FOREIGN KEY (author_id)
    REFERENCES person(id) ON DELETE SET NULL
);

-- Индексы по FK (ускоряют джойны; опционально)
CREATE INDEX IF NOT EXISTS idx_person_location_id   ON person(location_id);
CREATE INDEX IF NOT EXISTS idx_lab_work_discipline  ON lab_work(discipline_id);
CREATE INDEX IF NOT EXISTS idx_lab_work_author      ON lab_work(author_id);
