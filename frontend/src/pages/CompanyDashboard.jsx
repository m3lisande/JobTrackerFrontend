import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function CompanyDashboard() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobOffers, setJobOffers] = useState(null);

  const [applicationsByJob, setApplicationsByJob] = useState({});
  const [loadingJobId, setLoadingJobId] = useState(null);
  const [closingOfferId, setClosingOfferId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isLoaded || !user?.id) return;

      setIsLoading(true);
      setError("");
      try {
        const url = new URL(`${API_BASE_URL}/company/job_offers`);
        url.searchParams.set("company_id", user.id);

        const res = await fetch(url.toString());
        const text = await res.text();
        if (!res.ok) throw new Error(text || `Fetch failed (${res.status})`);

        const data = text ? JSON.parse(text) : [];
        if (!cancelled) setJobOffers(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load job offers");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, user?.id]);

  async function loadApplications(jobOfferId) {
    // Toggle behavior: hide if already loaded
    if (applicationsByJob[jobOfferId]) {
      setApplicationsByJob((prev) => {
        const copy = { ...prev };
        delete copy[jobOfferId];
        return copy;
      });
      return;
    }

    setLoadingJobId(jobOfferId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/company/job_offers/${jobOfferId}`
      );
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to load applications");

      const data = text ? JSON.parse(text) : [];
      setApplicationsByJob((prev) => ({
        ...prev,
        [jobOfferId]: data,
      }));
    } catch (e) {
      alert(e?.message || "Failed to load applications");
    } finally {
      setLoadingJobId(null);
    }
  }

  async function closeOffer(offerId) {
    setClosingOfferId(offerId);
    try {
      const res = await fetch(`${API_BASE_URL}/company/job_offers/${offerId}`, {
        method: "PUT",
      });
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to close offer");

      const updated = text ? JSON.parse(text) : null;
      if (updated) {
        setJobOffers((prev) =>
          Array.isArray(prev)
            ? prev.map((j) => (j.id === offerId ? updated : j))
            : prev
        );
        setApplicationsByJob((prev) => {
          const next = { ...prev };
          delete next[offerId];
          return next;
        });
      }
    } catch (e) {
      alert(e?.message || "Failed to close offer");
    } finally {
      setClosingOfferId(null);
    }
  }

  if (!isLoaded) return <div className="page">Loading…</div>;

  return (
    <div className="page" style={{ alignItems: "stretch", textAlign: "left" }}>
      <h1>Company dashboard</h1>
      {!user?.id && <p>Please sign in.</p>}

      <p style={{ marginBottom: "1.5rem" }}>
        <Link to="/company/job-offers/new" style={{ padding: "0.5rem 1rem", background: "#1565c0", borderRadius: 8 }}>
          Create job offer
        </Link>
      </p>

      {isLoading && <p style={{ color: "rgba(255,255,255,0.8)" }}>Loading job offers…</p>}
      {error && <p style={{ color: "#e57373" }}>{error}</p>}

      <h3 style={{ width: "100%", maxWidth: 500, marginTop: "1rem" }}>Your job offers</h3>

      {Array.isArray(jobOffers) &&
        jobOffers.map((job) => (
          <div
            key={job.id}
            style={{
              width: "100%",
              maxWidth: 500,
              border: "1px solid #222",
              borderRadius: 12,
              padding: "1rem 1.25rem",
              marginBottom: 12,
              background: "#111",
            }}
          >
            <strong>{job.role}</strong>
            <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: 4 }}>
              Status: {job.status}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <button
                onClick={() => loadApplications(job.id)}
                disabled={loadingJobId === job.id}
              >
                {loadingJobId === job.id
                  ? "Loading…"
                  : applicationsByJob[job.id]
                  ? "Hide applications"
                  : "View applications"}
              </button>
              {job.status !== "CLOSED" && (
                <button
                  onClick={() => closeOffer(job.id)}
                  disabled={closingOfferId === job.id}
                  style={{ background: "#b71c1c", color: "#fff" }}
                >
                  {closingOfferId === job.id ? "Closing…" : "Close offer"}
                </button>
              )}
            </div>
            {applicationsByJob[job.id] && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                  Applications ({applicationsByJob[job.id].length})
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {applicationsByJob[job.id].map((app, idx) => {
                    const firstName = app.first_name ?? app.firstName ?? "—";
                    const name = app.name ?? app.last_name ?? app.lastName ?? "—";
                    const email = app.email ?? "—";
                    return (
                      <li
                        key={app.id ?? idx}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 8,
                          padding: "0.75rem 1rem",
                          marginBottom: 8,
                          display: "grid",
                          gap: 4,
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
                          <span style={{ color: "rgba(255,255,255,0.6)", minWidth: 80 }}>First name</span>
                          <span style={{ color: "#fff" }}>{firstName}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
                          <span style={{ color: "rgba(255,255,255,0.6)", minWidth: 80 }}>Name</span>
                          <span style={{ color: "#fff" }}>{name}</span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 1rem" }}>
                          <span style={{ color: "rgba(255,255,255,0.6)", minWidth: 80 }}>Email</span>
                          <a href={`mailto:${email}`} style={{ color: "#64b5f6", textDecoration: "none" }}>
                            {email}
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}
