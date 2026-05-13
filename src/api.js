const TOKEN_KEY = "whoami_ar_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(url, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || `Request failed: ${res.status}`);
  }
  return data;
}

export async function login(username, password) {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch("/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }
  setToken(data.access_token);
  return data;
}

export async function register(username, email, password) {
  return request("/api/users/", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export async function getCurrentUser() {
  return request("/api/users/me");
}

export async function listRooms(skip = 0, limit = 20) {
  return request(`/api/rooms/?skip=${skip}&limit=${limit}`);
}

export async function getRoom(roomId) {
  return request(`/api/rooms/${roomId}`);
}

export async function createRoom(name, maxPlayers = 10) {
  return request("/api/rooms/", {
    method: "POST",
    body: JSON.stringify({ name, max_players: maxPlayers }),
  });
}

export async function deleteRoom(roomId) {
  return request(`/api/rooms/${roomId}`, { method: "DELETE" });
}

export async function joinRoom(roomId) {
  return request(`/api/rooms/${roomId}/join`, { method: "POST" });
}

export async function leaveRoom(roomId) {
  return request(`/api/rooms/${roomId}/leave`, { method: "POST" });
}

export async function getRoomPlayers(roomId) {
  return request(`/api/rooms/${roomId}/players`);
}
