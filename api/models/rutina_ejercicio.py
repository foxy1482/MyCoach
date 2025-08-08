from sqlalchemy import Column, Integer, String, ForeignKey
from api.db.database import Base
from sqlalchemy.orm import relationship

class RutinaEjercicio(Base):
    __tablename__ = "rutina_ejercicio"
    
    id = Column(Integer, primary_key=True, index=True)
    rutina_id = Column(Integer, ForeignKey("rutina.id"), nullable=False)
    ejercicio_id = Column(Integer, ForeignKey("ejercicio.id"), nullable=False)
    dia = Column(String, nullable=False)
    series = Column(Integer, nullable=False)
    repeticiones = Column(Integer, nullable=False)
    rir = Column(Integer, nullable=False)
    
    rutina = relationship("Rutina", back_populates="ejercicios")
    ejercicios = relationship("Ejercicio")