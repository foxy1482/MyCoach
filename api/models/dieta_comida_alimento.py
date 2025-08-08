from sqlalchemy import Column, Integer, ForeignKey
from api.db.database import Base

class DietaComidaAlimento(Base):
    __tablename__ = "dieta_comida_alimento"
    
    id = Column(Integer, primary_key=True, index=True)
    dieta_comida_id = Column(Integer, ForeignKey("dieta_comida.id"), nullable=False)
    alimento_id = Column(Integer, ForeignKey("alimento.id"), nullable=False)
    cantidad_g = Column(Integer, nullable=False)