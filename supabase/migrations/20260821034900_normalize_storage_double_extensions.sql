-- Migration: Normalize storage object names and database URLs by removing accidental double extensions (.jpg.png -> .png, .pdf.pdf -> .pdf)

-- 1. Update storage.objects for book-covers
UPDATE storage.objects 
SET name = REPLACE(name, '.jpg.png', '.png') 
WHERE bucket_id = 'book-covers' AND name LIKE '%.jpg.png';

-- 2. Update storage.objects for book-pdfs
UPDATE storage.objects 
SET name = REPLACE(name, '.pdf.pdf', '.pdf') 
WHERE bucket_id = 'book-pdfs' AND name LIKE '%.pdf.pdf';

-- 3. Update public.books cover_url and pdf_url
UPDATE public.books 
SET cover_url = REPLACE(cover_url, '.jpg.png', '.png') 
WHERE cover_url LIKE '%.jpg.png';

UPDATE public.books 
SET pdf_url = REPLACE(pdf_url, '.pdf.pdf', '.pdf') 
WHERE pdf_url LIKE '%.pdf.pdf';

-- 4. Update public.book_files storage_path
UPDATE public.book_files 
SET storage_path = REPLACE(storage_path, '.pdf.pdf', '.pdf') 
WHERE storage_path LIKE '%.pdf.pdf';

UPDATE public.book_files 
SET storage_path = REPLACE(storage_path, '.jpg.png', '.png') 
WHERE storage_path LIKE '%.jpg.png';
