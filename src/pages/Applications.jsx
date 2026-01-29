import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Applications() {
  const { user, isLoaded } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !user?.id) {
      setLoading(false);
      return;
    }
    async function fetchApplications() {
      try {
        const url = new URL(`${API_BASE_URL}/user/applications`);
        url.searchParams.set("user_id", user.id);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to load applications");
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e?.message || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [isLoaded, user?.id]);

  if (!isLoaded) return <div className="page">Loading…</div>;
  if (!user) return <div className="page"><p>Please sign in to see your applications.</p></div>;
  if (loading) return <div className="page">Loading applications…</div>;
  if (error) return <div className="page"><p style={{ color: "#e57373" }}>{error}</p></div>;

  return (
    <div className="page" style={{ alignItems: "stretch", textAlign: "left" }}>
      <h1>My applications</h1>
      <p style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.8)" }}>
        Jobs you have applied to.
      </p>
      {applications.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.8)" }}>
          You haven't applied to any jobs yet.{" "}
          <Link to="/job-offers" style={{ color: "#64b5f6" }}>Find a job</Link>.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: 500 }}>
          {applications.map((app) => {
            const job = app.job_offer ?? {};
            return (
              <li
                key={app.id}
                style={{
                  background: "#111",
                  border: "1px solid #222",
                  borderRadius: 12,
                  padding: "1rem 1.25rem",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {job.company_name ?? "—"}
                    </div>
                    <div style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                      {job.role ?? "—"}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 6,
                      background: "rgba(255,255,255,0.1)",
                      textTransform: "capitalize",
                    }}
                  >
                    {job.status ?? "—"}
                  </span>
                </div>
                {(app.created_at || app.applied_at) && (
                  <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
                    Applied {formatDate(app.created_at ?? app.applied_at)}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
