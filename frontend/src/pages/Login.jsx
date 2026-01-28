import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return <SignIn afterSignInUrl="/choose-role" />;
}
