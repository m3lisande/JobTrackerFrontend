import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const API_BASE_URL = "http://127.0.0.1:5000/api";

export default function CreateJobOffer() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!isLoaded) throw new Error("User not loaded yet.");
      if (!user?.id) throw new Error("You must be signed in to create a job offer.");

      const body = {
        company_id: user.id,
        company_name: companyName.trim(),
        role: role.trim(),
        status,
      };

      const res = await fetch(`${API_BASE_URL}/company/job_offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data?.message || `Request failed (${res.status})`
        );
      }
      navigate("/company");
    } catch (err) {
      setError(err?.message || "Failed to create job offer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page" style={{ alignItems: "stretch", textAlign: "left", maxWidth: 420 }}>
      <h1>Create a job offer</h1>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", marginBottom: 4, fontSize: "0.9rem" }}>Company name</span>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Corp"
              style={{ width: "100%", padding: "0.6rem" }}
              required
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", marginBottom: 4, fontSize: "0.9rem" }}>Role</span>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Frontend Engineer"
              style={{ width: "100%", padding: "0.6rem" }}
              required
            />
          </label>
          <label style={{ display: "block" }}>
            <span style={{ display: "block", marginBottom: 4, fontSize: "0.9rem" }}>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: "0.6rem" }}>
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </label>
          <button type="submit" disabled={isSubmitting} style={{ marginTop: "0.5rem", padding: "0.75rem" }}>
            {isSubmitting ? "Creating…" : "Create job offer"}
          </button>
        </div>
      </form>

      {error ? (
        <p style={{ marginTop: "1rem", color: "#e57373", fontSize: "0.9rem" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
