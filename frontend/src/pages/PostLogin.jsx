import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function PostLogin() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isLoaded) return;
      if (!user?.id) {
        navigate("/login");
        return;
      }

      try {
        setError("");
        const url = new URL(`${API_BASE_URL}/role`);
        url.searchParams.set("user_id", user.id);

        const res = await fetch(url.toString(), { method: "GET" });
        const text = await res.text();

        if (!res.ok) {
          // If backend doesn't know this user yet, send them to role selection.
          if (res.status === 404) {
            navigate("/choose-role");
            return;
          }
          throw new Error(text || `Role lookup failed (${res.status})`);
        }

        const data = text ? JSON.parse(text) : null;
        const role = data?.role;

        if (cancelled) return;

        if (role === "company") {
          navigate("/company");
        } else if (role === "job_seeker") {
          navigate("/job-offers");
        } else {
          navigate("/choose-role");
        }
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Failed to load role");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, user?.id, navigate]);

  if (!isLoaded) return <div className="page">Loading…</div>;

  return (
    <div className="page">
      <h2>Signing you in…</h2>
      {user?.id ? (
        <p style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.5rem" }}>
          <code>{user.id}</code>
        </p>
      ) : null}
      {error ? <p style={{ color: "#e57373", marginTop: "1rem" }}>{error}</p> : null}
    </div>
  );
}
