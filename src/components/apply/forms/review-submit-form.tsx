"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ApplicationFormValues } from "../application-form";

// Props type
type ReviewSubmitFormProps = {
  form: UseFormReturn<ApplicationFormValues>;
  onPrevious: () => void;
};

export function ReviewSubmitForm({ form, onPrevious }: ReviewSubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesAccepted, setUpdatesAccepted] = useState(false);
  
  const formValues = form.getValues();
  
  const handleSubmit = async (data: ApplicationFormValues) => {
    if (!termsAccepted || !updatesAccepted) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
    console.log("Application Submission Data:", data);
      
      // TODO: Submit data to backend
      // Example implementation:
      // const response = await fetch('/api/submit-application', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // if (!response.ok) throw new Error('Submission failed');
      
      toast.success("Application submitted successfully!");
      // Redirect or show success page
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("There was a problem submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to format section data for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) return format(value, "PPP");
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
    <div className="space-y-6">
      <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Review & Submit</h2>
            <p className="text-muted-foreground mt-1">
          Please review your application before submitting. You cannot edit after submission.
        </p>
      </div>
      
      <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Application Summary</h3>
                <p className="text-muted-foreground text-sm">
                  Please review all information before submitting. You can go back to edit any section if needed.
                </p>
                
                <Accordion type="multiple" className="w-full space-y-4" defaultValue={["personal"]}>
                  {/* Personal Information */}
                  <AccordionItem value="personal" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Personal Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-800 border-t">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
                            <p className="mt-1">{formatValue(formValues.personal?.firstName)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
                            <p className="mt-1">{formatValue(formValues.personal?.lastName)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                            <p className="mt-1">{formatValue(formValues.personal?.gender)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</p>
                            <p className="mt-1">{formValues.personal?.dateOfBirth ? format(formValues.personal.dateOfBirth, "PPP") : "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                            <p className="mt-1">{formatValue(formValues.personal?.email)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                            <p className="mt-1">{formatValue(formValues.personal?.phoneNumber)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country of Citizenship</p>
                            <p className="mt-1">
                              {formValues.personal?.citizenship === "other" 
                                ? formatValue(formValues.personal?.citizenshipOther)
                                : formatValue(formValues.personal?.citizenship)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country of Residence</p>
                            <p className="mt-1">
                              {formValues.personal?.countryOfResidence === "other" 
                                ? formatValue(formValues.personal?.residenceOther)
                                : formatValue(formValues.personal?.countryOfResidence)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Education</p>
                            <p className="mt-1">{formatValue(formValues.personal?.highestEducation)}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Business Information */}
                  <AccordionItem value="business" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Business Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-800 border-t">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Name</p>
                            <p className="mt-1">{formatValue(formValues.business?.name)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
                            <p className="mt-1">{formValues.business?.startDate ? format(formValues.business.startDate, "PPP") : "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Registered?</p>
                            <p className="mt-1">{formatValue(formValues.business?.isRegistered)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                            <p className="mt-1">
                              {formValues.business?.country === "other" 
                                ? formatValue(formValues.business?.countryOther)
                                : formatValue(formValues.business?.country)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                            <p className="mt-1">{formatValue(formValues.business?.city)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Description</p>
                          <p className="mt-1">{formatValue(formValues.business?.description)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Problem Solved</p>
                          <p className="mt-1">{formatValue(formValues.business?.problemSolved)}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Climate Adaptation Information */}
                  <AccordionItem value="adaptation" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Climate Adaptation Solution</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-800 border-t">
              <div className="space-y-4">
                <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Solution Title</p>
                          <p className="mt-1">{formatValue(formValues.adaptation?.solutionTitle)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Solution Description</p>
                          <p className="mt-1">{formatValue(formValues.adaptation?.solutionDescription)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Climate Challenge</p>
                          <p className="mt-1">
                            {formValues.adaptation?.primaryChallenge === "other" 
                              ? formatValue(formValues.adaptation?.primaryChallengeOther)
                              : formatValue(formValues.adaptation?.primaryChallenge)}
                  </p>
                </div>
                
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Target Beneficiaries</p>
                          <p className="mt-1">{formatValue(formValues.adaptation?.targetBeneficiaries)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Technology Description</p>
                          <p className="mt-1">{formatValue(formValues.adaptation?.technologyDescription)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Innovation Approach</p>
                          <p className="mt-1">{formatValue(formValues.adaptation?.innovationDescription)}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Financial Information */}
                  <AccordionItem value="financial" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Financial Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-800 border-t">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Annual Revenue (USD)</p>
                            <p className="mt-1">{formatValue(formValues.financial?.annualRevenue)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Growth Rate (%)</p>
                            <p className="mt-1">{formatValue(formValues.financial?.revenueGrowthRate)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Previously Received Funding</p>
                            <p className="mt-1">{formatValue(formValues.financial?.previousFunding)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Requested Funding (USD)</p>
                            <p className="mt-1">{formatValue(formValues.financial?.requestedFundingAmount)}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Use of Funds</p>
                          <p className="mt-1">{formatValue(formValues.financial?.fundingUse)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Model</p>
                          <p className="mt-1">{formatValue(formValues.financial?.revenueModel)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Path to Sustainability</p>
                          <p className="mt-1">{formatValue(formValues.financial?.pathToSustainability)}</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Support Needs */}
                  <AccordionItem value="support" className="border rounded-md overflow-hidden">
                    <AccordionTrigger className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Support Needs</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-4 bg-white dark:bg-gray-800 border-t">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Support Types Needed</p>
                          <p className="mt-1">{formatValue(formValues.support?.supportTypes)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mentorship Needs</p>
                          <p className="mt-1">{formatValue(formValues.support?.mentorshipNeeds)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Training Needs</p>
                          <p className="mt-1">{formatValue(formValues.support?.trainingNeeds)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Networking Needs</p>
                          <p className="mt-1">{formatValue(formValues.support?.networkingNeeds)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Business Impact</p>
                          <p className="mt-1">{formatValue(formValues.support?.expectedBusinessImpact)}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Expected Environmental Impact</p>
                          <p className="mt-1">{formatValue(formValues.support?.expectedEnvironmentalImpact)}</p>
                        </div>
                </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Terms & Conditions</h3>
          
          <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                className="mt-1"
              />
                    <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                I confirm that all information provided in this application is accurate, and I understand
                      that providing false information may lead to disqualification from the program and potential
                      legal consequences.
                    </Label>
            </div>
            
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                id="updates"
                      checked={updatesAccepted}
                      onCheckedChange={(checked) => setUpdatesAccepted(checked === true)}
                className="mt-1"
              />
                    <Label htmlFor="updates" className="text-sm font-normal leading-relaxed">
                I consent to receive updates about my application status and future opportunities related
                      to the program via email and other communication channels.
                    </Label>
            </div>
                </div>
                
                {!termsAccepted || !updatesAccepted ? (
                  <p className="text-sm text-amber-600 dark:text-amber-500">
                    Please accept both terms to submit your application.
                  </p>
                ) : null}
          </div>
          
          <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onPrevious}
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
              Previous: Support Needs
            </Button>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                  disabled={isSubmitting || !termsAccepted || !updatesAccepted}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
      </CardContent>
    </Card>
  );
} 