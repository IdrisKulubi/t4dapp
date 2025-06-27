"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Loader2,
  Shield,
  Clock
} from "lucide-react";
import Link from "next/link";
import { sendVerificationCodeAction, verifyCodeAndCreateAccount, resendVerificationCode } from "@/lib/actions/email-verification";
interface SignupCardProps {
  callbackUrl?: string;
}

type SignupStep = "email" | "verification" | "success";

export function SignupCard({ callbackUrl }: SignupCardProps) {
  const [step, setStep] = useState<SignupStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer for resend functionality
  const startTimer = () => {
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword || !name) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const result = await sendVerificationCodeAction(email);
      
      if (result.success) {
        setSuccess(result.message || "Verification code sent!");
        setStep("verification");
        startTimer();
      } else {
        setError(result.error || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyCodeAndCreateAccount({
        email,
        code: verificationCode,
        password,
        name,
      });

      if (result.success) {
        setSuccess(result.message || "Account created successfully!");
        setStep("success");
        
        // Auto-login after successful verification
        setTimeout(async () => {
          await signIn("credentials", {
            email,
            password,
            callbackUrl: callbackUrl || "/apply",
          });
        }, 2000);
      } else {
        setError(result.error || "Failed to verify code");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await resendVerificationCode(email);
      
      if (result.success) {
        setSuccess("New verification code sent!");
        startTimer();
      } else {

        setError(result.error  || "Failed to resend verification code");
        console.error("Signup error:", result.error);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Failed to resend verification code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setVerificationCode(value);
    setError("");
    
    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      setTimeout(() => {
        const form = document.getElementById('verification-form') as HTMLFormElement;
        form?.requestSubmit();
      }, 100);
    }
  };

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B5FBA] to-[#00D0AB] rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] bg-clip-text text-transparent">
                {step === "email" && "Create Your Account"}
                {step === "verification" && "Verify Your Email"}
                {step === "success" && "Welcome Aboard!"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {step === "email" && "Join the YouthADAPT Challenge community"}
                {step === "verification" && `We sent a verification code to ${email}`}
                {step === "success" && "Your account has been created successfully"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">{success}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 1: Email and Password */}
            {step === "email" && (
              <motion.form
                onSubmit={handleSendCode}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 border-gray-200 text-black focus:border-[#0B5FBA] focus:ring-[#0B5FBA]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 text-black focus:border-[#0B5FBA] focus:ring-[#0B5FBA]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 text-black focus:border-[#0B5FBA] focus:ring-[#0B5FBA]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-12  text-black focus:border-[#0B5FBA] focus:ring-[#0B5FBA]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] hover:from-[#0A4A9A] hover:to-[#00B89A] text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Code...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 2: Verification Code */}
            {step === "verification" && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-[#0B5FBA]/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-6 h-6 text-[#0B5FBA]" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code we sent to your email
                  </p>
                </div>

                <form id="verification-form" onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={handleCodeChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                        <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                        <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                        <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                        <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                        <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2 border-gray-200 text-black focus:border-[#0B5FBA]" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || verificationCode.length !== 6}
                    className="w-full h-12 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] hover:from-[#0A4A9A] hover:to-[#00B89A] text-white font-semibold rounded-lg shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Create Account"
                    )}
                  </Button>
                </form>

                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-600">
                    Didn&apos;t receive the code?
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleResendCode}
                    disabled={timeLeft > 0 || isLoading}
                    className="text-[#0B5FBA] hover:text-[#0A4A9A] hover:bg-[#0B5FBA]/5"
                  >
                    {timeLeft > 0 ? (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Resend in {timeLeft}s
                      </div>
                    ) : (
                      "Resend Code"
                    )}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep("email")}
                  className="w-full text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign Up
                </Button>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <motion.div
                className="text-center space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Account Created!</h3>
                  <p className="text-gray-600">
                    You&apos;re being redirected to the application portal...
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#0B5FBA]" />
                </div>
              </motion.div>
            )}

            {/* Login Link */}
            {step !== "success" && (
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
                    className="font-medium text-[#0B5FBA] hover:text-[#0A4A9A] transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            )}

            {/* OAuth Options */}
            {step === "email" && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signIn("google", { callbackUrl: callbackUrl || "/apply" })}
                  className="w-full h-12 border-gray-200 hover:bg-gray-50"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 