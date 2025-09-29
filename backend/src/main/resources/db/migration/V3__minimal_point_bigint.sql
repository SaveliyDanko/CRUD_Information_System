-- привести тип к BIGINT
ALTER TABLE lab_work
  ALTER COLUMN minimal_point TYPE BIGINT
  USING minimal_point::bigint;

-- на всякий случай переутвердим NOT NULL и чек-ограничение (> 0)
ALTER TABLE lab_work
  ALTER COLUMN minimal_point SET NOT NULL;

-- если у вас уже был CHECK, он останется.
-- добавим/обновим его идемпотентно:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'lab_work_minimal_point_positive'
      AND conrelid = 'lab_work'::regclass
  ) THEN
    ALTER TABLE lab_work
      ADD CONSTRAINT lab_work_minimal_point_positive CHECK (minimal_point > 0);
  END IF;
END$$;
