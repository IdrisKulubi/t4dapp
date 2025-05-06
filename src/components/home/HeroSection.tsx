import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-br from-teal-950/60 to-blue-950/60">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text & CTA */}
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-teal-900 text-teal-100">
              YouthAdapt 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              Empowering Africa's Next Generation of Climate Innovators
            </h1>
            <p className="text-xl text-gray-300 max-w-xl">
              Join the YouthAdapt Challenge and help build a resilient, sustainable future for Africa. Open to young entrepreneurs and MSMEs driving change in food security and infrastructure.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full bg-teal-600 hover:bg-teal-700 text-white" asChild>
                <Link href="/apply" className="flex items-center gap-2">
                  Apply Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-teal-300 border-teal-700 hover:bg-teal-900/50" asChild>
                <a href="#eligibility">Learn More</a>
              </Button>
            </div>
          </motion.div>

          {/* Right: Image Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-md mx-auto lg:ml-auto"
          >
            <div className="flex items-center justify-center relative h-[400px] w-[400px] sm:h-[450px] sm:w-[450px] md:h-[500px] md:w-[500px]">
              {/* First Image - Main Youth/Innovation */}
              <div className="absolute top-0 left-0 h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-teal-700 transform rotate-3">
                <Image
                  src="/images/hero.jpg"
                  alt="Youth collaborating on climate innovation in Africa"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Second Image - Climate Impact */}
              <div className="absolute bottom-0 right-0 h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72 rounded-3xl overflow-hidden shadow-2xl border-4 border-blue-700 transform -rotate-2">
                <Image
                  src="/images/hero2.jpg"
                  alt="Climate adaptation solutions in action"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Accent Africa Map Overlay */}
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-80">
                <Image
                  src="/images/africa-map.svg"
                  alt="Africa Map"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 