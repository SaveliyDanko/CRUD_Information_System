-- Выровнять последовательности под максимальные id в таблицах
SELECT setval(pg_get_serial_sequence('coordinates', 'id'),
              COALESCE((SELECT MAX(id) FROM coordinates), 0), true);

SELECT setval(pg_get_serial_sequence('location', 'id'),
              COALESCE((SELECT MAX(id) FROM location), 0), true);

SELECT setval(pg_get_serial_sequence('person', 'id'),
              COALESCE((SELECT MAX(id) FROM person), 0), true);

SELECT setval(pg_get_serial_sequence('discipline', 'id'),
              COALESCE((SELECT MAX(id) FROM discipline), 0), true);

SELECT setval(pg_get_serial_sequence('lab_work', 'id'),
              COALESCE((SELECT MAX(id) FROM lab_work), 0), true);
