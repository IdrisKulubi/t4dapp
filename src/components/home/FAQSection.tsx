"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDownIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

const faqs = [
  {
    question: "What is the YouthAdapt Challenge?",
    answer: "The YouthAdapt Challenge is a comprehensive program designed to identify, support, and accelerate promising youth-led climate adaptation solutions across Africa. We provide funding, mentorship, and resources to help entrepreneurs scale their impact in food security and infrastructure."
  },
  {
    question: "Who is eligible to apply?",
    answer: "Entrepreneurs aged 18-35 with legally registered businesses in African countries are eligible. Your business must have generated revenue for at least two years and focus on climate adaptation solutions in food security or infrastructure. Preference is given to applicants from Kenya, Tanzania, Rwanda, Ghana, and Uganda."
  },
  {
    question: "What kind of support do selected participants receive?",
    answer: "Selected participants receive comprehensive support including financial funding, one-on-one mentorship from industry experts, access to our network of investors and partners, technical assistance, and opportunities to showcase their solutions at international events."
  },
  {
    question: "How much funding is available?",
    answer: "Funding amounts vary based on the stage and needs of your business. We provide grants ranging from $10,000 to $100,000, with additional investment opportunities available through our partner network. The exact amount depends on your business plan and growth potential."
  },
  {
    question: "What sectors do you focus on?",
    answer: "We specifically focus on climate adaptation solutions in two key sectors: food security (including agriculture, aquaculture, and food processing) and infrastructure (including water management, renewable energy, and climate-resilient construction)."
  },
  {
    question: "How long is the program?",
    answer: "The YouthAdapt Challenge is a 12-month program with intensive support in the first 6 months, followed by continued mentorship and network access. The program includes workshops, one-on-one sessions, and milestone-based funding releases."
  },
  {
    question: "Can I apply if my business is not in the focus countries?",
    answer: "Yes! While we give preference to entrepreneurs from Kenya, Tanzania, Rwanda, Ghana, and Uganda, we welcome applications from across the African continent. Exceptional solutions from any African country will be considered."
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
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
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
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 text-sm font-semibold mb-6 border border-emerald-200">
              Frequently Asked Questions
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Got Questions?
            </span>
            <br />
            <span className="text-slate-800">We Have Answers</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to the most common questions about the YouthAdapt Challenge. 
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center group-hover:from-emerald-200 group-hover:to-blue-200 transition-colors duration-200">
                      <QuestionMarkCircleIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <ChevronDownIcon className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors" />
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
                      <div className="w-full h-px bg-gradient-to-r from-emerald-200 to-blue-200 mb-4"></div>
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
        
        {/* Contact CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="max-w-2xl mx-auto p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-slate-600 mb-6">
              Our team is here to help! Reach out to us directly and we&apos;ll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="mailto:info@youthadapt.org"
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold hover:from-emerald-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Email Us
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-flex items-center px-6 py-3 rounded-full border-2 border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Form
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 