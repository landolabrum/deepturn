from sqlalchemy import Column, String, Integer, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

user_agent_brand_association = Table(
    'user_agent_brand_association',
    Base.metadata,
    Column('user_agent_id', String, ForeignKey('user_agents.id')),
    Column('brand_id', Integer, ForeignKey('brands.id'))
)

class UserAgent(Base):
    __tablename__ = "user_agents"

    id = Column(String, primary_key=True, unique=True)
    user_agent = Column(String, nullable=True)
    public_ip = Column(String, nullable=True)
    local_ip = Column(String, nullable=True)
    router_ip = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    brands = relationship("Brand", secondary=user_agent_brand_association, back_populates="user_agents")

    def __repr__(self):
        return f"UserAgent(id={self.id}, user_agent={self.user_agent}, publicIp={self.public_ip})"

class Brand(Base):
    __tablename__ = 'brands'

    id = Column(Integer, primary_key=True, autoincrement=True)
    brand = Column(String)
    version = Column(String)

    user_agents = relationship("UserAgent", secondary=user_agent_brand_association, back_populates="brands")

    def __repr__(self):
        return f"Brand(id={self.id}, brand={self.brand}, version={self.version})"
