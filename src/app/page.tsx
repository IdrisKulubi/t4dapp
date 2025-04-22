import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">In-country YouthAdapt Challenge</h1>
          <p className="text-muted-foreground">
            Supporting young entrepreneurs and MSMEs in Africa building climate resilience
          </p>
        </div>

        <div className="space-y-4">
          <p>
            The In-country YouthAdapt Challenge program supports young entrepreneurs and micro, small, and
            medium-sized enterprises (MSMEs) in Africa who are developing innovative solutions to build
            resilience to the impacts of climate change.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Eligibility Criteria</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entrepreneurs aged 18-35 years</li>
            <li>Business legally registered to operate in Africa</li>
            <li>Business has generated revenues over a two-year period</li>
            <li>Business has a SMART business plan for adaptation solution</li>
            <li>Business demonstrates direct impact in food security or infrastructure</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Focus Countries</h2>
          <p>
            While applications are open across Africa, preference will be given to entrepreneurs
            from Kenya, Tanzania, Rwanda, Ghana, and Nigeria.
          </p>

          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/apply">Apply Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

