"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { BusinessInfoForm } from "./forms/business-info-form";
import { ClimateAdaptationForm } from "./forms/climate-adaptation-form";
import { FinancialInfoForm } from "./forms/financial-info-form";
import { SupportNeedsForm } from "./forms/support-needs-form";
import { ReviewSubmitForm } from "./forms/review-submit-form";
import { personalInfoSchema } from "./schemas/personal-info-schema";

// Application form steps
const STEPS = [
  { id: "personal", label: "Personal Info" },
  { id: "business", label: "Business Info" },
  { id: "adaptation", label: "Climate Adaptation" },
  { id: "financial", label: "Financial Info" },
  { id: "support", label: "Support Needs" },
  { id: "review", label: "Review & Submit" },
];

// Combined form schema
const applicationFormSchema = z.object({
  personal: personalInfoSchema.optional(),
  business: z.object({}).optional(),
  adaptation: z.object({}).optional(),
  financial: z.object({}).optional(),
  support: z.object({}).optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export function ApplicationForm() {
  const [activeStep, setActiveStep] = useState(STEPS[0].id);
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      personal: {},
      business: {},
      adaptation: {},
      financial: {},
      support: {},
    },
    mode: "onChange",
  });
  
  const goToNextStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    if (currentIndex < STEPS.length - 1) {
      setActiveStep(STEPS[currentIndex + 1].id);
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    if (currentIndex > 0) {
      setActiveStep(STEPS[currentIndex - 1].id);
    }
  };
  
  return (
    <div className="space-y-8">
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          {STEPS.map((step) => (
            <TabsTrigger key={step.id} value={step.id} disabled={false}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="mt-8">
          <TabsContent value="personal">
            <PersonalInfoForm form={form} onNext={goToNextStep} />
          </TabsContent>
          
          <TabsContent value="business">
            <BusinessInfoForm 
              form={form} 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
            />
          </TabsContent>
          
          <TabsContent value="adaptation">
            <ClimateAdaptationForm 
              form={form} 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
            />
          </TabsContent>
          
          <TabsContent value="financial">
            <FinancialInfoForm 
              form={form} 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
            />
          </TabsContent>
          
          <TabsContent value="support">
            <SupportNeedsForm 
              form={form} 
              onNext={goToNextStep} 
              onPrevious={goToPreviousStep} 
            />
          </TabsContent>
          
          <TabsContent value="review">
            <ReviewSubmitForm 
              form={form} 
              onPrevious={goToPreviousStep} 
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline" 
          onClick={goToPreviousStep}
          disabled={activeStep === STEPS[0].id}
        >
          Previous
        </Button>
        
        <Button 
          onClick={goToNextStep}
          disabled={activeStep === STEPS[STEPS.length - 1].id}
        >
          Next
        </Button>
      </div>
    </div>
  );
} 