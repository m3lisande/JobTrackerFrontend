import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Job Tracker</h1>
      <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
    </div>
  );
}
