from datetime import datetime
from typing import List, Optional, Generic, TypeVar

from pydantic import BaseModel, EmailStr
from pydantic.generics import GenericModel

T = TypeVar("T")


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None


class UserRead(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: int
    created_at: datetime

    class Config:
        from_attributes = True


class RoomCreate(BaseModel):
    name: str
    max_players: int = 10


class RoomUpdate(BaseModel):
    name: Optional[str] = None
    max_players: Optional[int] = None
    status: Optional[str] = None


class RoomRead(BaseModel):
    id: int
    name: str
    created_by: int
    max_players: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class RoomPlayerRead(BaseModel):
    id: int
    room_id: int
    user_id: int
    hero_index: Optional[int] = None
    username: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class PaginatedResponse(GenericModel, Generic[T]):
    items: List[T]
    total: int
    skip: int
    limit: int
