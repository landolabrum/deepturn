from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from db.userAgent.models import Base

#  POSTGRES

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel

#  POSTGRES

origins = [
    "http://tiktok.soy:3000",
    "http://tiktok.soy",
    "http://192.168.86.1",
    "http://0.0.0.0:3000/", 
    "http://0.0.0.0:3000/authentication", 
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3001/",
    "https://deepturn.com",
    "https://deepturn.com/",
    "https://deepturn.com/authenticate",
    "192.168.86.135",
    "192.168.86.34",
    "https://www.deepturn.com",
    "192.168.86.1",
    "0.0.0.0"
    ]


DATABASE_URL = settings.DATABASE_URL
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

 

	
def start_application():
    app = FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app

app = start_application()