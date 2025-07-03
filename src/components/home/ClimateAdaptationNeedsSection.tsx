"use client";

import { 
  MapPin,
  Coffee,
  Train,
  Car,
  Bus,
  Beef,
  ChevronRight,
  Globe
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const countryAdaptationNeeds = [
  {
    id: 'ghana',
    country: "Ghana",
    icon: Coffee,
    title: "Coffee Plantation Adaptation",
    description: "Climate-resilient coffee farming techniques, drought-resistant varieties, and sustainable processing methods for enhanced productivity.",
    challenge: "Rising temperatures and irregular rainfall patterns threaten coffee yields",
    solutions: "Shade-grown coffee systems, water-efficient irrigation, and climate-smart agricultural practices",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇬🇭",
    imageUrl: "/images/coffee-ghana.jpg"
  },
  {
    id: 'tanzania',
    country: "Tanzania", 
    icon: Train,
    title: "Standard Gauge Railway Infrastructure",
    description: "Climate-resilient railway systems, flood-resistant infrastructure, and sustainable transportation solutions.",
    challenge: "Extreme weather events and flooding threaten railway operations and safety",
    solutions: "Elevated track systems, improved drainage, and weather-resistant materials",
    color: "from-[#00D0AB] to-[#0B5FBA]",
    flag: "🇹🇿",
    imageUrl: "/images/railway-tanzania.jpg"
  },
  {
    id: 'rwanda',
    country: "Rwanda",
    icon: Bus,
    title: "Commuter Bus Transport Systems",
    description: "Sustainable public transportation, electric vehicle infrastructure, and climate-adaptive transit solutions.",
    challenge: "Air quality concerns and need for sustainable urban mobility solutions",
    solutions: "Electric bus fleets, smart charging infrastructure, and integrated transport planning",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇷🇼",
    imageUrl: "/images/bus-rwanda.jpg"
  },
  {
    id: 'kenya',
    country: "Kenya",
    icon: Car,
    title: "Leseru Road Infrastructure",
    description: "Climate-resilient road construction, flood-resistant design, and sustainable infrastructure development.",
    challenge: "Severe weather events and flooding damage critical road infrastructure",
    solutions: "Permeable pavements, improved drainage systems, and climate-adaptive road design",
    color: "from-[#00D0AB] to-[#0B5FBA]",
    flag: "🇰🇪",
    imageUrl: "/images/road-kenya.jpg"
  },
  {
    id: 'nigeria',
    country: "Nigeria",
    icon: Beef,
    title: "Livestock Management Systems",
    description: "Climate-smart livestock farming, drought-resistant grazing systems, and sustainable pastoral practices.",
    challenge: "Drought, desertification, and resource conflicts affecting livestock productivity",
    solutions: "Improved pasture management, water-efficient systems, and climate-resilient breeding",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇳🇬",
    imageUrl: "/images/cattle-nigeria.jpg"
  }
];

export function ClimateAdaptationNeedsSection() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00D0AB] to-[#0B5FBA] text-white px-8 py-4 rounded-full mb-6">
            <Globe className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Country-Specific Climate Adaptation Needs</h2>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            <span className="font-semibold text-[#00D0AB]">Targeted Solutions for Five African Nations</span>
          </p>
          <p className="text-lg text-gray-600 max-w-5xl mx-auto mt-4 leading-relaxed">
            Each country faces unique climate adaptation challenges. The In-Country YouthADAPT Challenge focuses on 
            sector-specific solutions tailored to address the most pressing infrastructure and agricultural 
            needs across Ghana, Tanzania, Rwanda, Kenya, and Nigeria.
          </p>
        </div>

        {/* Interactive Country Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {countryAdaptationNeeds.map((country) => {
            const IconComponent = country.icon;
            const isSelected = selectedCountry === country.id;
            
            return (
              <div 
                key={country.id}
                className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isSelected 
                    ? 'border-[#00D0AB] ring-4 ring-[#00D0AB]/20 scale-105' 
                    : 'border-gray-100 hover:border-[#0B5FBA]/30'
                }`}
                onClick={() => setSelectedCountry(isSelected ? null : country.id)}
              >
                {/* Country Header */}
                <div className={`bg-gradient-to-r ${country.color} p-6`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{country.flag}</div>
                      <div>
                        <h3 className="text-xl font-bold">{country.country}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm opacity-90">Focus Area</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`h-6 w-6 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={country.imageUrl}
                    alt={`${country.title} in ${country.country}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <IconComponent className="h-6 w-6 text-[#0B5FBA]" />
                    <h4 className="text-lg font-bold text-gray-800">{country.title}</h4>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {country.description}
                  </p>

                  {/* Expandable Details */}
                  {isSelected && (
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-300">
                      <div>
                        <h5 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          Key Challenge
                        </h5>
                        <p className="text-sm text-gray-600">{country.challenge}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-[#00D0AB] mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#00D0AB] rounded-full"></div>
                          Adaptation Solutions
                        </h5>
                        <p className="text-sm text-gray-600">{country.solutions}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#0B5FBA] to-[#00D0AB] rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Make an Impact?</h3>
            <p className="text-blue-100 mb-6 text-lg">
              Click on any country above to explore specific adaptation challenges and discover 
              how your innovation can address these critical needs.
            </p>
            <div className="flex items-center justify-center gap-4 text-white">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span>Click to expand details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white/70 rounded-full"></div>
                <span>Country-specific solutions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 