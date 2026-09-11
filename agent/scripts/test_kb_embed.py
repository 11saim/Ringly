"""Test the KB embedding pipeline directly (no HTTP).

Usage:
  python scripts/test_kb_embed.py document <tenant_id> <document_id>
  python scripts/test_kb_embed.py faq      <tenant_id> <faq_id>

Inserts real embeddings into kb_embeddings and verifies the results.
"""

import sys

sys.path.insert(0, ".")

from app.supabase_client import get_client
from app.kb.embed import process_document, process_faq


def main():
    if len(sys.argv) < 4:
        print("Usage: python scripts/test_kb_embed.py <document|faq> <tenant_id> <source_id>")
        sys.exit(1)

    source_type = sys.argv[1]
    tenant_id = sys.argv[2]
    source_id = sys.argv[3]

    if source_type not in ("document", "faq"):
        print(f"Unknown source_type: {source_type}. Use 'document' or 'faq'.")
        sys.exit(1)

    print(f"Processing {source_type} {source_id} for tenant {tenant_id}...")

    try:
        if source_type == "document":
            result = process_document(tenant_id, source_id)
        else:
            result = process_faq(tenant_id, source_id)
    except Exception as exc:
        print(f"FAILED: {exc}")
        sys.exit(1)

    print(f"OK — {result['chunks']} chunk(s) created")

    # Verify rows in kb_embeddings
    client = get_client()
    query = client.table("kb_embeddings").select("id, content, embedding").eq("tenant_id", tenant_id)

    if source_type == "document":
        query = query.eq("source_document_id", source_id)
    else:
        query = query.eq("source_faq_id", source_id)

    rows = query.execute().data
    print(f"Rows in kb_embeddings: {len(rows)}")
    for i, row in enumerate(rows):
        emb = row["embedding"]
        dim = len(emb) if isinstance(emb, list) else "N/A"
        preview = row["content"][:80].replace("\n", " ")
        print(f"  [{i}] id={row['id']}  dim={dim}  content={preview!r}...")

    # For documents, verify status flipped to 'processed'
    if source_type == "document":
        doc = (
            client.table("kb_documents")
            .select("status")
            .eq("id", source_id)
            .single()
            .execute()
            .data
        )
        print(f"Document status: {doc['status']}")
        if doc["status"] != "processed":
            print("WARNING: expected status 'processed'")
            sys.exit(1)

    print("\nAll checks passed.")


if __name__ == "__main__":
    main()
