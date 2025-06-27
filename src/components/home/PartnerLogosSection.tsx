"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { 
    name: "Global Center on Adaptation", 
    logo: "/images/GCA.svg"
  },
  { 
    name: "African Development Bank", 
    logo: "/images/AfDB.png"
  },
  { 
    name: "Kenya Climate Innovation Center", 
    logo: "/images/KCIC.png"
  },
];

export function PartnerLogosSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#0B5FBA]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#00D0AB]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#0B5FBA]/10 to-[#00D0AB]/10 rounded-full blur-3xl"></div>
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] text-white rounded-full mb-6 shadow-lg"
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
            <span className="bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] bg-clip-text text-transparent">
              Africa Adaptation
            </span>
            <br />
            <span className="text-slate-700">Acceleration Program</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A strategic partnership mobilizing <span className="font-semibold text-[#00D0AB]">$25 billion</span> to scale up 
            climate adaptation across Africa, empowering youth-led innovations for resilient communities.
          </motion.p>
        </motion.div>

        {/* Partner Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-[#00D0AB]/30 relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B5FBA]/5 to-[#00D0AB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Logo Container */}
                <div className="relative h-20 mb-4 flex items-center justify-center">
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    fill
                    className="object-contain filter transition-all duration-300 group-hover:brightness-110"
                  />
                </div>
                
                {/* Partner Name */}
                <h3 className="text-center text-sm font-semibold text-slate-700 group-hover:text-[#0B5FBA] transition-colors duration-300">
                  {partner.name}
                </h3>
                
                {/* Hover Effect Line */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join this transformative initiative and become part of Africa&apos;s largest climate adaptation program.
          </p>
          <motion.a
            href="#features"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white font-semibold rounded-full hover:from-[#00D0AB]/90 hover:to-[#0B5FBA]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Explore Benefits</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 