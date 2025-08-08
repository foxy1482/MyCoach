from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from api.db.database import Base

class Rutina(Base):
    __tablename__ = "rutina"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False)
    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False)
    es_personalizada = Column(Boolean, nullable=False)
    
    ejercicios = relationship("RutinaEjercicio", back_populates="rutina")