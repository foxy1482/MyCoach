from sqlalchemy import Column, Integer, String, ForeignKey
from api.db.database import Base

class Cliente(Base):
    __tablename__ = "cliente"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    edad = Column(Integer, nullable=True)
    sexo = Column(String, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=True)