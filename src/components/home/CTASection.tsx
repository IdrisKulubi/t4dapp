"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-900 via-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 right-20 w-4 h-4 bg-emerald-400 rounded-full"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-32 left-16 w-6 h-6 bg-blue-400 rounded-full"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="absolute top-1/2 left-10 w-3 h-3 bg-emerald-300 rounded-full"
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Icon */}
          <motion.div
            variants={fadeIn}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <SparklesIcon className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          
          {/* Heading */}
          <motion.h2 
            variants={fadeIn}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
              Ready to Transform
            </span>
            <br />
            <span className="text-white">
              Africa's Future?
            </span>
          </motion.h2>
          
          {/* Description */}
          <motion.p 
            variants={fadeIn}
            className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join the next generation of climate innovators and help build a resilient, 
            sustainable future for Africa. Your solution could be the key to transforming 
            communities across the continent.
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            variants={fadeIn}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">$2M+</div>
              <div className="text-slate-400">Available Funding</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">12 Months</div>
              <div className="text-slate-400">Program Duration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">50+</div>
              <div className="text-slate-400">Countries Eligible</div>
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            variants={fadeIn}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/apply" 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Start Your Application</span>
                <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="#features" 
                className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-600 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-300 font-semibold text-lg rounded-full backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
          
          {/* Additional Info */}
          <motion.div 
            variants={fadeIn}
            className="mt-12 pt-8 border-t border-slate-700/50"
          >
            <p className="text-slate-400 text-sm mb-4">
              Applications close on March 31, 2024
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <span>✓ No application fees</span>
              <span>✓ Free mentorship</span>
              <span>✓ Global network access</span>
              <span>✓ Ongoing support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 