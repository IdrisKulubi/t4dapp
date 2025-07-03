"use client";

import { 
  MapPin,
  Coffee,
  Train,
  Car,
  Bus,
  Beef,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const countryAdaptationNeeds = [
  {
    id: 'ghana',
    country: "Ghana",
    icon: Coffee,
    title: "Ghana Adaptation Needs",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇬🇭",
    imageUrl: "/images/coffee-ghana.jpg",
    link: "https://docs.google.com/gview?url=https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8EnvMM1l4eEH3VkOvC7NcDpbmQMuxrtP1sznI&embedded=true"
  },
  {
    id: 'kenya',
    country: "Kenya",
    icon: Car,
    title: "Kenya Adaptation Needs",
    color: "from-[#00D0AB] to-[#0B5FBA]",
    flag: "🇰🇪",
    imageUrl: "/images/road-kenya.jpg",
    link: "https://docs.google.com/gview?url=https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8zpx4Gv7rHgFwcotRx9dYBj87Eis3LWhbCQUS&embedded=true"
  },
  {
    id: 'rwanda',
    country: "Rwanda",
    icon: Bus,
    title: "Rwanda Adaptation Needs",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇷🇼",
    imageUrl: "/images/bus-rwanda.jpg",
    link: "https://docs.google.com/gview?url=https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8eXTCF9xUXin8AtzBGEc6lrRjVfyx9WhJFMuL&embedded=true"
  }, {
    id: 'nigeria',
    country: "Nigeria",
    icon: Beef,
    title: "Nigeria Adaptation Needs",
    color: "from-[#0B5FBA] to-[#00D0AB]",
    flag: "🇳🇬",
    imageUrl: "/images/cattle-nigeria.jpg",
    link: "https://docs.google.com/gview?url=https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8sFrhYYu3TGKCb34qjMkzw950DWAEB61XOnLa&embedded=true"
  },
  {
    id: 'tanzania',
    country: "Tanzania", 
    icon: Train,
    title: "Tanzania Adaptation Needs",
    color: "from-[#00D0AB] to-[#0B5FBA]",
    flag: "🇹🇿",
    imageUrl: "/images/railway-tanzania.jpg",
    link: "https://docs.google.com/gview?url=https://cfg6261wt2.ufs.sh/f/e4b8ICxUXin8gZXpOUQ1ChdRzsLjVJ36It7Nykqp0vG29PEX&embedded=true"
  }


 
];

export function ClimateAdaptationNeedsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Climate Adaptation Needs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore the specific climate adaptation challenges and opportunities across our five focus countries
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {countryAdaptationNeeds.map((country) => {
            const IconComponent = country.icon;
            
            return (
              <div 
                key={country.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${country.color} p-6`}>
                  <div className="flex items-center gap-4 text-white">
                    <div className="text-3xl">{country.flag}</div>
                    <div>
                      <h3 className="text-xl font-bold">{country.country}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm opacity-90">Focus Area</span>
                      </div>
                    </div>
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
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-4 flex-grow">
                    <IconComponent className="h-8 w-8 text-[#0B5FBA] flex-shrink-0" />
                    <h4 className="text-lg font-bold text-gray-800">{country.title}</h4>
                  </div>
                  
                  {/* Button is now here and always visible */}
                  <Link href={country.link} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-[#0B5FBA] text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-[#00D0AB] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    <span>View More</span>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
} 