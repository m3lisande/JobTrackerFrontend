import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Header() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation(); // <-- get current page path

  // Hide header on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup" ) return null;

  if (!isLoaded) return null;

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <header>
      <Link to="/">JobTracker</Link>
      {user ? (
        <div>
          <span style={{ marginRight: "0.75rem", color: "rgba(255,255,255,0.9)" }}>
            Hi, {user.firstName}
          </span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            to="/login"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              background: "#1a1a1a",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 8,
              background: "#1565c0",
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
