"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, FileText, LogIn } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-xl shadow-xl border-b border-blue-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Left: Partner Logos */}
            <motion.div 
              className="hidden sm:flex items-center gap-4 lg:gap-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl bg-white shadow-md">
                <Image 
                  src="/images/GCA.svg" 
                  alt="Global Center on Adaptation" 
                  fill
                  className="object-contain p-0.5 lg:p-1"
                />
              </div>
              <div className="relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl bg-white shadow-md">
                <Image 
                  src="/images/AfDB.png" 
                  alt="African Development Bank" 
                  fill
                  className="object-contain p-0.5 lg:p-1"
                />
              </div>
              <div className="relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl bg-white shadow-md">
                <Image 
                  src="/images/KCIC.png" 
                  alt="Kenya Climate Innovation Center" 
                  fill
                  className="object-contain p-0.5 lg:p-1"
                />
              </div>
            </motion.div>

            {/* Center: Title */}
            <motion.div
              className="flex-1 text-center mx-4 sm:mx-8"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link href="/" className="group block" onClick={closeMobileMenu}>
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-wide text-slate-800">
                  <span className="hidden sm:inline">InCountryYouthADAPT Challenge 2025</span>
                  <span className="sm:hidden">InCountryYouthADAPT 2025</span>
                </h1>
              </Link>
            </motion.div>

            {/* Right: Desktop Navigation */}
            <motion.nav
              className="hidden lg:flex items-center gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <Link 
                href="#features" 
                className="text-sm font-medium px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              >
                Features
              </Link>
              
              <Link 
                href="#eligibility" 
                className="text-sm font-medium px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50"
              >
                Eligibility
              </Link>

              {/* Authentication Section */}
              {status === "loading" ? (
                <div className="h-10 w-20 bg-gray-200 animate-pulse rounded-full" />
              ) : session?.user ? (
                // User is signed in - show user dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-2 rounded-full hover:bg-blue-50 transition-all duration-300">
                      <Avatar className="h-8 w-8 border-2 border-blue-200">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
                          {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-700 hidden xl:block">
                        {session.user.name || "User"}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/apply" className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Application</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/edit" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // User is not signed in - show sign in button
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Apply Today Button - only show if not signed in */}
              {!session?.user && (
                <Link 
                  href="/apply" 
                  className="px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply Today
                </Link>
              )}
            </motion.nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 sm:p-3 rounded-xl transition-all duration-300 relative z-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 relative">
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`absolute w-full h-0.5 bg-current transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-l border-blue-100"
            >
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-teal-600">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <p className="text-blue-100 text-sm mt-1">Navigate the platform</p>
                </div>

                {/* User Section in Mobile Menu */}
                {session?.user && (
                  <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-blue-200">
                        <AvatarImage src={session.user.image || ""} alt={session.user.name || ""} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {session.user.name?.[0] || session.user.email?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-slate-900">{session.user.name || "User"}</p>
                        <p className="text-sm text-slate-600">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Profile</span>
                      </Link>
                      <Link
                        href="/apply"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">My Application</span>
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex-1 p-6 space-y-2">
                  {[
                    { href: "#features", label: "Features", icon: "⭐" },
                    { href: "#eligibility", label: "Eligibility", icon: "✅" },
                    { href: "#about", label: "About", icon: "ℹ️" },
                    { href: "#contact", label: "Contact", icon: "📧" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="p-6 border-t border-slate-200">
                  {session?.user ? (
                    <Button
                      onClick={() => {
                        closeMobileMenu();
                        handleSignOut();
                      }}
                      variant="outline"
                      className="w-full flex items-center justify-center gap-3 py-4 px-6 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </Button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/apply"
                        onClick={closeMobileMenu}
                        className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <span>Apply Today</span>
                      </Link>
                    </>
                  )}
                  
                  <p className="text-center text-sm text-slate-500 mt-4">
                    {session?.user ? "Thank you for being part of our community" : "Join the climate adaptation challenge"}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 