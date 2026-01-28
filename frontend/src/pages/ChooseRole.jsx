import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ChooseRole() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return <div>Loading…</div>;

  async function setRole(role) {
    if (!user) throw new Error("You must be signed in to select a role.");
    // publicMetadata is not client-writable; use unsafeMetadata from the frontend.
    await user.update({ unsafeMetadata: { role } });
  }

  return (
    <div>
      <h2>Select your role:</h2>
      {!user ? (
        <p>You’re not signed in. Please sign in first.</p>
      ) : null}

      <button
        disabled={isSaving || !user}
        onClick={async () => {
          setError("");
          setIsSaving(true);
          try {
            await setRole("job_seeker");
            navigate("/");
          } catch (e) {
            setError(e?.message || "Failed to save role");
          } finally {
            setIsSaving(false);
          }
        }}
      >
        {isSaving ? "Saving..." : "Job Seeker"}
      </button>
      <button
        disabled={isSaving || !user}
        onClick={async () => {
          setError("");
          setIsSaving(true);
          try {
            await setRole("company");
            navigate("/company/job-offers/new");
          } catch (e) {
            setError(e?.message || "Failed to save role");
          } finally {
            setIsSaving(false);
          }
        }}
      >
        {isSaving ? "Saving..." : "Company"}
      </button>

      {error ? (
        <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>
      ) : null}
    </div>
  );
}
