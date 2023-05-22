from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

DATABASE_URL = "postgresql://deepturn:burrito@localhost/deepturnS1"

engine = create_engine(DATABASE_URL)

#if you don't want to install postgres or any database, use sqlite, a file system based database, 


# Create a new sessionmaker instance
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

# Then use SessionLocal to get a new Session
db = SessionLocal()