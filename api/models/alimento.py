from sqlalchemy import Column, Integer, String, Float
from api.db.database import Base

class Alimento(Base):
    __tablename__ = "alimento"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    calorias_100g = Column(Integer, nullable=False)
    proteinas = Column(Float, nullable=False)
    grasas = Column(Float, nullable=False)
    carbohidratos = Column(Float, nullable=False)