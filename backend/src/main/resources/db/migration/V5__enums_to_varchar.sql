-- person.eye_color: nullable
ALTER TABLE person
  ALTER COLUMN eye_color TYPE VARCHAR(20) USING eye_color::text;
ALTER TABLE person
  DROP CONSTRAINT IF EXISTS chk_person_eye_color,
  ADD CONSTRAINT chk_person_eye_color
    CHECK (eye_color IS NULL OR eye_color IN ('GREEN','RED','WHITE','BROWN'));

-- person.hair_color: NOT NULL
ALTER TABLE person
  ALTER COLUMN hair_color TYPE VARCHAR(20) USING hair_color::text;
ALTER TABLE person
  DROP CONSTRAINT IF EXISTS chk_person_hair_color,
  ADD CONSTRAINT chk_person_hair_color
    CHECK (hair_color IN ('GREEN','RED','WHITE','BROWN'));

-- person.nationality: nullable
ALTER TABLE person
  ALTER COLUMN nationality TYPE VARCHAR(30) USING nationality::text;
ALTER TABLE person
  DROP CONSTRAINT IF EXISTS chk_person_nationality,
  ADD CONSTRAINT chk_person_nationality
    CHECK (nationality IS NULL OR nationality IN ('UNITED_KINGDOM','GERMANY','INDIA'));

-- lab_work.difficulty: NOT NULL
ALTER TABLE lab_work
  ALTER COLUMN difficulty TYPE VARCHAR(20) USING difficulty::text;
ALTER TABLE lab_work
  DROP CONSTRAINT IF EXISTS chk_lab_work_difficulty,
  ADD CONSTRAINT chk_lab_work_difficulty
    CHECK (difficulty IN ('VERY_EASY','EASY','INSANE','HOPELESS'));

-- (опционально) потом можно удалить сами типы, если больше нигде не используются:
-- DROP TYPE IF EXISTS color_enum;
-- DROP TYPE IF EXISTS country_enum;
-- DROP TYPE IF EXISTS difficulty_enum;
