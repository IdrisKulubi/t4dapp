"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FormStepIndicator } from "./form-step-indicator";
import { PersonalInfoForm } from "./forms/personal-info-form";
import { BusinessInfoForm } from "./forms/business-info-form";
import { ClimateAdaptationForm } from "./forms/climate-adaptation-form";
import { FinancialInfoForm } from "./forms/financial-info-form";
import { ReviewSubmitForm } from "./forms/review-submit-form";
import { personalInfoSchema } from "./schemas/personal-info-schema";
import { businessInfoSchema } from "./schemas/business-info-schema";
import { climateAdaptationSchema } from "./schemas/climate-adaptation-schema";
import { financialInfoSchema } from "./schemas/financial-info-schema";
import { supportNeedsSchema } from "./schemas/support-needs-schema";
import { useMediaQuery } from "@/hooks/use-media-query";
import { defaultBusinessInfo } from "./schemas/business-info-schema";
import { defaultClimateAdaptation } from "./schemas/climate-adaptation-schema";
import { defaultFinancialInfo } from "./schemas/financial-info-schema";
import { defaultSupportNeeds } from "./schemas/support-needs-schema";
import { SupportNeedsForm } from "./forms/support-needs-form";

// Application form steps
const STEPS = [
  { id: "personal", label: "Personal Info", schema: personalInfoSchema, description: "Your basic details and contact information" },
  { id: "business", label: "Business Info", schema: businessInfoSchema, description: "Tell us about your business" },
  { id: "adaptation", label: "Climate Adaptation", schema: climateAdaptationSchema, description: "How your business addresses climate challenges" },
  { id: "financial", label: "Financial Info", schema: financialInfoSchema, description: "Financial details and funding needs" },
  { id: "support", label: "Support Needs", schema: supportNeedsSchema, description: "The support you're looking for" },
  { id: "review", label: "Review & Submit", schema: z.object({}).optional(), description: "Review your application before submitting" },
];

// Combined form schema
const applicationFormSchema = z.object({
  personal: personalInfoSchema,
  business: businessInfoSchema.shape.business,
  adaptation: climateAdaptationSchema.shape.adaptation,
  financial: financialInfoSchema.shape.financial,
  support: supportNeedsSchema.shape.support,
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export function ApplicationForm() {
  const [activeStep, setActiveStep] = useState(STEPS[0].id);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      personal: {},
      business: defaultBusinessInfo.business,
      adaptation: defaultClimateAdaptation.adaptation,
      financial: defaultFinancialInfo.financial,
      support: defaultSupportNeeds.support,
    },
    mode: "onChange",
  });
  
  // Calculate progress
  useEffect(() => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    const progressPercentage = ((currentIndex) / (STEPS.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [activeStep]);

  const goToStep = (stepId: string) => {
    if (activeStep === stepId) return;
    
    // Check if we're trying to navigate forward
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    const targetIndex = STEPS.findIndex((step) => step.id === stepId);
    
    if (targetIndex > currentIndex) {
      // Validate current step before moving forward
      validateCurrentStep(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setActiveStep(stepId);
          setIsAnimating(false);
        }, 300);
      });
    } else {
      // Always allow moving backward
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep(stepId);
        setIsAnimating(false);
      }, 300);
    }
  };
  
  const validateCurrentStep = (onSuccess: () => void) => {
    const currentStep = STEPS.find((step) => step.id === activeStep);
    if (!currentStep || !currentStep.schema || currentStep.id === 'review') {
        // If no schema for the step or it's the review step, just succeed
        if (!completedSteps.includes(activeStep) && currentStep?.id !== 'review') {
          setCompletedSteps([...completedSteps, activeStep]);
        }
        onSuccess();
        return;
    }

    // Get the data for the current step
    const currentStepData = form.getValues()[activeStep as keyof ApplicationFormValues];

    try {
        // Determine the correct schema part to use for validation
        let schemaPartToUse: z.ZodTypeAny | undefined;

        // Check if the schema has a shape property and a key matching the active step
        // Example: businessInfoSchema.shape.business
        if (currentStep.schema instanceof z.ZodObject && currentStep.schema.shape && activeStep in currentStep.schema.shape) {
            schemaPartToUse = currentStep.schema.shape[activeStep as keyof typeof currentStep.schema.shape];
        } else {
            // Otherwise, assume the schema directly defines the shape for this step's data
            // Example: personalInfoSchema directly defines { firstName: ... }
            schemaPartToUse = currentStep.schema;
        }

        if (!schemaPartToUse) {
            console.warn(`Could not determine schema part for step: ${activeStep}. Skipping validation.`);
            onSuccess(); // Allow moving forward if schema part is indeterminable
            return;
        }
        
        // Validate the current step's data against the determined schema part
        const validationResult = schemaPartToUse.safeParse(currentStepData);

        if (!validationResult.success) {
             // Throw the ZodError to be caught below
             throw validationResult.error;
        }

        // Mark step as completed if not already
        if (!completedSteps.includes(activeStep)) {
          setCompletedSteps([...completedSteps, activeStep]);
        }

        onSuccess(); // Validation successful, proceed

    } catch (error) {
        if (error instanceof z.ZodError) {
          toast.error("Please fill all required fields correctly before proceeding.");
          // Log the specific Zod errors for debugging
          console.error(`Zod Validation Errors for step '${activeStep}':`, error.errors);
          
          // Trigger validation on the form to show errors under the correct step namespace
          form.trigger(activeStep as keyof ApplicationFormValues);
        } else {
          console.error(`Unexpected error during validation for step '${activeStep}':`, error);
          toast.error("An unexpected error occurred during validation.");
        }
    }
  };
  
  const goToNextStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    if (currentIndex < STEPS.length - 1) {
      validateCurrentStep(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setActiveStep(STEPS[currentIndex + 1].id);
          setIsAnimating(false);
        }, 300);
      });
    }
  };
  
  const goToPreviousStep = () => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    if (currentIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep(STEPS[currentIndex - 1].id);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="border rounded-lg shadow-sm form-card">
        <CardContent className="pt-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Application Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Step Indicator - side panel on desktop */}
            <div className={`${isMobile ? 'w-full' : 'w-1/4 lg:border-r pr-6'}`}>
              <FormStepIndicator 
                steps={STEPS}
                currentStep={activeStep}
                completedSteps={completedSteps}
                onStepClick={goToStep}
              />
            </div>
            
            {/* Form Content */}
            <div className={`${isMobile ? 'w-full' : 'w-3/4'}`}>
              <Tabs value={activeStep} className="w-full">
                <div className={`mt-2 form-step ${isAnimating ? '' : 'active'}`}>
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
              
              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={goToPreviousStep}
                  disabled={activeStep === STEPS[0].id || isAnimating}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {activeStep !== STEPS[STEPS.length - 1].id ? (
                  <Button 
                    onClick={goToNextStep}
                    disabled={isAnimating}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 