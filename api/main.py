from fastapi import FastAPI
from api.db.database import Base, engine
from api.auth.routers import router as routerAuth
from api.routers import cliente, cliente_rutina, cliente_plan, cliente_dieta, rutina, ejercicio, rutina_ejercicio, plan, plan_periodo, dieta, alimento, dieta_comida, dieta_comida_alimento, pesaje
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(routerAuth.router)
app.include_router(cliente.router)
app.include_router(rutina.router)
app.include_router(ejercicio.router)
app.include_router(rutina_ejercicio.router)
app.include_router(plan.router)
app.include_router(plan_periodo.router)
app.include_router(cliente_dieta.router)
app.include_router(cliente_rutina.router)
app.include_router(cliente_plan.router)
app.include_router(dieta.router)
app.include_router(alimento.router)
app.include_router(dieta_comida.router)
app.include_router(dieta_comida_alimento.router)
app.include_router(pesaje.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
