from sqlalchemy import Column, Integer, String, ForeignKey
from api.db.database import Base

class Dieta(Base):
    __tablename__ = "dieta"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False)
    descripcion = Column(String, nullable=False)