"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const countries = [
  { name: "Kenya", flag: "/images/flags/kenya.png", code: "KE" },
  { name: "Tanzania", flag: "/images/flags/tanzania.png", code: "TZ" },
  { name: "Rwanda", flag: "/images/flags/rwanda.png", code: "RW" },
  { name: "Ghana", flag: "/images/flags/ghana.png", code: "GH" },
  { name: "Nigeria", flag: "/images/flags/nigeria.png", code: "NG" },
  { name: "Uganda", flag: "/images/flags/uganda.png", code: "UG" },
];

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
      staggerChildren: 0.1
    }
  }
};

export function CountriesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#0B5FBA]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00D0AB]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#0B5FBA]/10 to-[#00D0AB]/10 text-[#0B5FBA] text-sm font-semibold mb-6 border border-[#0B5FBA]/20">
              Focus Countries
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] bg-clip-text text-transparent">
              Priority Regions
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            While applications are open across Africa, preference will be given to entrepreneurs
            from these strategic countries driving climate innovation.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto"
        >
          {countries.map((country) => (
            <motion.div
              key={country.code}
              className="group relative"
              variants={fadeIn}
              whileHover={{ y: -8, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-[#00D0AB]/30 overflow-hidden text-center">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B5FBA]/5 to-[#00D0AB]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Flag */}
                <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-2 border-slate-200 group-hover:border-[#00D0AB]/50 transition-colors duration-300">
                  <Image
                    src={country.flag}
                    alt={`${country.name} flag`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Country Name */}
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#0B5FBA] transition-colors duration-300">
                  {country.name}
                </h3>
                
                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Are you from one of these countries? You&apos;re in the perfect position to make a significant impact.
          </p>
          <motion.a
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white font-semibold hover:from-[#00D0AB]/90 hover:to-[#0B5FBA]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Apply Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 