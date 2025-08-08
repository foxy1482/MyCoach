from sqlalchemy import Column, Integer, String, ForeignKey
from api.db.database import Base

class Plan(Base):
    __tablename__ = "plan"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(20), nullable=False)
    precio = Column(Integer, nullable=False)
    periodo_id = Column(Integer, ForeignKey("plan_periodo.id"), nullable=False)