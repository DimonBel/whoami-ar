import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import User
from auth import get_password_hash

Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@whoami-ar.local",
                hashed_password=get_password_hash("admin123"),
                role="ADMIN",
            )
            db.add(admin)
            db.commit()
            print("Created admin user: admin / admin123")
        else:
            print("Admin user already exists")

        demo = db.query(User).filter(User.username == "player1").first()
        if not demo:
            demo = User(
                username="player1",
                email="player1@whoami-ar.local",
                hashed_password=get_password_hash("player123"),
                role="PLAYER",
            )
            db.add(demo)
            db.commit()
            print("Created demo player: player1 / player123")
        else:
            print("Demo player already exists")

    finally:
        db.close()


if __name__ == "__main__":
    seed()
