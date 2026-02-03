import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function JobOffers() {
  const { user, isLoaded } = useUser();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [appliedOffers, setAppliedOffers] = useState(new Set());
  const [role, setRole] = useState(null);

  // Format date nicely
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Check if user has applied to a job offer
  async function checkIfApplied(offerId) {
    if (!user?.id) return false;
    try {
      const res = await fetch(
        `${API_BASE_URL}/job_offers/${offerId}/has_applied?user_id=${user.id}`
      );
      if (!res.ok) throw new Error("Failed to check application");
      const data = await res.json();
      return data.has_applied;
    } catch (e) {
      console.error("Error checking applied status:", e);
      return false;
    }
  }

  // Fetch user role
  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    let cancelled = false;
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

  // When role is company, no applied state
  useEffect(() => {
    if (role === "company") setAppliedOffers(new Set());
  }, [role]);

  // Fetch job offers and applied status (skip applied check for companies)
  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch(`${API_BASE_URL}/job_offers`);
        if (!res.ok) throw new Error("Failed to fetch job offers");
        const data = await res.json();
        setOffers(data);

        if (role === "company") {
          setAppliedOffers(new Set());
          setLoading(false);
          return;
        }
        if (!user?.id) {
          setLoading(false);
          return;
        }
        const appliedSet = new Set();
        await Promise.all(
          data.map(async (offer) => {
            const hasApplied = await checkIfApplied(offer.id);
            if (hasApplied) appliedSet.add(offer.id);
          })
        );
        setAppliedOffers(appliedSet);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchOffers();
  }, [user]);

  // Apply to job
  async function applyToJob(jobOfferId) {
    if (!user?.id) return alert("You must be signed in!");

    try {
      const res = await fetch(`${API_BASE_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, job_offer_id: jobOfferId }),
      });

      if (!res.ok) throw new Error("Failed to apply");

      setAppliedOffers((prev) => new Set(prev).add(jobOfferId));
    } catch (e) {
      alert(e.message || "Error applying to job");
    }
  }

  if (!isLoaded) return <div className="page">Loading user…</div>;
  if (loading) return <div className="page">Loading job offers…</div>;
  if (error) return <div className="page"><p style={{ color: "#e57373" }}>{error}</p></div>;

  return (
    <div className="page" style={{ alignItems: "stretch", textAlign: "left" }}>
      <h1>Job Offers</h1>
      {offers.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.8)" }}>No job offers available.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, width: "100%", maxWidth: 500 }}>
          {offers.map((offer) => {
            const hasApplied = appliedOffers.has(offer.id);
            const isCompany = role === "company";
            return (
              <li key={offer.id} className="card">
                <div>
                  <p style={{ margin: 0, fontWeight: 600 }}>{offer.role}</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>
                    {offer.company_name || "Unknown company"} • {formatDate(offer.created_at)}
                  </p>
                </div>
                {!isCompany && (
                  <button
                    onClick={() => applyToJob(offer.id)}
                    disabled={hasApplied}
                    className={hasApplied ? "applied" : "apply"}
                  >
                    {hasApplied ? "Applied!" : "Apply"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
