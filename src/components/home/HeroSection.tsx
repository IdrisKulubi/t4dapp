import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon} from "@heroicons/react/24/outline";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B5FBA] via-blue-800 to-[#00D0AB]">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#00D0AB]/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#0B5FBA]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text & CTA */}
          <motion.div 
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-[#00D0AB]/20 to-[#0B5FBA]/20 text-[#00D0AB] border border-[#00D0AB]/30 backdrop-blur-sm">
                🌍 #YouthADAPT
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-[#00D0AB] via-green-300 to-[#0B5FBA] bg-clip-text text-transparent">
                Calling all young
              </span>
              <br />
              <span className="text-white">
                climate innovators in Africa
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
             The In-country YouthADAPT challenge 2025 is part of the Africa Adaptation Acceleration Program, a joint initiative between the Global Center on Adaptation and the African Development Bank
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] hover:from-[#00D0AB]/90 hover:to-[#0B5FBA]/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-[#00D0AB]/25 transition-all duration-300" 
                asChild
              >
                <Link href="/apply" className="flex items-center gap-3">
                  Apply Today
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
             
            </motion.div>
            
            {/* Climate Adaptation Call */}
            <motion.div 
              className="pt-8 border-t border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="bg-gradient-to-r from-[#00D0AB]/10 to-[#0B5FBA]/10 rounded-2xl p-6 border border-[#00D0AB]/20 backdrop-blur-sm">
                <h3 className="text-xl font-bold text-[#00D0AB] mb-4">
                  We're calling for innovative solutions that address:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00D0AB] rounded-full"></div>
                    <span className="text-slate-200 font-medium">Climate Risks & Hazards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0B5FBA] rounded-full"></div>
                    <span className="text-slate-200 font-medium">Adaptation Needs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#00D0AB] rounded-full"></div>
                    <span className="text-slate-200 font-medium">Resilience Building</span>
                  </div>
                </div>
                <p className="text-slate-300 mt-4 text-sm leading-relaxed">
                  Join Africa's next generation of climate innovators creating sustainable solutions for adaptation and resilience across the continent.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Enhanced Image Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-lg mx-auto lg:ml-auto"
          >
            <div className="relative h-[500px] w-[500px] mx-auto">
              {/* Main Image */}
              <motion.div 
                className="absolute top-0 left-0 h-80 w-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#00D0AB]/50 transform rotate-3 hover:rotate-1 transition-transform duration-500"
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D0AB]/20 to-transparent z-10"></div>
                <Image
                  src="/images/hero.jpg"
                  alt="Youth collaborating on climate innovation in Africa"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              {/* Secondary Image */}
              <motion.div 
                className="absolute bottom-0 right-0 h-72 w-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#0B5FBA]/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B5FBA]/20 to-transparent z-10"></div>
                <Image
                  src="/images/hero3.jpg"
                  alt="Climate adaptation solutions in action"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
                
             
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 