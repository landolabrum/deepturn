from sqlalchemy import Column, String, Integer, JSON, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

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
    user_agent = Column(String, nullable=True)   # Set nullable=True
    user_agent_data = Column(JSON, nullable=True)  # Set nullable=True
    public_ip = Column(String, nullable=True)  # Set nullable=True
    local_ip = Column(String, nullable=True)  # Set nullable=True
    router_ip = Column(String, nullable=True)  # Set nullable=True

    brands = relationship("Brand", secondary=user_agent_brand_association, back_populates="user_agents")

    def __repr__(self):
        return f"UserAgent(id={self.id}, user_agent={self.user_agent}, user_agent_data={self.user_agent_data}, publicIp={self.public_ip})"

class Brand(Base):
    __tablename__ = 'brands'

    id = Column(Integer, primary_key=True, autoincrement=True)
    brand = Column(String, unique=True)
    version = Column(String)

    user_agents = relationship("UserAgent", secondary=user_agent_brand_association, back_populates="brands")

    def __repr__(self):
        return f"Brand(id={self.id}, brand={self.brand}, version={self.version})"
