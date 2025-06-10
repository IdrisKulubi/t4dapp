import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";

interface LoginPageProps {
  searchParams: {
    callbackUrl?: string;
    message?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  if (session) {
    // If user is already logged in and there's a callback URL, redirect there
    if (searchParams.callbackUrl) {
      redirect(searchParams.callbackUrl);
    }
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white dark:from-pink-950/30 dark:to-background flex items-center justify-center px-4">
      <LoginCard 
        callbackUrl={searchParams.callbackUrl}
        message={searchParams.message}
      />
    </div>
  );
}
