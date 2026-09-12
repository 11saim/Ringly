-- The actual similarity search happens here, not in Python — pgvector
-- can rank by cosine distance directly in SQL, which is far faster
-- than pulling every embedding back and comparing client-side.

create or replace function match_kb_embeddings(
  p_tenant_id uuid,
  p_query_embedding vector(768),
  p_match_count int default 5
)
returns table (
  id uuid,
  content text,
  source_faq_id uuid,
  source_document_id uuid,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    source_faq_id,
    source_document_id,
    1 - (embedding <=> p_query_embedding) as similarity
  from kb_embeddings
  where tenant_id = p_tenant_id
  order by embedding <=> p_query_embedding
  limit p_match_count;
$$;