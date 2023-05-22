from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import List

Base = declarative_base()

# association table
user_agent_brand = Table('user_agent_brand', Base.metadata,
    Column('user_agent_id', Integer, ForeignKey('user_agents.id')),
    Column('brand_id', Integer, ForeignKey('brands.id'))
)

class Brand(Base):
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, index=True)
    version = Column(String)
    user_agents = relationship("UserAgent", secondary=user_agent_brand, back_populates="brands")

class UserAgent(Base):
    __tablename__ = "user_agents"

    id = Column(Integer, primary_key=True, index=True)
    ip_addr = Column(String)
    mobile = Column(Boolean, index=True)
    platform = Column(String)
    brands = relationship("Brand", secondary=user_agent_brand, back_populates="user_agents")

class BrandIn(BaseModel):
    brand: str
    version: str

class UserAgentIn(BaseModel):
    brands: List[BrandIn]
    mobile: bool
    ip_addr: str
    platform: str

class BrandOut(BrandIn):
    id: int

class UserAgentOut(UserAgentIn):
    id: int
    brands: List[BrandOut]

class ResponseModel(BaseModel):
    message: str
    data: UserAgentOut