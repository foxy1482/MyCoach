from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from api.db.database import Base

class Ejercicio(Base):
    __tablename__ = "ejercicio"
    
    id = Column(Integer, primary_key=True, index = True)
    nombre = Column(String, nullable=False)
    grupo_muscular = Column(String, nullable=False)