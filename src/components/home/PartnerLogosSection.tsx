"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { name: "Kenya Climate Innovation Center", logo: "/images/KCIC.png" },
  { name: "Global Center on Adaptation", logo: "/images/GCA.svg" },
  { name: "African Development Bank", logo: "/images/AfDB.png" },
  
];

export function PartnerLogosSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-slate-600 font-medium mb-8">
            Supported by leading organizations committed to climate innovation
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 hover:opacity-100 transition-opacity duration-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="w-24 h-16 md:w-32 md:h-20 relative">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain filter brightness-0 hover:brightness-100 transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 