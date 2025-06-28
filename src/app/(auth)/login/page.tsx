import { AuthCard } from "@/components/auth/auth-card";
import { Suspense } from 'react'

function LoginPageContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <AuthCard defaultTab="signin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  )
}
