import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create Your FS-Digital Vault"
      subtitle="Start securing and managing your premium digital goods today."
      footerText="Already have a Vault account?"
      footerLinkText="Sign In"
      footerLinkHref="/sign-in"
    >
      <SignUpForm />
    </AuthCard>
  );
}
