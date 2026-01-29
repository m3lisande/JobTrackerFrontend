import { SignUp } from "@clerk/clerk-react";

export default function Signup() {
  return (
    <div className="page" style={{ justifyContent: "center" }}>
      <SignUp afterSignUpUrl="/choose-role" />
    </div>
  );
}
