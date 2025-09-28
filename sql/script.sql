BEGIN;

INSERT INTO coordinates (id, x, y) VALUES
  (1, 12.34, 56.7),
  (2, 98.76, 10.0),
  (3, 0.01,  250.5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO location (id, x, y, name) VALUES
  (1,  40.7128,  -74,       'NYC Point'),
  (2,  48.1371,   11,       'Munich Center'),
  (3,  28.6139,   77,       'Delhi Spot')
ON CONFLICT (id) DO NOTHING;

INSERT INTO person (id, name, eye_color, hair_color, location_id, weight, nationality) VALUES
  (1, 'Alice',  'GREEN', 'BROWN', 1, 55.0, 'GERMANY'),
  (2, 'Bob',    NULL,    'RED',   2, 82.5, NULL),
  (3, 'Chandra','WHITE', 'WHITE', 3, 68.2, 'INDIA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO discipline (id, name, practice_hours, labs_count) VALUES
  (1, 'Data Structures', 48, 12),
  (2, 'Operating Systems', 64, 16),
  (3, 'Distributed Systems', 72, 18)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lab_work
  (id, name, coordinates_id, creation_date, description, difficulty, discipline_id, minimal_point, author_id)
VALUES
  (1, 'Vectors 101', 1, NOW(), 'Введение в работу с векторами', 'EASY', 1, 10, 1),
  (2, 'OS Schedulers', 2, NOW(), 'Эксперименты с планировщиками ОС', 'VERY_EASY', 2, 20, 2),
  (3, 'Kafka Stream Join', 3, NOW(), 'Практика по потоковым join в Kafka Streams', 'INSANE', 3, 50, 3),
  (4, 'Null Discipline/Author Demo', 1, NOW(), NULL, 'HOPELESS', NULL, 5, NULL)
ON CONFLICT (id) DO NOTHING;

COMMIT;
