import random

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user, require_role
from database import get_db
from models import User, Room, RoomPlayer
from schemas import (
    RoomCreate,
    RoomRead,
    RoomUpdate,
    RoomPlayerRead,
    PaginatedResponse,
)

router = APIRouter(prefix="/api/rooms", tags=["Rooms"])

NUM_HEROES = 30


@router.post(
    "/",
    response_model=RoomRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new room (admin only)",
)
def create_room(
    room_in: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    room = Room(
        name=room_in.name,
        created_by=current_user.id,
        max_players=room_in.max_players,
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


@router.get(
    "/",
    response_model=PaginatedResponse[RoomRead],
    summary="List rooms (paginated)",
)
def list_rooms(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = db.query(Room).count()
    rooms = db.query(Room).offset(skip).limit(limit).all()
    return PaginatedResponse[RoomRead](
        items=rooms, total=total, skip=skip, limit=limit
    )


@router.get(
    "/{room_id}",
    response_model=RoomRead,
    summary="Get room details",
)
def get_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return room


@router.put(
    "/{room_id}",
    response_model=RoomRead,
    summary="Update room (admin only)",
)
def update_room(
    room_id: int,
    room_in: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    if room_in.name is not None:
        room.name = room_in.name
    if room_in.max_players is not None:
        room.max_players = room_in.max_players
    if room_in.status is not None:
        if room_in.status not in ("waiting", "in_game", "finished"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status must be waiting, in_game, or finished",
            )
        room.status = room_in.status
    db.commit()
    db.refresh(room)
    return room


@router.delete(
    "/{room_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete room (admin only)",
)
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("ADMIN")),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id).delete()
    db.delete(room)
    db.commit()


@router.get(
    "/{room_id}/players",
    response_model=PaginatedResponse[RoomPlayerRead],
    summary="List players in a room",
)
def list_room_players(
    room_id: int,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    query = db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id)
    total = query.count()
    players = query.offset(skip).limit(limit).all()
    items = []
    for p in players:
        user = db.query(User).filter(User.id == p.user_id).first()
        items.append(
            RoomPlayerRead(
                id=p.id,
                room_id=p.room_id,
                user_id=p.user_id,
                hero_index=p.hero_index,
                username=user.username if user else None,
            )
        )
    return PaginatedResponse[RoomPlayerRead](
        items=items, total=total, skip=skip, limit=limit
    )


@router.post(
    "/{room_id}/join",
    response_model=RoomPlayerRead,
    status_code=status.HTTP_201_CREATED,
    summary="Join a room and get assigned a hero",
)
def join_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    if room.status == "finished":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Room is finished",
        )

    existing = (
        db.query(RoomPlayer)
        .filter(
            RoomPlayer.room_id == room_id, RoomPlayer.user_id == current_user.id
        )
        .first()
    )
    if existing:
        user = db.query(User).filter(User.id == existing.user_id).first()
        return RoomPlayerRead(
            id=existing.id,
            room_id=existing.room_id,
            user_id=existing.user_id,
            hero_index=existing.hero_index,
            username=user.username if user else None,
        )

    player_count = (
        db.query(RoomPlayer).filter(RoomPlayer.room_id == room_id).count()
    )
    if player_count >= room.max_players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Room is full"
        )

    picked_indices = [
        p.hero_index
        for p in db.query(RoomPlayer)
        .filter(RoomPlayer.room_id == room_id, RoomPlayer.hero_index.isnot(None))
        .all()
    ]
    available = [i for i in range(NUM_HEROES) if i not in picked_indices]
    if not available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No heroes available",
        )
    hero_index = random.choice(available)

    room_player = RoomPlayer(
        room_id=room_id, user_id=current_user.id, hero_index=hero_index
    )
    db.add(room_player)

    if room.status == "waiting" and player_count + 1 >= 2:
        room.status = "in_game"

    db.commit()
    db.refresh(room_player)

    return RoomPlayerRead(
        id=room_player.id,
        room_id=room_player.room_id,
        user_id=room_player.user_id,
        hero_index=room_player.hero_index,
        username=current_user.username,
    )


@router.post(
    "/{room_id}/leave",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Leave a room",
)
def leave_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    room_player = (
        db.query(RoomPlayer)
        .filter(
            RoomPlayer.room_id == room_id, RoomPlayer.user_id == current_user.id
        )
        .first()
    )
    if not room_player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="You are not in this room"
        )
    db.delete(room_player)
    db.commit()
