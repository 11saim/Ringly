import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.kb.embed import process_document, process_faq

log = logging.getLogger(__name__)

app = FastAPI(title="Ringly AI Agent Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


class KEmbedRequest(BaseModel):
    tenant_id: str
    source_type: str  # "document" | "faq"
    source_id: str


@app.post("/kb/embed")
async def kb_embed(req: KEmbedRequest):
    if req.source_type not in ("document", "faq"):
        raise HTTPException(status_code=400, detail="source_type must be 'document' or 'faq'")

    try:
        if req.source_type == "document":
            result = process_document(req.tenant_id, req.source_id)
        else:
            result = process_faq(req.tenant_id, req.source_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except Exception as exc:
        log.exception("KB embed failed")
        raise HTTPException(status_code=500, detail=f"Embedding failed: {exc}")

    return {"status": "ok", "chunks": result["chunks"]}
