"use client";

import { 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Wheat, 
  Rabbit, 
  Smartphone, 
  Users,
  AlertTriangle,
  ExternalLink,
  FileText
} from "lucide-react";

const adaptationNeeds = [
  {
    icon: Droplets,
    title: "Drought and Water Scarcity",
    description: "Resilient irrigation systems, water harvesting techniques, and efficient water management.",
    color: "from-[#0B5FBA] to-cyan-600"
  },
  {
    icon: Thermometer,
    title: "Heat Stress and Rising Temperatures", 
    description: "Heat-resilient infrastructure, reflective pavements, and passive cooling innovations.",
    color: "from-red-600 to-orange-600"
  },
  {
    icon: CloudRain,
    title: "Flooding and Stormwater Management",
    description: "Smart flood response systems, green infrastructure (e.g., rain gardens, wetlands), and permeable pavements.",
    color: "from-indigo-600 to-[#0B5FBA]"
  },
  {
    icon: Wheat,
    title: "Post-Harvest Losses",
    description: "Solar-powered cold storage, hermetic storage bags, and resilient market chains.",
    color: "from-amber-600 to-yellow-600"
  },
  {
    icon: Rabbit,
    title: "Livestock and Crop Resilience",
    description: "Heat- and disease-tolerant breeds, sustainable rangeland practices, and CSA (Climate-Smart Agriculture).",
    color: "from-[#00D0AB] to-emerald-600"
  },
  {
    icon: Smartphone,
    title: "Climate Information Access",
    description: "Mobile advisory platforms, localized weather alerts, and community-based resource hubs.",
    color: "from-purple-600 to-violet-600"
  },
  {
    icon: Users,
    title: "Inclusive Adaptation",
    description: "Gender-responsive approaches ensuring women and youth access inputs, training, financing, and market tools.",
    color: "from-pink-600 to-rose-600"
  }
];

export function ClimateAdaptationNeedsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white px-8 py-4 rounded-full mb-6">
            <h2 className="text-2xl font-bold">Climate Adaptation Needs</h2>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-[#00D0AB]">Core to the YouthADAPT Challenge</span>
          </p>
          <p className="text-lg text-gray-600 max-w-5xl mx-auto mt-4 leading-relaxed">
            The YouthADAPT Challenge is rooted in identifying and addressing critical climate adaptation needs across Africa. 
            These needs reflect the urgent challenges faced by communities and enterprises due to climate change, and guide 
            the innovative solutions we aim to support through this program.
          </p>
        </div>

        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-2xl p-6 mb-12 shadow-lg">
          <div className="flex items-center gap-4">
            <AlertTriangle className="h-8 w-8 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold mb-2">🚨 Key Adaptation Needs</h3>
              <p className="text-red-100">
                These adaptation needs are not just thematic areas—they represent the foundation for action. 
                Each applicant is encouraged to demonstrate how their innovation directly addresses one or more 
                of these core adaptation needs.
              </p>
            </div>
          </div>
        </div>

        {/* Adaptation Needs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adaptationNeeds.map((need, index) => {
            const IconComponent = need.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`bg-gradient-to-r ${need.color} p-6`}>
                  <div className="flex items-center gap-4 text-white">
                    <IconComponent className="h-8 w-8 flex-shrink-0" />
                    <h3 className="text-lg font-bold leading-tight">{need.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed">
                    {need.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Read More Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-[#0B5FBA]" />
              <h3 className="text-xl font-bold text-gray-800">Want to Learn More?</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Explore our comprehensive documentation on climate adaptation needs and potential solutions 
              for food security and resilient infrastructure across the eligible countries.
            </p>
            <a
              href="https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8OQi6uWsmBwkUf8KguJpDHR164NqvSjTAQE5O"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] text-white px-8 py-4 rounded-full font-semibold hover:from-[#0B5FBA]/90 hover:to-[#00D0AB]/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <span>Read the Needs Assessment Report</span>
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>

       
      </div>
    </section>
  );
} 