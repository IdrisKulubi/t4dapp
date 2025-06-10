import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoginCard } from "@/components/auth/login-card";

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string;
    message?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth();
  const params = await searchParams;
  
  if (session) {
    // If user is already logged in and there's a callback URL, redirect there
    if (params.callbackUrl) {
      redirect(params.callbackUrl);
    }
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-white dark:from-pink-950/30 dark:to-background flex items-center justify-center px-4">
      <LoginCard 
        callbackUrl={params.callbackUrl}
        message={params.message}
      />
    </div>
  );
}
