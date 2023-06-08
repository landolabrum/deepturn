from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from config import settings
from urllib.parse import urlparse

def database_exists(url):
    url = urlparse(url)
    engine = create_engine(f"{url.scheme}://{url.username}:{url.password}@{url.hostname}:{url.port}")
    try:
        insp = inspect(engine)
        return url.path[1:] in insp.get_schema_names()
    except OperationalError:
        return False

DATABASE_URL = settings.DATABASE_URL

if database_exists(DATABASE_URL):
    print("The database exists.")
else:
    print("The database does not exist.")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
