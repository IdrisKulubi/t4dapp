"use client";

import { motion } from "framer-motion";
import { 
  GlobeAltIcon, 
  LightBulbIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: <GlobeAltIcon className="w-8 h-8" />,
    title: "Pan-African Focus",
    description: "Focused on 5 key African countries to maximize impact.",
    color: "emerald"
  },
  {
    icon: <LightBulbIcon className="w-8 h-8" />,
    title: "Innovation Support",
    description: "Funding and mentorship for climate adaptation solutions that address local challenges.",
    color: "blue"
  },
  {
    icon: <UserGroupIcon className="w-8 h-8" />,
    title: "Youth-Led Solutions",
    description: "Empowering young entrepreneurs aged 18-35 with the resources to scale their impact.",
    color: "emerald"
  },
  {
    icon: <UserGroupIcon className="w-8 h-8" />,
    title: "Dragon's Den Pitch Event",
    description: "An exclusive opportunity to pitch your solution at a Dragon's Den style event in your country, gaining visibility and attracting potential investors.",
    color: "blue"
  },
  {
    icon: <RocketLaunchIcon className="w-8 h-8" />,
    title: "Accelerated Growth",
    description: "Fast-track your startup with our comprehensive acceleration program and network.",
    color: "blue"
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8" />,
    title: "Proven Impact",
    description: "Join a community of successful entrepreneurs making measurable climate impact.",
    color: "emerald"
  },
  {
    icon: <CurrencyDollarIcon className="w-8 h-8" />,
    title: "Financial Support",
    description: "Access funding opportunities and investment connections to scale your solution.",
    color: "blue"
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
      staggerChildren: 0.1
    }
  }
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-20"
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
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 text-sm font-semibold mb-6 border border-emerald-200">
              Why Choose YouthAdapt
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Empowering Africa&apos;s
            </span>
            <br />
            <span className="text-slate-800">Climate Innovators</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The YouthAdapt Challenge identifies and accelerates promising youth-led solutions 
            for climate adaptation across Africa, providing the support you need to scale your impact.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={fadeIn}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`
                relative p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-${feature.color}-200 overflow-hidden
              `}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feature.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`
                  relative w-16 h-16 rounded-xl bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300
                `}>
                  <div className={`text-${feature.color}-600`}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
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
          <p className="text-slate-600 mb-6">Ready to join the next generation of climate innovators?</p>
          <motion.a
            href="#eligibility"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn About Eligibility
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 