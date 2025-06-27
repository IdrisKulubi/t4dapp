"use client";

import { motion } from "framer-motion";
import {
  CalendarDaysIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

const eligibilityCriteria = [
  {
    icon: <CalendarDaysIcon className="w-6 h-6" />,
    title: "Age Requirement",
    description:
      "Entrepreneurs must be between 18-35 years old at the time of application.",
    color: "emerald",
  },
  {
    icon: <BuildingOfficeIcon className="w-6 h-6" />,
    title: "Business Registration",
    description:
      "Your business must be legally registered to operate in an African country.",
    color: "blue",
  },
  {
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    title: "Revenue Generation",
    description:
      "Business must have generated revenues over a minimum two-year period.",
    color: "emerald",
  },
  {
    icon: <DocumentTextIcon className="w-6 h-6" />,
    title: "Business Plan",
    description:
      "Must have a SMART business plan for your climate adaptation solution.",
    color: "blue",
  },
  {
    icon: <ChartBarIcon className="w-6 h-6" />,
    title: "Impact Focus",
    description:
      "Business must demonstrate direct impact in food security or infrastructure.",
    color: "emerald",
  },
];

const priorityCountries = [
  { name: "Ghana", code: "ghana", flag: "/images/flags/ghana.png" },

  { name: "Kenya", code: "kenya", flag: "/images/flags/kenya.png" },
  { name: "Nigeria", code: "nigeria", flag: "/images/flags/nigeria.png" },
  { name: "Rwanda", code: "rwanda", flag: "/images/flags/rwanda.png" },

  { name: "Tanzania", code: "tanzania", flag: "/images/flags/tanzania.png" },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function EligibilitySection() {
  return (
    <section
      id="eligibility"
      className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#00D0AB]/20 to-[#0B5FBA]/20 text-[#00D0AB] text-sm font-semibold mb-6 border border-[#00D0AB]/30">
                Eligibility Criteria
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] bg-clip-text text-transparent">
                Who Can Apply?
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We&apos;re looking for innovative solutions that build resilience
              to climate change impacts. Here&apos;s what you need to qualify,
              with priority given to entrepreneurs from our focus countries.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {eligibilityCriteria.map((criteria, index) => {
              const isGcaBlue = criteria.color === "blue";
              const isGcaGreen = criteria.color === "emerald";

              return (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeIn}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-[#00D0AB]/30 transition-all duration-300 overflow-hidden">
                    {/* Background Gradient */}
                    <div
                      className={`
                      absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ${isGcaBlue ? "bg-gradient-to-br from-[#0B5FBA]/5 to-transparent" : ""}
                      ${isGcaGreen ? "bg-gradient-to-br from-[#00D0AB]/5 to-transparent" : ""}
                    `}
                    ></div>

                    <div className="relative flex gap-4">
                      {/* Icon */}
                      <div
                        className={`
                        shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300
                        ${isGcaBlue ? "bg-gradient-to-br from-[#0B5FBA]/20 to-[#0B5FBA]/20 border-[#0B5FBA]/30" : ""}
                        ${isGcaGreen ? "bg-gradient-to-br from-[#00D0AB]/20 to-[#00D0AB]/20 border-[#00D0AB]/30" : ""}
                      `}
                      >
                        <div
                          className={`
                          ${isGcaBlue ? "text-[#0B5FBA]" : ""}
                          ${isGcaGreen ? "text-[#00D0AB]" : ""}
                        `}
                        >
                          {criteria.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-[#00D0AB] transition-colors">
                          {criteria.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {criteria.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div
                      className={`
                      absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
                      ${isGcaBlue ? "bg-gradient-to-r from-[#0B5FBA] to-[#0B5FBA]/80" : ""}
                      ${isGcaGreen ? "bg-gradient-to-r from-[#00D0AB] to-[#00D0AB]/80" : ""}
                    `}
                    ></div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Priority Regions Section */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Eligible Countries
                </span>
              </h3>

              <p className="text-slate-300 max-w-3xl mx-auto leading-relaxed">
                While applications are welcome from across Africa, preference
                will be given to entrepreneurs from these strategic countries
                driving climate innovation.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {priorityCountries.map((country, index) => (
                <motion.div
                  key={country.code}
                  className="group relative"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -8, scale: 1.05 }}
                >
                  <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 overflow-hidden text-center">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                   

                    {/* Flag */}
                    <div className="relative w-12 h-12 mx-auto mb-4 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-yellow-500/50 transition-colors duration-300">
                      <Image
                        src={country.flag}
                        alt={`${country.name} flag`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Country Name */}
                    <h4 className="text-white font-semibold group-hover:text-yellow-300 transition-colors duration-300">
                      {country.name}
                    </h4>

                    {/* Hover Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-center">
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                If you meet these criteria and have a climate adaptation
                solution focused on food security or infrastructure, we&apos;d
                love to hear from you.
              </p>

              <motion.a
                href="/apply"
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white font-semibold hover:from-[#00D0AB]/90 hover:to-[#0B5FBA]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Application
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
