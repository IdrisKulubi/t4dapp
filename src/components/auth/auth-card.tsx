"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { SignupForm } from "./signup-form";
import { EmailLoginForm } from "./email-login-form";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface AuthCardProps {
  callbackUrl?: string;
  defaultTab?: "signin" | "signup";
}

export function AuthCard({ callbackUrl, defaultTab = "signin" }: AuthCardProps) {
  const { data: session } = useSession();
  if (session) {
    redirect("/");
  }
  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900/90 dark:backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-800"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B5FBA] to-[#00D0AB] flex items-center justify-center shadow-md">
                  <Globe className="h-8 w-8 text-white" />
                </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to In-Country YouthADAPT
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Sign in or create an account to continue
              </p>
            </div>
          </div>

          {/* Auth Forms */}
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <div className="space-y-4">
                 <Button 
                    variant="outline"
                    className="w-full py-6 text-base"
                    onClick={() => signIn("google", { callbackUrl: callbackUrl || "/apply" })}
                  >
                    <svg
                      className="mr-3 h-5 w-5"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
                <EmailLoginForm callbackUrl={callbackUrl} />
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <SignupForm callbackUrl={callbackUrl} />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
} 