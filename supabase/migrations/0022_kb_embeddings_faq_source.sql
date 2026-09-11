-- kb_embeddings currently only links back to kb_documents. Add a
-- second optional link to kb_faqs, so FAQs can also be embedded for
-- semantic search (alongside the direct text match already planned
-- for FAQs) — a chunk belongs to exactly one of the two, never both.

alter table kb_embeddings add column if not exists source_faq_id uuid references kb_faqs(id) on delete cascade;

alter table kb_embeddings add constraint kb_embeddings_one_source
  check (
    (source_document_id is not null and source_faq_id is null) or
    (source_document_id is null and source_faq_id is not null)
  );