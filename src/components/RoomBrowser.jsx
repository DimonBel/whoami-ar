import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext.jsx";
import {
  listRooms,
  createRoom,
  deleteRoom,
  joinRoom,
  leaveRoom,
} from "../api.js";

export default function RoomBrowser({ onEnterRoom }) {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomMax, setNewRoomMax] = useState(10);
  const LIMIT = 10;

  function loadRooms() {
    listRooms(skip, LIMIT).then((data) => {
      setRooms(data.items);
      setTotal(data.total);
    });
  }

  useEffect(() => {
    loadRooms();
  }, [skip]);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      await createRoom(newRoomName, newRoomMax);
      setNewRoomName("");
      setNewRoomMax(10);
      setShowForm(false);
      loadRooms();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(roomId) {
    if (!confirm("Delete this room?")) return;
    try {
      await deleteRoom(roomId);
      loadRooms();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleJoin(roomId) {
    try {
      const playerData = await joinRoom(roomId);
      onEnterRoom(roomId, playerData.hero_index);
    } catch (err) {
      alert(err.message);
    }
  }

  const isAdmin = user?.role === "ADMIN";
  const hasMore = skip + LIMIT < total;
  const hasPrev = skip > 0;

  return (
    <div className="room-browser">
      <div className="room-browser-header">
        <h2>Rooms</h2>
        <div className="header-actions">
          <span className="user-info">
            {user?.username} ({user?.role})
          </span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {isAdmin && (
        <div className="room-create-bar">
          <button className="btn-create" onClick={() => setShowForm(true)}>
            + Create Room
          </button>
        </div>
      )}

      {rooms.length === 0 ? (
        <p className="room-empty">No rooms available yet</p>
      ) : (
        <ul className="room-list">
          {rooms.map((room) => (
            <li key={room.id} className="room-item">
              <div className="room-item-info">
                <h3>{room.name}</h3>
                <span>
                  Status: {room.status} | Max: {room.max_players}
                </span>
              </div>
              <div className="room-item-actions">
                <button className="btn-join" onClick={() => handleJoin(room.id)}>
                  Join
                </button>
                {isAdmin && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {(hasPrev || hasMore) && (
        <div className="room-pagination">
          {hasPrev && (
            <button onClick={() => setSkip(Math.max(0, skip - LIMIT))}>
              Prev
            </button>
          )}
          {hasMore && (
            <button onClick={() => setSkip(skip + LIMIT)}>Next</button>
          )}
        </div>
      )}

      {showForm && (
        <div className="room-form-overlay" onClick={() => setShowForm(false)}>
          <form
            className="room-form"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreate}
          >
            <h3>Create Room</h3>
            <input
              type="text"
              placeholder="Room name"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Max players"
              value={newRoomMax}
              onChange={(e) => setNewRoomMax(parseInt(e.target.value) || 10)}
              min={2}
              max={30}
            />
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
