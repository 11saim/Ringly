-- kb_embeddings was originally created with vector(1536), assuming an
-- OpenAI-style embedding model. The actual model in use is
-- nomic-embed-text (run locally via Ollama), which outputs 768
-- dimensions, not 1536. Since the table is currently empty (no
-- embeddings have been generated yet), this can be a straight column
-- type change rather than a data migration.

alter table kb_embeddings alter column embedding type vector(768);

-- The ivfflat index was built against the old dimension; drop and
-- recreate it against the corrected column.
drop index if exists kb_embeddings_embedding_idx;
create index on kb_embeddings using ivfflat (embedding vector_cosine_ops);