from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime

from database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(200), nullable=False)

    description = Column(Text, nullable=False)

    priority = Column(String(20), default="Medium", nullable=False)

    status = Column(String(30), default="Open", nullable=False)

    category = Column(String(100), nullable=True)

    ai_summary = Column(Text, nullable=True)

    ai_possible_causes = Column(Text, nullable=True)

    ai_recommended_actions = Column(Text, nullable=True)

    resolution = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )