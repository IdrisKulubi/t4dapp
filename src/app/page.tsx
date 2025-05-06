"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  ArrowRightIcon, 
  SparklesIcon, 
  GlobeAltIcon, 
  LightBulbIcon,
  UserGroupIcon,
  DocumentCheckIcon
} from "@heroicons/react/24/outline";
import { HeroSection } from "@/components/home/HeroSection";
import { PartnerLogosSection } from "@/components/home/PartnerLogosSection";

// Animation variants
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

const drawLine = {
  hidden: { pathLength: 0 },
  visible: { 
    pathLength: 1,
    transition: { 
      duration: 2,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  return (
    <div className="relative bg-gray-900 text-gray-100">
      {/* Hero Section */}
      <HeroSection />

      {/* Partner Logos Section */}
      <PartnerLogosSection />

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-4 text-teal-200">Empowering Africa&apos;s Climate Innovators</h2>
            <p className="text-lg text-gray-300">
              The YouthAdapt Challenge identifies and accelerates promising youth-led solutions for climate adaptation across Africa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-teal-900/20 transition-shadow"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: index * 0.2,
                      duration: 0.5
                    }
                  }
                }}
              >
                <div className="w-12 h-12 bg-teal-900/60 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-teal-200">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section id="eligibility" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-100 text-sm font-medium mb-4">
                Eligibility Criteria
              </span>
              <h2 className="text-3xl font-bold mb-4 text-teal-200">Who Can Apply?</h2>
              <p className="text-gray-300">
                We&apos;re looking for innovative solutions that build resilience to climate change impacts.
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              className="space-y-6"
            >
              {eligibilityCriteria.map((criteria, index) => (
                <motion.div
                  key={index}
                  className="flex gap-4 p-4 bg-gray-800 rounded-lg shadow-lg"
                  variants={fadeIn}
                >
                  <div className="mt-1 shrink-0 text-teal-400">
                    <DocumentCheckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium text-teal-200">{criteria.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{criteria.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-teal-900 text-teal-100 text-sm font-medium mb-4">
              Focus Countries
            </span>
            <h2 className="text-3xl font-bold mb-4 text-teal-200">Priority Regions</h2>
            <p className="text-gray-300">
              While applications are open across Africa, preference will be given to entrepreneurs
              from the following countries:
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-4 rounded-lg text-center shadow-lg transition-all"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      delay: index * 0.1,
                      duration: 0.4
                    }
                  }
                }}
                whileHover={{ y: -5 }}
              >
                <div className="w-full aspect-[4/3] relative mb-3 bg-gray-800 rounded">
                  <Image
                    src={`/images/flags/${country.code}.png`}
                    fill
                    alt={country.name}
                    className="object-cover rounded"
                  />
                </div>
                <p className="font-medium text-teal-200">{country.name}</p>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to make an impact?
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-xl opacity-90 mb-8"
            >
              Apply now to join the next generation of climate adaptation innovators.
            </motion.p>
            <motion.div variants={fadeIn}>
              <Button 
                size="lg" 
                className="rounded-full bg-gray-100 text-teal-900 hover:bg-white px-8 text-lg"
                asChild
              >
                <Link href="/apply" className="flex items-center gap-2">
                  Start Your Application
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// Data
const features = [
  {
    icon: <GlobeAltIcon className="w-6 h-6 text-teal-400" />,
    title: "Pan-African Focus",
    description: "Supporting entrepreneurs from across the African continent with preference for focus countries."
  },
  {
    icon: <LightBulbIcon className="w-6 h-6 text-teal-400" />,
    title: "Innovation Support",
    description: "Funding and mentorship for climate adaptation solutions that address local challenges."
  },
  {
    icon: <UserGroupIcon className="w-6 h-6 text-teal-400" />,
    title: "Youth-Led Solutions",
    description: "Empowering young entrepreneurs aged 18-35 with the resources to scale their impact."
  }
];

const eligibilityCriteria = [
  {
    title: "Age Requirement",
    description: "Entrepreneurs must be between 18-35 years old at the time of application."
  },
  {
    title: "Business Registration",
    description: "Your business must be legally registered to operate in an African country."
  },
  {
    title: "Revenue Generation",
    description: "Business must have generated revenues over a minimum two-year period."
  },
  {
    title: "Business Plan",
    description: "Must have a SMART business plan for your climate adaptation solution."
  },
  {
    title: "Impact Focus",
    description: "Business must demonstrate direct impact in food security or infrastructure."
  }
];

const countries = [
  { name: "Kenya", code: "kenya" },
  { name: "Tanzania", code: "tanzania" },
  { name: "Rwanda", code: "rwanda" },
  { name: "Ghana", code: "ghana" },
  { name: "Uganda", code: "uganda" }
  
];

