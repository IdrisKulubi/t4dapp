import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignupCard } from "@/components/auth/signup-card";

interface SignupPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  // If user is already authenticated, redirect them
  if (session?.user) {
    redirect(callbackUrl || "/apply");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <SignupCard callbackUrl={callbackUrl}  />
    </div>
  );
} 