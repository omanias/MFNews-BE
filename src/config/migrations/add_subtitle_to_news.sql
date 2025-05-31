-- Add subtitle column to news table
ALTER TABLE news ADD COLUMN subtitle VARCHAR(255);

-- Update existing rows to have a default subtitle
UPDATE news SET subtitle = title WHERE subtitle IS NULL; 