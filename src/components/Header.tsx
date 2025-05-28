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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50" 
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Left: Partner Logos */}
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {/* GCA Logo */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-10 w-20">
                <Image 
                  src="/images/GCA.svg" 
                  alt="Global Center on Adaptation" 
                  fill
                  className={`object-contain transition-all duration-300 ${
                    isScrolled ? "brightness-0" : "brightness-0 invert"
                  } group-hover:brightness-100 group-hover:invert-0`}
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Global Center on Adaptation
              </div>
            </motion.div>

            {/* Separator */}
            <div className={`w-px h-8 transition-colors duration-300 ${
              isScrolled ? "bg-slate-300" : "bg-white/30"
            }`}></div>

            {/* KCIC Logo */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative h-10 w-20">
                <Image 
                  src="/images/KCIC.png" 
                  alt="Kenya Climate Innovation Center" 
                  fill
                  className={`object-contain transition-all duration-300 ${
                    isScrolled ? "brightness-0" : "brightness-0 invert"
                  } group-hover:brightness-100 group-hover:invert-0`}
                />
              </div>
              
              {/* Tooltip */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Kenya Climate Innovation Center
              </div>
            </motion.div>
          </motion.div>

          {/* Center: Title */}
          <motion.div
            className="flex-1 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link href="/" className="group">
              <h1 className={`text-xl md:text-2xl font-bold tracking-wide transition-all duration-300 ${
                isScrolled 
                  ? "text-slate-800 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent" 
                  : "text-white group-hover:text-emerald-300"
              }`}>
                YouthAdapt Challenge
              </h1>
              <motion.div 
                className={`h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center mt-1 ${
                  isScrolled ? "opacity-100" : "opacity-80"
                }`}
              />
            </Link>
          </motion.div>

          {/* Right: Navigation */}
          <motion.nav
            className="hidden md:flex items-center gap-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link 
              href="#features" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-emerald-600 ${
                isScrolled ? "text-slate-600" : "text-white/90"
              }`}
            >
              Features
            </Link>
            <Link 
              href="#eligibility" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-emerald-600 ${
                isScrolled ? "text-slate-600" : "text-white/90"
              }`}
            >
              Eligibility
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/apply" 
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  isScrolled 
                    ? "bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl" 
                    : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
                }`}
              >
                Apply Now
              </Link>
            </motion.div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled 
                ? "text-slate-600 hover:bg-slate-100" 
                : "text-white hover:bg-white/20"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Animated underline */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "center" }}
      />
    </motion.header>
  );
} 