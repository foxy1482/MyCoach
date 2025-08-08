from sqlalchemy import Column, Integer, String
from api.db.database import Base

class PlanPeriodo(Base):
    __tablename__ = "plan_periodo"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)