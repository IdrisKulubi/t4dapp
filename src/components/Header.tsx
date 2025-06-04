"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-blue-100" 
          : "bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-teal-700/80 backdrop-blur-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Partner Logos */}
          <motion.div 
            className="flex items-center gap-8"
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
              <div className={`relative h-12 w-24 p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? "bg-white shadow-md group-hover:shadow-lg" 
                  : "bg-white/10 backdrop-blur-sm group-hover:bg-white/20"
              }`}>
                <Image 
                  src="/images/GCA.svg" 
                  alt="Global Center on Adaptation" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              
              {/* Tooltip */}
              <motion.div 
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
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
              <div className={`relative h-12 w-24 p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? "bg-white shadow-md group-hover:shadow-lg" 
                  : "bg-white/10 backdrop-blur-sm group-hover:bg-white/20"
              }`}>
                <Image 
                  src="/images/AfDB.png" 
                  alt="African Development Bank" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              
              {/* Tooltip */}
              <motion.div 
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
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
              <div className={`relative h-12 w-24 p-2 rounded-xl transition-all duration-300 ${
                isScrolled 
                  ? "bg-white shadow-md group-hover:shadow-lg" 
                  : "bg-white/10 backdrop-blur-sm group-hover:bg-white/20"
              }`}>
                <Image 
                  src="/images/KCIC.png" 
                  alt="Kenya Climate Innovation Center" 
                  fill
                  className="object-contain p-1"
                />
              </div>
              
              {/* Tooltip */}
              <motion.div 
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-lg"
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
            className="flex-1 text-center mx-8"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/" className="group block">
              <motion.h1 
                className={`text-lg md:text-xl lg:text-2xl font-bold tracking-wide transition-all duration-500 ${
                  isScrolled 
                    ? "text-slate-800" 
                    : "text-white"
                } group-hover:scale-105`}
                whileHover={{ 
                  background: "linear-gradient(135deg, #0ea5e9, #14b8a6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                InCountry YouthAdapt Challenge 2025
              </motion.h1>
              <motion.div 
                className="h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center mt-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              />
            </Link>
          </motion.div>

          {/* Right: Navigation */}
          <motion.nav
            className="hidden lg:flex items-center gap-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link 
                href="#features" 
                className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  isScrolled 
                    ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50" 
                    : "text-white/90 hover:text-teal-300 hover:bg-white/10"
                }`}
              >
                Features
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
              <Link 
                href="#eligibility" 
                className={`text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  isScrolled 
                    ? "text-slate-600 hover:text-blue-600 hover:bg-blue-50" 
                    : "text-white/90 hover:text-teal-300 hover:bg-white/10"
                }`}
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
                className={`relative overflow-hidden px-6 py-3 rounded-full font-semibold text-sm transition-all duration-500 group ${
                  isScrolled 
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 shadow-lg hover:shadow-xl" 
                    : "bg-white/20 text-white hover:bg-white hover:text-blue-700 backdrop-blur-sm border border-white/30 hover:border-white"
                }`}
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
            className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? "text-slate-600 hover:bg-blue-50 hover:text-blue-600" 
                : "text-white hover:bg-white/20"
            }`}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Animated bottom border */}
      <motion.div 
        className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-500 ${
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
  );
} 