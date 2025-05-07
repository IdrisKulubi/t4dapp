
import Image from "next/image";

export function PartnerLogosSection() {
  return (
    <section className="bg-transparent py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="flex items-center gap-4">
          <Image src="/images/gca-logo.png" alt="GCA Logo" className="h-12 w-auto" />
          <span className="text-gray-300 font-medium">Global Center on Adaptation</span>
        </div>
        <div className="flex items-center gap-4">
          <Image   src="/images/kcic-logo.png" alt="KCIC Logo" className="h-12 w-auto" />
          <span className="text-gray-300 font-medium">Kenya Climate Innovation Center</span>
        </div>
      </div>
    </section>
  );
} 