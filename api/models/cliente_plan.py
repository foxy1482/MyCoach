from sqlalchemy import Column, Integer, Boolean, Date, ForeignKey
from api.db.database import Base

class ClientePlan(Base):
    __tablename__ = "cliente_plan"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.id"), nullable=False)
    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    activo = Column(Boolean, nullable=False)
