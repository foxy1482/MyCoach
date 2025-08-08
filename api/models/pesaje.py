from sqlalchemy import Column, Integer, Float, Date, ForeignKey
from api.db.database import Base

class Pesaje(Base):
    __tablename__ = "pesaje"
    
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("cliente.id"))
    fecha = Column(Date, nullable=False)
    peso = Column(Float, nullable=False)
    grasa_corporal = Column(Float, nullable=False)
