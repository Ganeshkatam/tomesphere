-- Migration: Map canonical cover URLs in public.books to exact files in book-covers storage bucket

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Maths Sutra_ The Art of Vedic Speed Calculation ( PDFDrive ).jpg' 
WHERE id = '5631de5a-c8de-4ff1-973c-3f0f7c7cdfbb';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Wings of fire ( PDFDrive ).jpg' 
WHERE id = '0ffa0e00-ebe5-4a9c-b9df-e2aa80d15de0';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Everything Science Grade 10_ Everything Maths and Science ( PDFDrive ).jpg' 
WHERE id = '1c9d5a74-a673-4096-a794-5206671fa817';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/The Complete Yoga Poses ( PDFDrive ).jpg' 
WHERE id = '10192500-e1f3-4d44-bc43-dcae9c45c393';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Rig Veda Metrically Restored Text - Keith Briggs.jpg' 
WHERE id = 'b1274012-b84c-45a1-9095-9a66630b7084';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Java for Absolute Beginners_ Learn to Program the Fundamentals the Java 9- Way ( PDFDrive ).jpg' 
WHERE id = '152e9932-c07b-483c-bf18-ad4da052ff52';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/figure drawing _design and invention ( PDFDrive ).jpg' 
WHERE id = '022a18c9-9cae-411e-b3f3-ac6888440d75';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/In the Silence You Left Behind  By sumitra Manda.jpg' 
WHERE id = '99bf045e-c1ac-41b5-8a30-a1ec7ae5b3ae';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/JavaScript_ JavaScript For Beginners - Learn JavaScript Programming with ease in HALF THE TIME - Everything about the Language, Coding, Programming and Web Pages You need to know ( PDFDrive ).jpg' 
WHERE id = '32f179c6-dfe8-452d-9f5f-8142320d6993';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Vedic Mathematics Made Easy ( PDFDrive ).jpg' 
WHERE id = '64b22807-7b10-46ae-8460-5dc23b1efd9d';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Learn Python in One Day and Learn It Well_ Python for Beginners with Hands-on Project. The only bo.jpg' 
WHERE id = '9e973743-09cf-4bbb-a26b-d241d935e9ca';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/Yoga_ The Top 100 Best Yoga Poses_ Relieve Stress Increase Flexibility and Gain Strength (Yoga Postures Poses Exercises Techniques and Guide For Healing Stretching Strengthening and Stress Relief).jpg' 
WHERE id = '0530c31b-7c79-4426-b830-f2e27f350f6d';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/The Mobile Application Hacker''s Handbook ( PDFDrive ).jpg' 
WHERE id = '0044eee6-a5d8-4ea6-b086-618d403691bf';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/The Monk Who Sold His Ferrari Book ( PDFfile ).jpg' 
WHERE id = 'eb7a357d-795e-48d3-a126-cf9e7a47fce2';

UPDATE public.books 
SET cover_url = 'https://qusuvzwycdmnecixzsgc.supabase.co/storage/v1/object/public/book-covers/The Web Application Hacker''s Handbook ( PDFile ).jpg' 
WHERE id = 'f3b1a35d-ad15-497a-98ad-80446c622ebd';
