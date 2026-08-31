import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome to FS-Digital Vault"
      subtitle="Sign in to access your secured digital goods & licenses."
      footerText="Don't have an FS-Digital Vault yet?"
      footerLinkText="Create Account"
      footerLinkHref="/sign-up"
    >
      <SignInForm />
    </AuthCard>
  );
}
