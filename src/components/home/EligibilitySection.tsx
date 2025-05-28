"use client";

import { motion } from "framer-motion";
import { 
  DocumentCheckIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

const eligibilityCriteria = [
  {
    icon: <CalendarDaysIcon className="w-6 h-6" />,
    title: "Age Requirement",
    description: "Entrepreneurs must be between 18-35 years old at the time of application.",
    color: "emerald"
  },
  {
    icon: <BuildingOfficeIcon className="w-6 h-6" />,
    title: "Business Registration",
    description: "Your business must be legally registered to operate in an African country.",
    color: "blue"
  },
  {
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
    title: "Revenue Generation",
    description: "Business must have generated revenues over a minimum two-year period.",
    color: "emerald"
  },
  {
    icon: <DocumentTextIcon className="w-6 h-6" />,
    title: "Business Plan",
    description: "Must have a SMART business plan for your climate adaptation solution.",
    color: "blue"
  },
  {
    icon: <ChartBarIcon className="w-6 h-6" />,
    title: "Impact Focus",
    description: "Business must demonstrate direct impact in food security or infrastructure.",
    color: "emerald"
  }
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
      staggerChildren: 0.15
    }
  }
};

export function EligibilitySection() {
  return (
    <section id="eligibility" className="py-24 bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden">
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
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 text-sm font-semibold mb-6 border border-emerald-500/30">
                Eligibility Criteria
              </span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Who Can Apply?
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're looking for innovative solutions that build resilience to climate change impacts. 
              Here's what you need to qualify for the YouthAdapt Challenge.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {eligibilityCriteria.map((criteria, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${criteria.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                  
                  <div className="relative flex gap-4">
                    {/* Icon */}
                    <div className={`
                      shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-${criteria.color}-500/20 to-${criteria.color}-600/20 flex items-center justify-center border border-${criteria.color}-500/30 group-hover:scale-110 transition-transform duration-300
                    `}>
                      <div className={`text-${criteria.color}-400`}>
                        {criteria.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                        {criteria.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed">
                        {criteria.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-${criteria.color}-500 to-${criteria.color}-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Additional Info */}
          <motion.div 
            className="mt-16 p-8 bg-gradient-to-r from-emerald-900/20 to-blue-900/20 rounded-2xl border border-emerald-500/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <DocumentCheckIcon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Check Your Eligibility?
              </h3>
              
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                If you meet these criteria and have a climate adaptation solution focused on food security 
                or infrastructure, we'd love to hear from you.
              </p>
              
              <motion.a
                href="/apply"
                className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
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