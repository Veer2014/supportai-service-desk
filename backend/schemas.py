from pydantic import BaseModel, Field
from typing import Optional


class IncidentCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    priority: str = Field(default="Medium")


class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    resolution: Optional[str] = None