import { useState } from "react";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function CreateJobOffer() {
  const [company, setCompany] = useState("Acme Corp");
  const [title, setTitle] = useState("Frontend Engineer");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("OPEN");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsSubmitting(true);

    try {
      const body = {
        company: company.trim(),
        role: title.trim(),
        status,
        ...(description.trim() ? { description: description.trim() } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/job_offers`, {
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

      setResult(data ?? { ok: true });
    } catch (err) {
      setError(err?.message || "Failed to create job offer");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1>Create a job offer</h1>
      <p>Posts to: {`${API_BASE_URL}/job_offers`}</p>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: 12 }}>
          <label>
            Company
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corp"
              style={{ width: "100%" }}
              required
            />
          </label>

          <label>
            Title
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Frontend Engineer"
              style={{ width: "100%" }}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this role about?"
              rows={5}
              style={{ width: "100%" }}
            />
          </label>

          <label>
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="OPEN">OPEN</option>
              <option value="CLOSED">CLOSED</option>
              <option value="DRAFT">DRAFT</option>
            </select>
          </label>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create job offer"}
          </button>
        </div>
      </form>

      {error ? (
        <pre style={{ marginTop: 16, color: "crimson", whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      ) : null}

      {result ? (
        <pre style={{ marginTop: 16, whiteSpace: "pre-wrap" }}>
          {typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
