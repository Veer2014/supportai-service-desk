from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Incident
from schemas import IncidentCreate, IncidentUpdate
from ai_service import analyze_incident


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(title="SupportAI API")


# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "SupportAI backend is running 🚀"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# -------------------------
# INCIDENT APIs
# -------------------------


@app.post("/incidents")
def create_incident(
    incident: IncidentCreate,
    db: Session = Depends(get_db)
):
    new_incident = Incident(
        title=incident.title,
        description=incident.description,
        priority=incident.priority
    )

    db.add(new_incident)
    db.commit()
    db.refresh(new_incident)

    return new_incident


@app.get("/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = (
        db.query(Incident)
        .order_by(Incident.created_at.desc())
        .all()
    )

    return incidents


@app.get("/incidents/{incident_id}")
def get_incident(
    incident_id: int,
    db: Session = Depends(get_db)
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


@app.put("/incidents/{incident_id}")
def update_incident(
    incident_id: int,
    updates: IncidentUpdate,
    db: Session = Depends(get_db)
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    if updates.status is not None:
        incident.status = updates.status

    if updates.priority is not None:
        incident.priority = updates.priority

    if updates.resolution is not None:
        incident.resolution = updates.resolution

    db.commit()
    db.refresh(incident)

    return incident
@app.get("/incidents/{incident_id}/analyze")
def analyze_incident_endpoint(
    incident_id: int,
    db: Session = Depends(get_db)
):
    incident = (
        db.query(Incident)
        .filter(Incident.id == incident_id)
        .first()
    )

    if not incident:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    analysis = analyze_incident(
        incident.title,
        incident.description,
        incident.priority
    )

    return analysis