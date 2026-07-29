from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Order, Technician


SEED_TECHNICIANS = [
    {"id": 1, "name": "小雅", "rating": 4.9, "distance": 0.8, "price": 199},
    {"id": 2, "name": "阿强", "rating": 4.8, "distance": 1.5, "price": 239},
    {"id": 3, "name": "李师傅", "rating": 4.7, "distance": 2.3, "price": 299},
]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Technician).count() == 0:
            db.add_all(Technician(**technician) for technician in SEED_TECHNICIANS)
            db.commit()
    finally:
        db.close()
    yield


app = FastAPI(title="罗汉到家 MVP API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class OrderCreate(BaseModel):
    technician_id: int
    service_name: str
    price: int
    date: str
    time: str


class OrderStatusUpdate(BaseModel):
    status: int


def serialize_order(order: Order, technician_name: str):
    return {
        "id": order.id,
        "technician_id": order.technician_id,
        "technician_name": technician_name,
        "service_name": order.service_name,
        "price": order.price,
        "date": order.date,
        "time": order.time,
        "status": order.status,
        "created_at": order.created_at.isoformat(),
    }


@app.get("/technicians")
def get_technicians(db: Session = Depends(get_db)):
    return db.query(Technician).order_by(Technician.distance).all()


@app.post("/orders")
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    technician = db.get(Technician, payload.technician_id)
    if not technician:
        raise HTTPException(status_code=404, detail="技师不存在")

    order = Order(**payload.model_dump(), status=0, created_at=datetime.utcnow())
    db.add(order)
    db.commit()
    db.refresh(order)
    return serialize_order(order, technician.name)


@app.get("/orders")
def get_orders(db: Session = Depends(get_db)):
    rows = (
        db.query(Order, Technician.name)
        .join(Technician, Technician.id == Order.technician_id)
        .order_by(Order.created_at.desc(), Order.id.desc())
        .all()
    )
    return [serialize_order(order, technician_name) for order, technician_name in rows]


@app.put("/orders/{order_id}/status")
def update_order_status(order_id: int, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    if payload.status not in range(4):
        raise HTTPException(status_code=400, detail="状态只能是 0 到 3")

    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="订单不存在")

    order.status = payload.status
    db.commit()
    db.refresh(order)
    technician = db.get(Technician, order.technician_id)
    return serialize_order(order, technician.name)
