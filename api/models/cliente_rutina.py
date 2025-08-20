from sqlalchemy import Column, Integer, Date, ForeignKey
from api.db.database import Base

class ClienteDieta(Base):
    __tablename__ = "cliente_rutina"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.id"), nullable=False)
    rutina_id = Column(Integer, nullable=False)
    fecha_asignacion = Column(Date, nullable=False)
