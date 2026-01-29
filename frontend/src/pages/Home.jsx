import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function Home() {
  const { user, isLoaded } = useUser();
  const [role, setRole] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!isLoaded || !user?.id) return;

    async function fetchRole() {
      try {
        const url = new URL(`${API_BASE_URL}/role`);
        url.searchParams.set("user_id", user.id);
        const res = await fetch(url.toString());
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.role) setRole(data.role);
      } catch {
        // ignore
      }
    }
    fetchRole();
    return () => { cancelled = true; };
  }, [isLoaded, user?.id]);

  const buttonStyle = {
    padding: "0.75rem 1.5rem",
    background: "#1565c0",
    borderRadius: 8,
    color: "#fff",
    textDecoration: "none",
    fontWeight: 500,
    display: "inline-block",
  };
  const secondaryStyle = { ...buttonStyle, background: "#1a1a1a" };

  return (
    <div className="page">
      <h1>Job Tracker</h1>
      <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem", color: "rgba(255,255,255,0.8)" }}>
        Track jobs and manage applications in one place.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <Link to="/job-offers" style={buttonStyle}>
          {role === "company" ? "See all job offers" : "Find a job"}
        </Link>
        {isLoaded && user && role === "job_seeker" && (
          <Link to="/applications" style={secondaryStyle}>
            See applications
          </Link>
        )}
        {isLoaded && user && role === "company" && (
          <Link to="/company" style={secondaryStyle}>
            Company dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
