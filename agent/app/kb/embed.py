import re
import io
import logging
from urllib.parse import urlparse

import httpx
from pypdf import PdfReader

from app.config import OLLAMA_BASE_URL
from app.supabase_client import get_client

log = logging.getLogger(__name__)

EMBED_MODEL = "nomic-embed-text"


def chunk_text(text: str, max_chars: int = 800) -> list[str]:
    """Split text into chunks by paragraph, merging short ones up to max_chars.

    If a single paragraph exceeds max_chars on its own, split it on sentence
    boundaries instead.
    """
    text = text.strip()
    if not text:
        return []

    paragraphs = re.split(r"\n\s*\n", text)

    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        if len(para) > max_chars:
            if current:
                chunks.append(current)
                current = ""

            sentences = re.split(r"(?<=[.!?])\s+", para)
            buf = ""
            for sent in sentences:
                if buf and len(buf) + 1 + len(sent) > max_chars:
                    chunks.append(buf)
                    buf = sent
                else:
                    buf = f"{buf} {sent}".strip() if buf else sent
            if buf:
                current = buf
        elif current and len(current) + 2 + len(para) <= max_chars:
            current = f"{current}\n\n{para}"
        else:
            if current:
                chunks.append(current)
            current = para

    if current:
        chunks.append(current)

    return chunks


def embed_text(text: str) -> list[float]:
    """Call local Ollama embeddings endpoint and return the vector."""
    url = f"{OLLAMA_BASE_URL}/api/embeddings"
    resp = httpx.post(
        url,
        json={"model": EMBED_MODEL, "prompt": text},
        timeout=30.0,
    )
    resp.raise_for_status()
    return resp.json()["embedding"]


def process_document(tenant_id: str, document_id: str) -> dict:
    """Fetch a kb_document, extract text, chunk, embed, and store.

    Returns {"status": "ok", "chunks": N} on success.
    On failure, updates kb_documents.status to 'failed' and re-raises.
    """
    client = get_client()

    doc = (
        client.table("kb_documents")
        .select("*")
        .eq("id", document_id)
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
        .data
    )
    if not doc:
        raise ValueError(f"Document {document_id} not found for tenant {tenant_id}")

    try:
        if doc["source_type"] == "paste":
            raw_text = doc.get("raw_text") or ""
        else:
            raw_text = _extract_upload_text(doc["file_url"])

        raw_text = raw_text.strip()
        if not raw_text:
            raise ValueError("Document contains no extractable text")

        chunks = chunk_text(raw_text)
        if not chunks:
            raise ValueError("Chunking produced zero chunks")

        rows = []
        for chunk in chunks:
            embedding = embed_text(chunk)
            rows.append(
                {
                    "tenant_id": tenant_id,
                    "source_document_id": document_id,
                    "content": chunk,
                    "embedding": embedding,
                }
            )

        client.table("kb_embeddings").insert(rows).execute()

        client.table("kb_documents").update({"status": "processed"}).eq(
            "id", document_id
        ).execute()

        return {"status": "ok", "chunks": len(chunks)}

    except Exception as exc:
        log.exception("Failed to process document %s", document_id)
        client.table("kb_documents").update({"status": "failed"}).eq(
            "id", document_id
        ).execute()
        raise


def process_faq(tenant_id: str, faq_id: str) -> dict:
    """Fetch a kb_faq, embed it as a single chunk, and store.

    Returns {"status": "ok", "chunks": 1} on success.
    """
    client = get_client()

    faq = (
        client.table("kb_faqs")
        .select("*")
        .eq("id", faq_id)
        .eq("tenant_id", tenant_id)
        .single()
        .execute()
        .data
    )
    if not faq:
        raise ValueError(f"FAQ {faq_id} not found for tenant {tenant_id}")

    combined = f"Q: {faq['question']}\nA: {faq['answer']}"
    embedding = embed_text(combined)

    client.table("kb_embeddings").insert(
        {
            "tenant_id": tenant_id,
            "source_faq_id": faq_id,
            "content": combined,
            "embedding": embedding,
        }
    ).execute()

    return {"status": "ok", "chunks": 1}


def _extract_upload_text(file_url: str) -> str:
    """Download a file from Supabase Storage and extract text."""
    parsed = urlparse(file_url)
    path_parts = parsed.path.lstrip("/").split("/", 1)
    if len(path_parts) < 2:
        raise ValueError(f"Cannot parse storage path from URL: {file_url}")

    bucket = path_parts[0]
    file_path = "/".join(path_parts[1:])

    client = get_client()
    file_bytes = client.storage.from_(bucket).download(file_path)

    if file_url.lower().endswith(".pdf") or file_path.lower().endswith(".pdf"):
        reader = PdfReader(io.BytesIO(file_bytes))
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n\n".join(pages)

    return file_bytes.decode("utf-8", errors="replace")
