"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What is the In-Country YouthADAPT Solutions Challenge?",
    answer: "The In-Country YouthADAPT Solutions Challenge is a comprehensive program designed to identify, support, and accelerate promising youth-led climate adaptation solutions across Africa. We provide funding, mentorship, and resources to help entrepreneurs scale their impact in food security and infrastructure."
  },
  {
    question: "Who is eligible to apply?",
    answer: "Entrepreneurs aged 18-35 with legally registered businesses in one of our 5 focus countries are eligible: Kenya, Tanzania, Rwanda, Ghana, and Nigeria. Your business must have generated revenue for at least two years and focus on climate adaptation solutions in food security or infrastructure."
  },
  {
    question: "What kind of support do selected participants receive?",
    answer: "Selected participants receive comprehensive support including financial funding, one-on-one mentorship from industry experts, access to our network of investors and partners, technical assistance, and opportunities to showcase their solutions at international events."
  },
  {
    question: "How much funding is available?",
    answer: "We provide grants of up to $30,000. The exact amount depends on your business plan and growth potential. Additional investment opportunities may be available through our partner network."
  },
  {
    question: "What sectors do you focus on?",
    answer: "We specifically focus on climate adaptation solutions in two key sectors: food security (including agriculture, aquaculture, and food processing) and infrastructure (including water management, renewable energy, and climate-resilient construction)."
  },
  {
    question: "How long is the program?",
    answer: "The In-Country YouthADAPT Solutions Challenge is a 12-month program with intensive support in the first 6 months, followed by continued mentorship and network access. The program includes workshops, one-on-one sessions, and milestone-based funding releases."
  },
  {
    question: "What is the application process?",
    answer: "The application process involves submitting an online application with your business plan, financial statements, and impact metrics. This is followed by a review process, virtual interviews, and final selection. The entire process takes approximately 8-10 weeks."
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

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D0AB]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0B5FBA]/5 rounded-full blur-3xl"></div>
      
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
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#00D0AB]/10 to-[#0B5FBA]/10 text-[#00D0AB] text-sm font-semibold mb-6 border border-[#00D0AB]/20">
              Frequently Asked Questions
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] bg-clip-text text-transparent">
              Got Questions?
            </span>
            <br />
            <span className="text-slate-800">We Have Answers</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about the In-Country YouthADAPT Solutions Challenge. 
            Can&apos;t find what you&apos;re looking for? Contact our team directly.
          </p>
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              variants={fadeIn}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D0AB]/10 to-[#0B5FBA]/10 flex items-center justify-center group-hover:from-[#00D0AB]/20 group-hover:to-[#0B5FBA]/20 transition-colors duration-200">
                      <QuestionMarkCircleIcon className="w-5 h-5 text-[#00D0AB]" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-[#0B5FBA] transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <ChevronDownIcon className="w-5 h-5 text-slate-500 group-hover:text-[#00D0AB] transition-colors" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="pl-14">
                      <div className="w-full h-px bg-gradient-to-r from-[#00D0AB]/20 to-[#0B5FBA]/20 mb-4"></div>
                      <p className="text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
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
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Still have questions? Our team is here to help you navigate the application process.
          </p>
          <motion.a
            href="/apply"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white font-semibold hover:from-[#00D0AB]/90 hover:to-[#0B5FBA]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Start Your Application</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 