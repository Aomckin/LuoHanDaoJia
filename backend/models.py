from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from database import Base


class Technician(Base):
    __tablename__ = "technicians"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    distance = Column(Float, nullable=False)
    price = Column(Integer, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)
    technician_id = Column(Integer, ForeignKey("technicians.id"), nullable=False)
    service_name = Column(String, nullable=False)
    price = Column(Integer, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    status = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
