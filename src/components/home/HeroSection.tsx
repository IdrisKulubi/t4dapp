import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-blue-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
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
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                🌍 YouthAdapt Challenge 2024
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Empowering Africa's
              </span>
              <br />
              <span className="text-white">
                Climate Innovators
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Join the next generation of entrepreneurs building resilient solutions for 
              <span className="text-emerald-400 font-semibold"> food security</span> and 
              <span className="text-blue-400 font-semibold"> infrastructure</span> across Africa.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-emerald-500/25 transition-all duration-300" 
                asChild
              >
                <Link href="/apply" className="flex items-center gap-3">
                  Start Your Application
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="group rounded-full border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:border-emerald-500/50 px-8 py-4 text-lg backdrop-blur-sm transition-all duration-300" 
                asChild
              >
                <a href="#about" className="flex items-center gap-3">
                  <PlayIcon className="w-5 h-5" />
                  Watch Demo
                </a>
              </Button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">50+</div>
                <div className="text-sm text-slate-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">$2M+</div>
                <div className="text-sm text-slate-400">In Funding</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">1000+</div>
                <div className="text-sm text-slate-400">Innovators</div>
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
                className="absolute top-0 left-0 h-80 w-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-500/50 transform rotate-3 hover:rotate-1 transition-transform duration-500"
                whileHover={{ scale: 1.05, rotate: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent z-10"></div>
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
                className="absolute bottom-0 right-0 h-72 w-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-500/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent z-10"></div>
                <Image
                  src="/images/hero2.jpg"
                  alt="Climate adaptation solutions in action"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              {/* Floating Badge */}
              <motion.div 
                className="absolute top-20 right-10 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                🚀 Apply Now
              </motion.div>
              
              {/* Africa Map Accent */}
              <motion.div 
                className="absolute bottom-10 left-10 w-32 h-32 opacity-60"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Image
                  src="/images/africa-map.svg"
                  alt="Africa Map"
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 