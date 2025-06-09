"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside or on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
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

  return (
    <>
      <motion.header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-xl shadow-xl border-b border-blue-100`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Left: Partner Logos - Hidden on small mobile, visible on larger screens */}
            <motion.div 
              className="hidden sm:flex items-center gap-4 lg:gap-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {/* GCA Logo */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className={`relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl transition-all duration-300 bg-white shadow-md group-hover:shadow-lg`}>
                  <Image 
                    src="/images/GCA.svg" 
                    alt="Global Center on Adaptation" 
                    fill
                    className="object-contain p-0.5 lg:p-1"
                  />
                </div>
                
                {/* Tooltip - Hidden on mobile */}
                <motion.div 
                  className="hidden lg:block absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  Global Center on Adaptation
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </motion.div>
              </motion.div>

              {/* AfDB Logo */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className={`relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl transition-all duration-300 bg-white shadow-md group-hover:shadow-lg`}>
                  <Image 
                    src="/images/AfDB.png" 
                    alt="African Development Bank" 
                    fill
                    className="object-contain p-0.5 lg:p-1"
                  />
                </div>
                
                {/* Tooltip - Hidden on mobile */}
                <motion.div 
                  className="hidden lg:block absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  African Development Bank
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </motion.div>
              </motion.div>

              {/* KCIC Logo */}
              <motion.div
                className="relative group"
                whileHover={{ scale: 1.1, y: -2 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className={`relative h-8 w-16 lg:h-12 lg:w-24 p-1 lg:p-2 rounded-xl transition-all duration-300 bg-white shadow-md group-hover:shadow-lg`}>
                  <Image 
                    src="/images/KCIC.png" 
                    alt="Kenya Climate Innovation Center" 
                    fill
                    className="object-contain p-0.5 lg:p-1"
                  />
                </div>
                
                {/* Tooltip - Hidden on mobile */}
                <motion.div 
                  className="hidden lg:block absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  Kenya Climate Innovation Center
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Center: Title */}
            <motion.div
              className="flex-1 text-center mx-4 sm:mx-8"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link href="/" className="group block" onClick={closeMobileMenu}>
                <motion.h1 
                  className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold tracking-wide transition-all duration-500 text-slate-800 group-hover:scale-105`}
                  whileHover={{ 
                    background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  <span className="hidden sm:inline">InCountryYouthADAPT Challenge 2025</span>
                  <span className="sm:hidden">InCountryYouthADAPT 2025</span>
                </motion.h1>
                <motion.div 
                  className="h-0.5 lg:h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center mt-1 lg:mt-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                />
              </Link>
            </motion.div>

            {/* Right: Desktop Navigation */}
            <motion.nav
              className="hidden lg:flex items-center gap-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link 
                  href="#features" 
                  className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50`}
                >
                  Features
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link 
                  href="#eligibility" 
                  className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50`}
                >
                  Eligibility
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  href="/apply" 
                  className={`relative overflow-hidden px-6 py-3 rounded-full font-semibold text-sm transition-all duration-500 group bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl`}
                >
                  <span className="relative z-10">Apply Today</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </motion.nav>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 sm:p-3 rounded-xl transition-all duration-300 relative z-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 ${isMobileMenuOpen ? 'text-white' : ''}`}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 45 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="w-5 h-5 sm:w-6 sm:h-6 relative"
              >
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: 90, y: 0 } : { rotate: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-0.5 bg-current transform origin-center"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-0.5 bg-current transform"
                />
                <motion.span
                  animate={isMobileMenuOpen ? { rotate: -90, y: 0 } : { rotate: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute w-full h-0.5 bg-current transform origin-center"
                />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Animated bottom border */}
        <motion.div 
          className={`absolute bottom-0 left-0 w-full h-0.5 lg:h-1 transition-all duration-500 ${
            isScrolled 
              ? "bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500" 
              : "bg-gradient-to-r from-teal-400 via-blue-400 to-teal-400"
          }`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ transformOrigin: "center" }}
        />

        {/* Subtle glow effect when scrolled */}
        {isScrolled && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-blue-500/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/95 backdrop-blur-xl shadow-2xl z-50 border-l border-blue-100"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-600 to-teal-600">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <p className="text-blue-100 text-sm mt-1">Navigate the platform</p>
                </div>

                {/* Mobile Partner Logos - Only visible in mobile menu */}
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Our Partners</h3>
                  <div className="flex items-center justify-around gap-4">
                    <div className="w-16 h-10 relative">
                      <Image 
                        src="/images/GCA.svg" 
                        alt="GCA" 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-16 h-10 relative">
                      <Image 
                        src="/images/AfDB.png" 
                        alt="AfDB" 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="w-16 h-10 relative">
                      <Image 
                        src="/images/KCIC.png" 
                        alt="KCIC" 
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 p-6 space-y-2">
                  {[
                    { href: "#features", label: "Features", icon: "⭐" },
                    { href: "#eligibility", label: "Eligibility", icon: "✅" },
                    { href: "#about", label: "About", icon: "ℹ️" },
                    { href: "#contact", label: "Contact", icon: "📧" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-all duration-300 group"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </span>
                        <svg 
                          className="ml-auto w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA Button */}
                <div className="p-6 border-t border-slate-200">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Link
                      href="/apply"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-center gap-3 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <span>Apply Today</span>
                      <svg 
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </motion.div>
                  
                  <p className="text-center text-sm text-slate-500 mt-4">
                    Join the climate adaptation challenge
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
