-- Migrate existing Venkoi Serve leads created with the retired product slug.
-- This is intentionally narrow: no other lead fields or product values change.
UPDATE leads
SET product = 'serve'
WHERE product = 'zaiko';
