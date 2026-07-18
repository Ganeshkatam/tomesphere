-- Add biography and location columns to profiles table
ALTER TABLE profiles ADD COLUMN biography text, ADD COLUMN location text;
