-- Split 'A P J Abdul Kalam with Arun Tiwari'
INSERT INTO authors (id, name, slug) VALUES 
  (gen_random_uuid(), 'A P J Abdul Kalam', 'a-p-j-abdul-kalam'),
  (gen_random_uuid(), 'Arun Tiwari', 'arun-tiwari')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO book_authors (book_id, author_id, position)
SELECT '0ffa0e00-ebe5-4a9c-b9df-e2aa80d15de0', id, ROW_NUMBER() OVER(ORDER BY name) - 1 FROM authors WHERE slug IN ('a-p-j-abdul-kalam', 'arun-tiwari')
ON CONFLICT DO NOTHING;

-- Split 'Dominic Chell,Tyrone Erasmus,Shaun Colley,Ollie Whitehouse'
INSERT INTO authors (id, name, slug) VALUES 
  (gen_random_uuid(), 'Dominic Chell', 'dominic-chell'),
  (gen_random_uuid(), 'Tyrone Erasmus', 'tyrone-erasmus'),
  (gen_random_uuid(), 'Shaun Colley', 'shaun-colley'),
  (gen_random_uuid(), 'Ollie Whitehouse', 'ollie-whitehouse')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO book_authors (book_id, author_id, position)
SELECT '0044eee6-a5d8-4ea6-b086-618d403691bf', id, ROW_NUMBER() OVER(ORDER BY name) - 1 FROM authors WHERE slug IN ('dominic-chell', 'tyrone-erasmus', 'shaun-colley', 'ollie-whitehouse')
ON CONFLICT DO NOTHING;

-- Split 'Dafydd Stuttard and Marcus Pinto'
INSERT INTO authors (id, name, slug) VALUES 
  (gen_random_uuid(), 'Dafydd Stuttard', 'dafydd-stuttard'),
  (gen_random_uuid(), 'Marcus Pinto', 'marcus-pinto')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO book_authors (book_id, author_id, position)
SELECT 'f3b1a35d-ad15-497a-98ad-80446c622ebd', id, ROW_NUMBER() OVER(ORDER BY name) - 1 FROM authors WHERE slug IN ('dafydd-stuttard', 'marcus-pinto')
ON CONFLICT DO NOTHING;

-- Delete old book_authors mappings
DELETE FROM book_authors WHERE author_id IN (
  'b20b9f97-1414-42e8-af77-e9b71c321288',
  '88e0aa69-bcb5-42db-a9c8-4e4eab097b2e',
  '292f0d26-d8cb-4e28-993b-9896e38b9fe3'
);

-- Delete the old compound authors
DELETE FROM authors WHERE id IN (
  'b20b9f97-1414-42e8-af77-e9b71c321288',
  '88e0aa69-bcb5-42db-a9c8-4e4eab097b2e',
  '292f0d26-d8cb-4e28-993b-9896e38b9fe3'
);
