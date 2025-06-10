"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Globe, Zap, Users, AlertCircle } from "lucide-react";

interface LoginCardProps {
  callbackUrl?: string;
  message?: string;
}

export function LoginCard({ callbackUrl, message }: LoginCardProps) {
  // Message display logic
  const getMessageContent = () => {
    switch (message) {
      case "login-required-for-application":
        return {
          text: "Please sign in to access the application form",
          type: "info" as const,
          icon: <AlertCircle className="h-4 w-4" />
        };
      default:
        return null;
    }
  };

  const messageContent = getMessageContent();

  return (
    <div className="relative w-full max-w-md">
      {/* Decorative elements */}
      <div
        aria-hidden="true"
        className="absolute -top-20 right-10 text-teal-500/10 text-8xl select-none animate-float"
      >
        🌍
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-16 left-10 text-blue-500/10 text-7xl select-none rotate-[-15deg] animate-float delay-150"
      >
        🚀
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-16 right-20 text-green-500/10 text-6xl select-none rotate-12 animate-float delay-300"
      >
        🌱
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-blue-100/50"
      >
        <div className="space-y-6">
          {/* Message Alert */}
          {messageContent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center space-x-2 p-3 rounded-xl border ${
                messageContent.type === "info"
                  ? "bg-blue-50 border-blue-200 text-blue-800"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              {messageContent.icon}
              <span className="text-sm font-medium">{messageContent.text}</span>
            </motion.div>
          )}

          {/* Logo and Title */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center shadow-lg">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-md animate-pulse">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                InCountryYouthADAPT
              </h1>
              <h2 className="text-xl font-semibold text-gray-800">
                Challenge 2025
              </h2>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                Empowering young climate innovators across Africa with funding and support 🌱
              </p>
            </div>
          </div>

          {/* Features highlight */}
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
              <span>Up to $30,000</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-teal-600" />
              </div>
              <span>5 Countries</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="h-4 w-4 text-green-600" />
              </div>
              <span>Climate Focus</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-blue-600" />
              </div>
              <span>Youth-Led</span>
            </div>
          </div>

          {/* Sign in form */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {callbackUrl === "/apply" ? "Continue to Application" : "Ready to Apply?"}
              </h3>
              <p className="text-sm text-gray-600">
                Sign in with Google to {callbackUrl === "/apply" ? "access the application form" : "start your application"}
              </p>
            </div>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signIn("google", { callbackUrl: callbackUrl || "/apply" });
              }}
              className="space-y-4"
            >
              <Button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transition-all duration-300 text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                <svg
                  className="mr-3 h-6 w-6"
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
              
              <div className="text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Secure authentication powered by Google 🔒
                </p>
              </div>
            </form>
          </div>

          {/* Information section */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-100">
            <div className="text-center space-y-2">
              <h4 className="font-semibold text-blue-900 text-sm">
                Application Deadline
              </h4>
              <p className="text-2xl font-bold text-blue-700">
                July 31st, 2025
              </p>
              <p className="text-xs text-blue-600">
                Don&apos;t miss your chance to apply
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>By continuing, you agree to our</p>
            <p className="space-x-1">
              <span className="text-blue-600 hover:underline cursor-pointer">
                Terms of Service
              </span>
              <span>and</span>
              <span className="text-blue-600 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
            <p className="text-gray-400 mt-2">
              🌍 Powered by GCA & AfDB
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
