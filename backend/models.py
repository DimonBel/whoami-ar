from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="PLAYER", nullable=False)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    rooms = relationship("RoomPlayer", back_populates="user")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    max_players = Column(Integer, default=10)
    status = Column(String, default="waiting")
    created_at = Column(DateTime, default=datetime.utcnow)

    players = relationship("RoomPlayer", back_populates="room")


class RoomPlayer(Base):
    __tablename__ = "room_players"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hero_index = Column(Integer, nullable=True)

    room = relationship("Room", back_populates="players")
    user = relationship("User", back_populates="rooms")
