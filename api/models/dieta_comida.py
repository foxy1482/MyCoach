from sqlalchemy import Column, Integer, String, ForeignKey
from api.db.database import Base

class Comida(Base):
    __tablename__ = "dieta_comida"
    
    id = Column(Integer, primary_key=True, index=True)
    dieta_id= Column(Integer, ForeignKey("dieta.id"), nullable=False)
    nombre = Column(String, nullable=False)
    orden = Column(Integer, nullable=False)