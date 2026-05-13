import { useState } from "react";
import { login, register } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function AuthScreen() {
  const { setUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        await register(username, email, password);
        await login(username, password);
      } else {
        await login(username, password);
      }
      const { getCurrentUser } = await import("../api.js");
      const user = await getCurrentUser();
      setUser(user);
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleMode() {
    setIsRegister((prev) => !prev);
    setError("");
  }

  return (
    <div className="auth-screen">
      <div className="auth-header">
        <h1>WHO AM I</h1>
        <span>AR Edition</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        {isRegister && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-submit">
          {isRegister ? "Register" : "Login"}
        </button>

        <div className="auth-toggle">
          {isRegister ? (
            <span>
              Already have an account?{" "}
              <button type="button" className="auth-link" onClick={toggleMode}>
                Login
              </button>
            </span>
          ) : (
            <span>
              New here?{" "}
              <button type="button" className="auth-link" onClick={toggleMode}>
                Register
              </button>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
