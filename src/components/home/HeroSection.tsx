import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B5FBA] text-white">
      {/* Subtle Background SVG */}
      <Image
        src="/images/africa-map.svg"
        alt="Africa Map Background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 w-full h-full opacity-[3%] pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B5FBA] via-[#0B5FBA]/80 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight"
            variants={itemVariants}
          >
            Innovate for Africa's{" "}
            <span className="text-[#00D0AB]">Climate Future</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            The In-country YouthADAPT Challenge is calling on young entrepreneurs and innovators to drive climate adaptation and resilience across Africa.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              className="group rounded-full bg-[#00D0AB] text-[#0B5FBA] hover:bg-white px-8 py-4 text-lg font-bold shadow-2xl shadow-[#00D0AB]/20 transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/apply" className="flex items-center gap-3">
                Apply Today
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 