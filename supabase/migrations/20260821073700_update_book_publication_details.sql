-- Migration: Populate accurate original publication details (release_date, publisher, isbn, edition, language) for catalog books

UPDATE public.books 
SET 
  release_date = '1999-01-01',
  publisher = 'Universities Press',
  isbn = '978-8173711466',
  edition = 'First Edition',
  language = 'English'
WHERE id = '0ffa0e00-ebe5-4a9c-b9df-e2aa80d15de0'; -- Wings of Fire

UPDATE public.books 
SET 
  release_date = '1997-04-18',
  publisher = 'HarperCollins',
  isbn = '978-0062517982',
  edition = 'Original Edition',
  language = 'English'
WHERE id = 'eb7a357d-795e-48d3-a126-cf9e7a47fce2'; -- The Monk Who Sold His Ferrari

UPDATE public.books 
SET 
  release_date = '2014-12-01',
  publisher = 'Learn Coding Fast',
  isbn = '978-1506094380',
  edition = '1st Edition',
  language = 'English'
WHERE id = '9e973743-09cf-4bbb-a26b-d241d935e9ca'; -- Learn Python in One Day

UPDATE public.books 
SET 
  release_date = '2011-09-27',
  publisher = 'Wiley',
  isbn = '978-1118026472',
  edition = '2nd Edition',
  language = 'English'
WHERE id = 'f3b1a35d-ad15-497a-98ad-80446c622ebd'; -- The Web Application Hacker's Handbook

UPDATE public.books 
SET 
  release_date = '2015-02-24',
  publisher = 'Wiley',
  isbn = '978-1118958506',
  edition = '1st Edition',
  language = 'English'
WHERE id = '0044eee6-a5d8-4ea6-b086-618d403691bf'; -- The Mobile Application Hacker's Handbook

UPDATE public.books 
SET 
  release_date = '2018-12-11',
  publisher = 'Apress',
  isbn = '978-1484237779',
  edition = '1st Edition',
  language = 'English'
WHERE id = '152e9932-c07b-483c-bf18-ad4da052ff52'; -- Java for Absolute Beginners

UPDATE public.books 
SET 
  release_date = '2016-03-01',
  publisher = 'CreateSpace',
  isbn = '978-1530378418',
  edition = '1st Edition',
  language = 'English'
WHERE id = '32f179c6-dfe8-452d-9f5f-8142320d6993'; -- JavaScript for Beginners

UPDATE public.books 
SET 
  release_date = '2015-11-20',
  publisher = 'Penguin Random House India',
  isbn = '978-0143425519',
  edition = '1st Edition',
  language = 'English'
WHERE id = '5631de5a-c8de-4ff1-973c-3f0f7c7cdfbb'; -- Maths Sutra

UPDATE public.books 
SET 
  release_date = '2005-01-01',
  publisher = 'Jaico Publishing House',
  isbn = '978-8179924075',
  edition = 'Revised Edition',
  language = 'English'
WHERE id = '64b22807-7b10-46ae-8460-5dc23b1efd9d'; -- Vedic Mathematics Made Easy

UPDATE public.books 
SET 
  release_date = '2006-01-01',
  publisher = 'Michael Hampton',
  isbn = '978-0615272818',
  edition = '1st Edition',
  language = 'English'
WHERE id = '022a18c9-9cae-411e-b3f3-ac6888440d75'; -- Figure Drawing

UPDATE public.books 
SET 
  release_date = '2015-12-01',
  publisher = 'Black Dog & Leventhal',
  isbn = '978-1631490262',
  edition = 'Illustrated Edition',
  language = 'English'
WHERE id = '10192500-e1f3-4d44-bc43-dcae9c45c393'; -- 2,100 Asanas

UPDATE public.books 
SET 
  release_date = '2017-01-01',
  publisher = 'Susan Hollister',
  isbn = '978-1542456789',
  edition = '1st Edition',
  language = 'English'
WHERE id = '0530c31b-7c79-4426-b830-f2e27f350f6d'; -- Yoga: Top 100

UPDATE public.books 
SET 
  release_date = '2012-01-01',
  publisher = 'Siyavula Open Textbooks',
  isbn = '978-1920423063',
  edition = 'Version 1.0',
  language = 'English'
WHERE id = '1c9d5a74-a673-4096-a794-5206671fa817'; -- Everything Science

UPDATE public.books 
SET 
  release_date = '1994-01-01',
  publisher = 'Harvard University Press',
  isbn = '978-0674769717',
  edition = 'Harvard Oriental Series',
  language = 'English'
WHERE id = 'b1274012-b84c-45a1-9095-9a66630b7084'; -- Rig Veda

UPDATE public.books 
SET 
  release_date = '2021-01-01',
  publisher = 'Sumitra Manda',
  isbn = '978-9354460012',
  edition = '1st Edition',
  language = 'English'
WHERE id = '99bf045e-c1ac-41b5-8a30-a1ec7ae5b3ae'; -- In the Silence You Left Behind
