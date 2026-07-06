import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./satellite_cache.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class LiveLocation(Base):
    __tablename__ = "live_locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, default="Unknown")
    lat = Column(Float, index=True)
    lon = Column(Float, index=True)
    bbox = Column(String)  # Comma separated "minLon,minLat,maxLon,maxLat"
    last_updated = Column(DateTime, default=datetime.utcnow)
    image_path = Column(String)  # Path to the locally saved PNG image

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Create the cache directory if it doesn't exist
    if not os.path.exists("./tile_cache"):
        os.makedirs("./tile_cache")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
