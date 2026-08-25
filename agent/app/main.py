from fastapi import FastAPI

app = FastAPI(title="Ringly AI Agent Service")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
