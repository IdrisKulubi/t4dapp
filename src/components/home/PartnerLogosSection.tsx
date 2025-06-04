"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { 
    name: "Global Center on Adaptation", 
    logo: "/images/GCA.svg",
    description: "Leading global climate adaptation initiatives"
  },
  { 
    name: "African Development Bank", 
    logo: "/images/AfDB.png",
    description: "Financing Africa's development"
  },
  { 
    name: "Kenya Climate Innovation Center", 
    logo: "/images/KCIC.png",
    description: "Driving climate innovation in Kenya"
  },
];

export function PartnerLogosSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full mb-6 shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
            <span className="font-semibold">Our Partners</span>
          </motion.div>

          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Africa Adaptation
            </span>
            <br />
            <span className="text-slate-700">Acceleration Program</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg text-slate-600 mb-4">
              Implemented by the Global Center on Adaptation (GCA) and African Development Bank (AfDB)
            </p>
            <p className="text-sm text-blue-700 font-medium">
              Part of the comprehensive Africa Adaptation Acceleration Program (AAAP)
            </p>
          </motion.div>
        </motion.div>
        
        {/* Partner Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.7, 
                delay: 0.6 + (index * 0.1),
                ease: "easeOut"
              }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Card Container */}
              <div className="relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden group-hover:border-blue-200">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Logo Container */}
                  <motion.div 
                    className="flex justify-center items-center h-24 mb-6"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-full h-full max-w-32">
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain drop-shadow-sm"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Partner Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                  
                  {/* Decorative element */}
                  <motion.div 
                    className="absolute top-6 right-6 w-4 h-4 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-60"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
              
              {/* Floating glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-teal-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 transform scale-110"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6"
            >
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-full h-full">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </motion.div>
            <span className="font-semibold">Trusted by Leading Organizations</span>
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 