from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.auth.schemas import usuario, token
from api.auth.models import usuario as usuarioModel
from api.db.database import SessionLocal
from api.core import security
from api.core.dependencies import get_current_user, role_required
from api.core.database import get_db
import uuid
import os
from datetime import datetime, timedelta
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

router = APIRouter(prefix="/auth", tags=["Auth"])

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS"),
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS"),
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS")
)

async def enviar_correo_reseteo(to_email: str, reset_token: str):
    html_body = f"""
        <html>
            <body style="font-family: Arial, font-size: 32px, sans-serif; line-height: 1.5;">
                <h2 style="color: #2c3e50;">MYCOACH AUTH SYSTEM</h2>
                <p style="font-size: 14px">Hola,</p>
                <p style="font-size: 14px">
                    Usá este token para <strong>resetear tu contraseña</strong>:
                    <span style="font-size: 14px; color: #48e;">
                        {reset_token}
                    </span>
                </p>
                <p style="font-size: 14px">Si no solicitaste este cambio, podés ignorar este correo.</p>
            </body>
        </html>
        """
    message = MessageSchema(
        subject="Recuperación de contraseña de MyCoach",
        recipients=[to_email],
        body= html_body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)

reset_tokens = {}

@router.get("/solo-admin")
def endpoint_admin(user=Depends(role_required("admin"))):
    return {"msg": f"Hola {user.nombre}, eres admin"}

@router.get("/solo-clientes")
def endpoint_cliente(user=Depends(role_required("usuario", "admin"))):
    return {"detail" : {"msg": f"Hola {user.nombre}, tienes acceso como cliente"}}

@router.post("/perfil")
def obtener_perfil(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "rol": current_user.rol
    }

@router.post("/registro", response_model=token.TokenData)
def register(usuario: usuario.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.email == usuario.email).first()
    if db_usuario:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    hashed_password = security.hashear_password(usuario.password)
    nuevo_usuario = usuarioModel.Usuario(username=usuario.username, email=usuario.email, hashed_password=hashed_password)
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    token = security.crear_token_acceso({"sub": str(nuevo_usuario.id)})
    return {"token": token}

@router.post("/login", response_model=token.TokenData)
def login(usuario: usuario.UsuarioLogin, db: Session = Depends(get_db)):
    
    db_usuario = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.username == usuario.username).first()
    if not db_usuario or not security.verificar_password(usuario.password, db_usuario.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    token = security.crear_token_acceso({"sub": str(db_usuario.id)})
    return {"token": token}

@router.post("/forgot-password")
async def forgot_password(request: usuario.UsuarioForgotPWD, db: Session = Depends(get_db)):
    user = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    reset_token = security.crear_token_reseteo(user.id)
    reset_link = f"http://localhost:5173/reset-password?token={reset_token}"

    await enviar_correo_reseteo(user.email, reset_link)
    
    return {"msg": "Se ha enviado un enlace de recuperación a tu correo. ", "email" : request.email}


@router.post("/reset-password")
def change_password(request: usuario.UsuarioResetPWD, db: Session = Depends(get_db)):
    user_id = security.verificar_token_reseteo(request.token)
    if not user_id:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    user = db.query(usuarioModel.Usuario).filter(usuarioModel.Usuario.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.hashed_password = security.hashear_password(request.new_password)
    db.commit()

    return {"msg": "Contraseña restablecida con éxito."}