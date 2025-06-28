"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendVerificationCodeAction, verifyCodeAndCreateAccount, resendVerificationCode } from "@/lib/actions/email-verification";

interface SignupFormProps {
  callbackUrl?: string;
}

type SignupStep = "details" | "verification" | "success";

export function SignupForm({ callbackUrl }: SignupFormProps) {
  const [step, setStep] = useState<SignupStep>("details");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError("");
    setIsLoading(true);
    const result = await sendVerificationCodeAction(email);
    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message || "A verification code has been sent to your email.");
      setStep("verification");
      startResendTimer();
    } else {
      setError(result.error || "Failed to send verification code.");
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    const result = await verifyCodeAndCreateAccount({ email, code: verificationCode, password, name });
    setIsLoading(false);

    if (result.success) {
      setSuccess(result.message || "Account created successfully! You will be redirected shortly.");
      setStep("success");
      setTimeout(() => {
        signIn("credentials", { email, password, callbackUrl: callbackUrl || "/apply" });
      }, 2000);
    } else {
      setError(result.error || "Invalid or expired verification code.");
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    const result = await resendVerificationCode(email);
    setIsLoading(false);
    if (result.success) {
      setSuccess("A new verification code has been sent.");
      startResendTimer();
    } else {
      setError(result.error || "Failed to resend code.");
    }
  };
  
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {step === "details" && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                 <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          )}

          {step === "verification" && (
            <div className="space-y-6 text-center">
                <div>
                    <h3 className="text-lg font-semibold dark:text-white">Verify Your Email</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enter the 6-digit code sent to {email}</p>
                </div>
                <InputOTP maxLength={6} value={verificationCode} onChange={(value) => {
                    setVerificationCode(value);
                    if (value.length === 6) {
                        handleVerifyCode();
                    }
                }}>
                    <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                 <Button variant="link" onClick={handleResendCode} disabled={resendTimer > 0 || isLoading}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                 </Button>
            </div>
          )}

          {step === "success" && (
            <Alert variant="success" className="dark:bg-green-900/50 dark:border-green-500/50 dark:text-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    {success}
                </AlertDescription>
            </Alert>
          )}
        </motion.div>
      </AnimatePresence>
      
      {error && (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-center text-gray-500 dark:text-gray-400 pt-4">
        By creating an account, you agree to our terms for the YouthADAPT Challenge {currentYear}.
      </p>
    </div>
  );
} 