"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, FileText, CheckCircle2, Circle, Menu, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      personal: {
        firstName: "",
        lastName: "",
        gender: undefined,
        dateOfBirth: undefined,
        email: "",
        phoneNumber: "",
        citizenship: undefined,
        highestEducation: undefined,
      },
      business: {
        ...defaultBusinessInfo.business,
        name: "",
        description: "",
        problemSolved: "",
        city: "",
        startDate: undefined,
        isRegistered: undefined,
        country: undefined,
        climateAdaptationContribution: "",
        productServiceDescription: "",
        climateExtremeImpact: "",
        productionCapacityLastSixMonths: "",
        currentChallenges: "",
        supportNeeded: "",
        customerSegments: [],
        registeredCountries: "",
      },
      adaptation: {
        ...defaultClimateAdaptation.adaptation,
        solutionTitle: "",
        solutionDescription: "",
        primaryChallenge: undefined,
        primaryChallengeOther: "",
        secondaryChallenges: [],
        targetBeneficiaries: "",
        estimatedBeneficiariesCount: null,
        technologyDescription: "",
        innovationDescription: "",
        implementationApproach: "",
        scalingStrategy: "",
        measurableImpact: "",
      },
      financial: {
        ...defaultFinancialInfo.financial,
        annualRevenue: null,
        revenueGrowthRate: null,
        profitMargin: null,
        previousFunding: undefined,
        previousFundingSources: [],
        previousFundingAmount: null,
        requestedFundingAmount: undefined,
        fundingUse: "",
        revenueModel: "",
        costStructure: "",
        pathToSustainability: "",
        financialChallenges: "",
      },
      support: {
        ...defaultSupportNeeds.support,
        supportTypes: [],
        supportTypesOther: "",
        mentorshipNeeds: "",
        preferredMentorExpertise: [],
        trainingNeeds: "",
        preferredTrainingFormat: undefined,
        networkingNeeds: "",
        desiredNetworkingConnections: [],
        resourcesNeeded: "",
        expectedBusinessImpact: "",
        expectedEnvironmentalImpact: "",
      },
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
        setSidebarOpen(false); // Close sidebar on mobile after selection
        setTimeout(() => {
          setActiveStep(stepId);
          setIsAnimating(false);
        }, 300);
      });
    } else {
      // Always allow moving backward
      setIsAnimating(true);
      setSidebarOpen(false); // Close sidebar on mobile after selection
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

    // Get the data for the current step - properly handle nested structure
    const allFormData = form.getValues();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let currentStepData: any;
    
    if (activeStep === 'personal') {
      currentStepData = allFormData.personal;
    } else if (activeStep === 'business') {
      currentStepData = allFormData.business;
    } else if (activeStep === 'adaptation') {
      currentStepData = allFormData.adaptation;
    } else if (activeStep === 'financial') {
      currentStepData = allFormData.financial;
    } else if (activeStep === 'support') {
      currentStepData = allFormData.support;
    } else {
      currentStepData = allFormData[activeStep as keyof ApplicationFormValues];
    }

    try {
        // Determine the correct schema to use for validation
        let schemaToUse: z.ZodTypeAny;

        if (activeStep === 'personal') {
          // For personal step, use the personalInfoSchema directly
          schemaToUse = currentStep.schema;
        } else {
          // For other steps, extract the nested schema part
          if (currentStep.schema instanceof z.ZodObject && currentStep.schema.shape && activeStep in currentStep.schema.shape) {
            schemaToUse = currentStep.schema.shape[activeStep as keyof typeof currentStep.schema.shape];
          } else {
            schemaToUse = currentStep.schema;
          }
        }
        
        // Validate the current step's data
        const validationResult = schemaToUse.safeParse(currentStepData);

        if (!validationResult.success) {
          console.error(`Validation failed for step '${activeStep}':`, validationResult.error.errors);
          toast.error("Please fill all required fields correctly before proceeding.");
          
          // Trigger validation on the form to show errors
          if (activeStep === 'personal') {
            form.trigger('personal');
          } else {
            form.trigger(activeStep as keyof ApplicationFormValues);
          }
          return;
        }

        // Mark step as completed if not already
        if (!completedSteps.includes(activeStep)) {
          setCompletedSteps([...completedSteps, activeStep]);
        }

        onSuccess(); // Validation successful, proceed

    } catch (error) {
        console.error(`Unexpected error during validation for step '${activeStep}':`, error);
        toast.error("An unexpected error occurred during validation.");
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

  const currentStepData = STEPS.find((step) => step.id === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-green-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Application Form</h1>
                <p className="text-sm text-gray-600">YouthAdapt Challenge</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{Math.round(progress)}%</p>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
          
          {/* Mobile Progress Bar */}
          <div className="px-4 pb-3">
            <Progress value={progress} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 z-30 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : ""
        )}>
          {/* Desktop Header */}
          {!isMobile && (
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Application Form</h1>
                  <p className="text-slate-300 text-sm">YouthAdapt Challenge Program</p>
                </div>
              </div>
              
              {/* Desktop Progress */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Progress</span>
                  <span className="text-white font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>
            </div>
          )}

          {/* Steps Navigation */}
          <div className="p-6 space-y-2">
            <h2 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">
              Application Steps
            </h2>
            {STEPS.map((step, index) => {
              const isActive = activeStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isClickable = index === 0 || completedSteps.includes(STEPS[index - 1].id);
              
              return (
                <button
                  key={step.id}
                  onClick={() => isClickable && goToStep(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30" 
                      : isCompleted
                      ? "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600"
                      : isClickable
                      ? "bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700"
                      : "bg-slate-800/20 border border-slate-700/50 cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : isClickable
                        ? "bg-slate-600 text-slate-300"
                        : "bg-slate-700 text-slate-500"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isActive ? (
                        <Circle className="h-4 w-4 fill-current" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium",
                        isActive 
                          ? "text-white" 
                          : isCompleted
                          ? "text-slate-200"
                          : isClickable
                          ? "text-slate-300"
                          : "text-slate-500"
                      )}>
                        {step.label}
                      </p>
                      <p className={cn(
                        "text-sm leading-tight mt-1",
                        isActive 
                          ? "text-slate-300" 
                          : "text-slate-400"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-auto p-6 border-t border-slate-700">
            <div className="bg-slate-800/50 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">Need Help?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Contact our support team if you have questions about the application process.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          {!isMobile && (
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
              <div className="px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {currentStepData?.label}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentStepData?.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Step {STEPS.findIndex(step => step.id === activeStep) + 1} of {STEPS.length}
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.round(progress)}% Complete
                    </p>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Form Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-4 lg:p-8">
              <Tabs value={activeStep} className="w-full">
                <div className={cn(
                  "transition-all duration-300 ease-in-out",
                  isAnimating ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
                )}>
                  <TabsContent value="personal" className="mt-0">
                    <PersonalInfoForm form={form} onNext={goToNextStep} />
                  </TabsContent>
                  
                  <TabsContent value="business" className="mt-0">
                    <BusinessInfoForm 
                      form={form} 
                      onNext={goToNextStep} 
                      onPrevious={goToPreviousStep} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="adaptation" className="mt-0">
                    <ClimateAdaptationForm 
                      form={form} 
                      onNext={goToNextStep} 
                      onPrevious={goToPreviousStep} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="financial" className="mt-0">
                    <FinancialInfoForm 
                      form={form} 
                      onNext={goToNextStep} 
                      onPrevious={goToPreviousStep} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="support" className="mt-0">
                    <SupportNeedsForm 
                      form={form} 
                      onNext={goToNextStep} 
                      onPrevious={goToPreviousStep} 
                    />
                  </TabsContent>
                  
                  <TabsContent value="review" className="mt-0">
                    <ReviewSubmitForm 
                      form={form} 
                      onPrevious={goToPreviousStep} 
                    />
                  </TabsContent>
                </div>
              </Tabs>

              {/* Navigation Buttons - Now visible on all screen sizes */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-700 p-4 mt-8 rounded-lg text-gray-950">
                <div className="flex justify-between gap-3 max-w-md mx-auto lg:max-w-none text-gray-950">
                  <Button
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={activeStep === STEPS[0].id || isAnimating}
                    className={cn(
                      "flex-1 lg:flex-none lg:px-6 h-12 border-2",
                      "border-gray-300 text-gray-700 bg-white",
                      "hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700",
                      "dark:border-gray-600 dark:text-gray-100 dark:bg-gray-900",
                      "dark:hover:border-blue-400 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  
                  {activeStep !== STEPS[STEPS.length - 1].id && (
                    <Button 
                      onClick={goToNextStep}
                      disabled={isAnimating}
                      className="flex-1 lg:flex-none lg:px-6 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 