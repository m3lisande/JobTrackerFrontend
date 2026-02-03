import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
export default function ChooseRole() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!isLoaded) return <div>Loading...</div>;

  async function setRole(role) {
    setLoading(true);
    try {
      const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null;
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          role,
          first_name: user.firstName ?? null,
          last_name: user.lastName ?? null,
          email,
        }),
      });

      if (!response.ok) throw new Error("Failed to save role");

      const data = await response.json();
      console.log("Role saved:", data);

      if (role === "company") navigate("/company");
      else navigate("/job-offers");
    } catch (err) {
      console.error(err);
      alert("Error saving role. See console.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h2>Select your role</h2>
      <p style={{ marginBottom: "1.5rem", color: "rgba(255,255,255,0.8)" }}>
        How do you want to use JobTracker?
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          style={{ padding: "1rem 1.5rem", minWidth: 140 }}
          disabled={loading}
          onClick={() => setRole("job_seeker")}
        >
          Job Seeker
        </button>
        <button
          style={{ padding: "1rem 1.5rem", minWidth: 140 }}
          disabled={loading}
          onClick={() => setRole("company")}
        >
          Company
        </button>
      </div>
    </div>
  );
}
