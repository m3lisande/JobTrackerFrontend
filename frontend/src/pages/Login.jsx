import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="page" style={{ justifyContent: "center" }}>
      <SignIn afterSignInUrl="/post-login" />
    </div>
  );
}
