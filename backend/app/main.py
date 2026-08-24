import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title="PostPulse API",
    version=settings.VERSION,
    description="PostPulse — Social Media Content Intelligence & Distribution Platform API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Enable CORS for cross-origin frontend support (Vercel + Local + Render)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API router at /api
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Determine static frontend dist path if bundled together
potential_dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend/dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend/dist")),
    os.path.abspath(os.path.join(os.getcwd(), "dist")),
]

dist_dir = None
for p in potential_dist_paths:
    if os.path.exists(p) and os.path.exists(os.path.join(p, "index.html")):
        dist_dir = p
        break

if dist_dir:
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        # Allow FastAPI to handle API, Swagger docs, Redoc and OpenAPI spec directly
        if (
            full_path in ["docs", "redoc", "openapi.json"]
            or full_path.startswith("api")
            or full_path.startswith("docs/")
            or full_path.startswith("redoc/")
        ):
            raise HTTPException(status_code=404, detail="Not Found")
            
        file_path = os.path.join(dist_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/", include_in_schema=False)
    def root():
        return {
            "service": "PostPulse Content Intelligence API",
            "status": "healthy",
            "version": "1.0.0",
            "interactive_docs": "/docs",
            "redoc": "/redoc",
            "openapi_spec": "/openapi.json",
            "health_check": "/api/health"
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
