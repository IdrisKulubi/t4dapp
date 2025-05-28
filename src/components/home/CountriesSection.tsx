"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const countries = [
  { name: "Kenya", code: "kenya", description: "East Africa's innovation hub" },
  { name: "Tanzania", code: "tanzania", description: "Agricultural transformation leader" },
  { name: "Rwanda", code: "rwanda", description: "Technology and sustainability pioneer" },
  { name: "Ghana", code: "ghana", description: "West Africa's economic powerhouse" },
  { name: "Uganda", code: "uganda", description: "Emerging market opportunities" }
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      
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
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-emerald-100 text-blue-700 text-sm font-semibold mb-6 border border-blue-200">
              Focus Countries
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Priority Regions
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            While applications are open across Africa, preference will be given to entrepreneurs
            from these strategic countries driving climate innovation.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {countries.map((country, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={{
                hidden: { opacity: 0, scale: 0.8, y: 20 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  transition: { 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }
                }
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-emerald-300 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Flag */}
                <div className="relative w-full aspect-[4/3] mb-4 bg-slate-100 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <Image
                    src={`/images/flags/${country.code}.png`}
                    fill
                    alt={`${country.name} flag`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Content */}
                <div className="relative text-center">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                    {country.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {country.description}
                  </p>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Additional Info */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              From Other African Countries?
            </h3>
            <p className="text-slate-600 mb-6">
              We welcome applications from entrepreneurs across the entire African continent. 
              These focus countries represent our priority regions, but exceptional solutions 
              from any African country will be considered.
            </p>
            <motion.a
              href="#eligibility"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-semibold hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Check Eligibility Requirements
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 