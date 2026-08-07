-- Add cover_url to tenants for profile cover photo
ALTER TABLE tenants ADD COLUMN cover_url text;

-- Add name to kb_documents for document labels
ALTER TABLE kb_documents ADD COLUMN name text;
