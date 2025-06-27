"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  CheckCircle2, 
  
  X, 
  
  Loader2, 
  Save, 
  Clock,
  ArrowRight,
  Home,
  Menu,
  FileText,
  Download
} from "lucide-react";
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
import { cn, safeToDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Application form steps with enhanced metadata
const STEPS = [
  { 
    id: "personal", 
    label: "Personal Details", 
    shortLabel: "Personal",
    schema: personalInfoSchema, 
    description: "Your basic information and contact details",
    estimatedTime: "5 min",
    icon: "👤"
  },
  { 
    id: "business", 
    label: "Business Information", 
    shortLabel: "Business",
    schema: businessInfoSchema, 
    description: "Tell us about your business and operations",
    estimatedTime: "15 min",
    icon: "🏢"
  },
  { 
    id: "adaptation", 
    label: "Climate Solution", 
    shortLabel: "Solution",
    schema: climateAdaptationSchema, 
    description: "Your climate adaptation solution details",
    estimatedTime: "20 min",
    icon: "🌍"
  },
  { 
    id: "financial", 
    label: "Financial Details", 
    shortLabel: "Financial",
    schema: financialInfoSchema, 
    description: "Revenue, funding needs, and financial projections",
    estimatedTime: "10 min",
    icon: "💰"
  },
  { 
    id: "support", 
    label: "Support Needs", 
    shortLabel: "Support",
    schema: supportNeedsSchema, 
    description: "Mentorship and resources you need",
    estimatedTime: "10 min",
    icon: "🤝"
  },
  { 
    id: "review", 
    label: "Review & Submit", 
    shortLabel: "Review",
    schema: z.object({}).optional(), 
    description: "Final review before submission",
    estimatedTime: "5 min",
    icon: "✅"
  },
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

// Draft save key
const DRAFT_SAVE_KEY = "t4dapp_application_draft";

export function ApplicationForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(STEPS[0].id);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
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
        countryOfResidence: undefined,
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
      adaptation: defaultClimateAdaptation.adaptation,
      financial: defaultFinancialInfo.financial,
      support: defaultSupportNeeds.support,
    },
    mode: "onChange",
  });

  // Load draft from localStorage
  const loadDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(DRAFT_SAVE_KEY);
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.formData) {
          // Convert date strings back to Date objects using safe conversion
          const formData = { ...parsedDraft.formData };
          
          // Handle dateOfBirth conversion
          if (formData.personal?.dateOfBirth) {
            const convertedDate = safeToDate(formData.personal.dateOfBirth);
            if (convertedDate) {
              formData.personal.dateOfBirth = convertedDate;
            }
          }
          
          // Handle business startDate conversion
          if (formData.business?.startDate) {
            const convertedDate = safeToDate(formData.business.startDate);
            if (convertedDate) {
              formData.business.startDate = convertedDate;
            }
          }
          
          // Handle funding date conversion
          if (formData.business?.funding?.fundingDate) {
            const convertedDate = safeToDate(formData.business.funding.fundingDate);
            if (convertedDate) {
              formData.business.funding.fundingDate = convertedDate;
            }
          }
          
          form.reset(formData);
          setActiveStep(parsedDraft.currentStep || STEPS[0].id);
          setCompletedSteps(parsedDraft.completedSteps || []);
          setLastSaved(new Date(parsedDraft.timestamp));
          toast.success("Draft loaded successfully!", {
            description: "Your previous progress has been restored.",
          });
        }
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }, [form]);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    try {
      setIsAutoSaving(true);
      const formData = form.getValues();
      const draftData = {
        formData,
        currentStep: activeStep,
        completedSteps,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_SAVE_KEY, JSON.stringify(draftData));
      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [form, activeStep, completedSteps]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  // Save draft when form data changes (debounced)
  useEffect(() => {
    const subscription = form.watch(() => {
      const timeoutId = setTimeout(saveDraft, 2000);
      return () => clearTimeout(timeoutId);
    });
    return () => subscription.unsubscribe();
  }, [form, saveDraft]);

  // Calculate progress
  useEffect(() => {
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    const progressPercentage = ((currentIndex) / (STEPS.length - 1)) * 100;
    setProgress(progressPercentage);
  }, [activeStep]);
  
  // Authentication guard
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      toast.error("You must be logged in to access the application form");
      router.push("/login");
      return;
    }
    
    if (session?.user?.email && !form.getValues('personal.email')) {
        form.setValue('personal.email', session.user.email);
    }
  }, [status, router, session, form]);

  // Clear draft after successful submission
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_SAVE_KEY);
    setLastSaved(null);
  };

  // Manual save draft function
  const handleSaveDraft = () => {
    saveDraft();
    toast.success("Draft saved!", {
      description: "Your progress has been saved.",
      duration: 2000,
    });
  };

  // Download application as JSON
  const downloadApplication = () => {
    const formData = form.getValues();
    const applicationData = {
      ...formData,
      metadata: {
        savedAt: new Date().toISOString(),
        step: activeStep,
        completedSteps,
      }
    };

    const dataStr = JSON.stringify(applicationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `youth-adapt-application-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Application downloaded successfully!");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const goToStep = (stepId: string) => {
    if (activeStep === stepId) return;
    
    const currentIndex = STEPS.findIndex((step) => step.id === activeStep);
    const targetIndex = STEPS.findIndex((step) => step.id === stepId);
    
    if (targetIndex > currentIndex) {
      validateCurrentStep(() => {
        setIsAnimating(true);
        setSidebarOpen(false);
        setTimeout(() => {
          setActiveStep(stepId);
          setIsAnimating(false);
          scrollToTop();
        }, 200);
      });
    } else {
      setIsAnimating(true);
      setSidebarOpen(false);
      setTimeout(() => {
        setActiveStep(stepId);
        setIsAnimating(false);
        scrollToTop();
      }, 200);
    }
  };
  
  const validateCurrentStep = (onSuccess: () => void) => {
    const currentStep = STEPS.find((step) => step.id === activeStep);
    if (!currentStep || !currentStep.schema || currentStep.id === 'review') {
        if (!completedSteps.includes(activeStep) && currentStep?.id !== 'review') {
          setCompletedSteps([...completedSteps, activeStep]);
        }
        onSuccess();
        return;
    }

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
        let schemaToUse: z.ZodTypeAny;

        if (activeStep === 'personal') {
          schemaToUse = currentStep.schema;
        } else {
          if (currentStep.schema instanceof z.ZodObject && currentStep.schema.shape && activeStep in currentStep.schema.shape) {
            schemaToUse = currentStep.schema.shape[activeStep as keyof typeof currentStep.schema.shape];
          } else {
            schemaToUse = currentStep.schema;
          }
        }
        
        const validationResult = schemaToUse.safeParse(currentStepData);

        if (!validationResult.success) {
          console.error(`Validation failed for step '${activeStep}':`, validationResult.error.errors);
          toast.error("Please fill all required fields correctly before proceeding.");
          
          if (activeStep === 'personal') {
            form.trigger('personal');
          } else {
            form.trigger(activeStep as keyof ApplicationFormValues);
          }
          return;
        }

        if (!completedSteps.includes(activeStep)) {
          setCompletedSteps([...completedSteps, activeStep]);
        }

        onSuccess();

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
          scrollToTop();
        }, 200);
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
        scrollToTop();
      }, 200);
    }
  };

  const currentStepData = STEPS.find((step) => step.id === activeStep);
  const currentStepIndex = STEPS.findIndex((step) => step.id === activeStep);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
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
                  <h1 className="font-semibold text-gray-900 text-sm">
                    {currentStepData?.shortLabel}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Step {currentStepIndex + 1} of {STEPS.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  {currentStepData?.estimatedTime}
                </Badge>
                <Button
                  onClick={handleSaveDraft}
                  variant="ghost"
                  size="sm"
                  disabled={isAutoSaving}
                  className="p-2"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className={cn(
          "bg-white/80 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 ease-in-out",
          isMobile 
            ? sidebarOpen 
              ? "fixed inset-y-0 left-0 z-40 w-80 shadow-xl" 
              : "fixed -left-80 w-80 z-40"
            : "w-80 relative"
        )}>
          {/* Desktop Header */}
          {!isMobile && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Application Form</h1>
                  <p className="text-sm text-gray-500">YouthADAPT Challenge</p>
                </div>
              </div>
              
              {/* Progress Overview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{completedSteps.length} of {STEPS.length} steps completed</span>
                  <span>{currentStepData?.estimatedTime} remaining</span>
                </div>
              </div>
            </div>
          )}

          {/* Steps Navigation */}
          <div className="p-4 lg:p-6 space-y-2 overflow-y-auto">
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-4">
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
                      ? "bg-gradient-to-r from-blue-500/10 to-green-500/10 border-2 border-blue-500/30 shadow-sm" 
                      : isCompleted
                      ? "bg-green-50 hover:bg-green-100 border border-green-200"
                      : isClickable
                      ? "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                      : "bg-gray-50/50 border border-gray-100 cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-sm"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : isClickable
                        ? "bg-gray-200 text-gray-600"
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-sm">{step.icon}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-medium text-sm",
                          isActive 
                            ? "text-gray-900" 
                            : isCompleted
                            ? "text-green-800"
                            : isClickable
                            ? "text-gray-700"
                            : "text-gray-400"
                        )}>
                          {step.label}
                        </p>
                        
                        {isActive && (
                          <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                            Current
                          </Badge>
                        )}
                      </div>
                      
                      <p className={cn(
                        "text-xs leading-tight mt-1",
                        isActive 
                          ? "text-gray-600" 
                          : "text-gray-500"
                      )}>
                        {step.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.estimatedTime}
                        </Badge>
                        
                        {isCompleted && (
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            ✓ Complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auto-save Status */}
          {lastSaved && (
            <div className="p-4 border-t border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  isAutoSaving ? "bg-yellow-400 animate-pulse" : "bg-green-400"
                )} />
                <span>
                  {isAutoSaving ? "Saving..." : `Last saved ${lastSaved.toLocaleTimeString()}`}
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              onClick={downloadApplication}
              variant="outline"
              size="sm"
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Progress
            </Button>
            
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          {!isMobile && (
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
              <div className="px-6 lg:px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <span className="text-2xl">{currentStepData?.icon}</span>
                      {currentStepData?.label}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {currentStepData?.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 opacity-100 visible">
                    <Badge variant="outline" className="text-sm bg-white border-gray-300 text-gray-700">
                      <Clock className="h-4 w-4 mr-1" />
                      {currentStepData?.estimatedTime}
                    </Badge>
                    
                    <Button
                      onClick={handleSaveDraft}
                      variant="outline"
                      size="sm"
                      disabled={isAutoSaving}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAutoSaving ? "Saving..." : "Save Draft"}
                    </Button>
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
                  "transition-all duration-200 ease-in-out",
                  isAnimating ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0"
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
                      onClearDraft={clearDraft}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </main>

          {/* Navigation Footer */}
          <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={activeStep === STEPS[0].id || isAnimating}
                  className="flex-1 lg:flex-none lg:px-8 h-12"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500">
                  <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
                  <span>•</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                
                {activeStep !== STEPS[STEPS.length - 1].id ? (
                  <Button 
                    onClick={goToNextStep}
                    disabled={isAnimating}
                    className="flex-1 lg:flex-none lg:px-8 h-12 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <div className="flex-1 lg:flex-none" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 