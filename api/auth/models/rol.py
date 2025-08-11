from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from api.db.database import Base

class Rol(Base):
    __tablename__ = "rol"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, nullable=False)

    usuario = relationship("Usuario", back_populates="rol")