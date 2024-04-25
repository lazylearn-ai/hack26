from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from report_service.routers import report_router

app = FastAPI(
    title="LAZYLEARN AI AGENT"
)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(report_router,
                   prefix="/report",
                   tags=["Report Generation"])
