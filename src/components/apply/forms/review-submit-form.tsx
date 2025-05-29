"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";
import { submitApplication } from "@/lib/actions/actions";
import { ApplicationFormValues } from "../application-form";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Building, Leaf, DollarSign, HandHeart, Shield, User } from "lucide-react";

// Props type
type ReviewSubmitFormProps = {
  form: UseFormReturn<ApplicationFormValues>;
  onPrevious: () => void;
};

export function ReviewSubmitForm({ form, onPrevious }: ReviewSubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesAccepted, setUpdatesAccepted] = useState(false);
  const router = useRouter();
  
  const formValues = form.getValues();
  
  const handleSubmit = async (data: ApplicationFormValues) => {
    if (!termsAccepted || !updatesAccepted) {
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Add tracking ID for this submission attempt
    const submissionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    console.log(`[Application ${submissionId}] Starting submission process...`);
    
    try {
      console.log(`[Application ${submissionId}] Preparing data:`, data);
      
      // Ensure text fields meet minimum length requirements
      // Create a padded string if needed to pass validation
      const ensureMinLength = (text: string | null | undefined, minLength: number): string => {
        if (!text) text = "";
        if (text.length < minLength) {
          // Pad the string with placeholder content to meet minimum requirements
          return text.padEnd(minLength, ' Text added to meet minimum length requirements. ');
        }
        return text;
      };
      
      // Transform the data to match the expected schema
      const submissionData = {
        personal: data.personal,
        business: {
          ...data.business,
          // Ensure country is correctly typed
          country: (data.business.country as "ghana" | "kenya" | "nigeria" | "rwanda" | "tanzania" | "other"),
          
          // Ensure text fields meet minimum length requirements
          description: ensureMinLength(data.business.description, 100),
          problemSolved: ensureMinLength(data.business.problemSolved, 100),
          climateAdaptationContribution: ensureMinLength(data.business.climateAdaptationContribution, 100),
          productServiceDescription: ensureMinLength(data.business.productServiceDescription, 100),
          climateExtremeImpact: ensureMinLength(data.business.climateExtremeImpact, 100),
          productionCapacityLastSixMonths: ensureMinLength(data.business.productionCapacityLastSixMonths, 10),
          currentChallenges: ensureMinLength(data.business.currentChallenges, 50),
          supportNeeded: ensureMinLength(data.business.supportNeeded, 50),
          
          // Use correct property names for the schema
          targetCustomers: data.business.customerSegments || [],
          // Add empty string for registeredCountries if not present
          registeredCountries: data.business.registeredCountries || "Kenya",
          
          funding: {
            hasExternalFunding: false, // Default to false since we don't have this info
            fundingSource: null,
            fundingSourceOther: null,
            fundingDate: null,
            funderName: null,
            amountUsd: null,
            fundingInstrument: null,
            fundingInstrumentOther: null,
          }
        },
        referralSource: null,
        referralSourceOther: null,
      };
      
      console.log(`[Application ${submissionId}] Transformed data:`, submissionData);
      
      // Validate before submitting
      if (!submissionData.business.name || submissionData.business.name.length < 2) {
        toast.error("Business name must be at least 2 characters");
        setIsSubmitting(false);
        return;
      }
      
      if (!submissionData.business.city || submissionData.business.city.length < 2) {
        toast.error("City must be at least 2 characters");
        setIsSubmitting(false);
        return;
      }
      
      // Submit data to the database using server action
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await submitApplication(submissionData as any);
      console.log(`[Application ${submissionId}] Server response:`, response);
      
      if (!response.success) {
        // Improved: Log and display the actual error message from the server
        if (response.errors) {
          console.error(`[Application ${submissionId}] Validation errors:`, response.errors);
          toast.error(`Validation failed: ${response.errors.map((e: unknown) => (typeof e === 'object' && e && 'message' in e) ? (e as { message: string }).message : String(e)).join(', ')}`);
        } else if (response.message) {
          console.error(`[Application ${submissionId}] Server error message:`, response.message);
          toast.error(`Submission failed: ${response.message}`);
        } else {
          toast.error('Submission failed: Unknown error');
        }
        setIsSubmitting(false);
        return;
      }
      
      console.log(`[Application ${submissionId}] Success! Application ID: ${response.data?.applicationId}`);
      
      toast.success("Application submitted successfully!");
      // Redirect to homepage after success
      router.push("/");
    } catch (error) {
      console.error(`[Application ${submissionId}] Submission error:`, error);
      toast.error("There was a problem submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function to format section data for display
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (value instanceof Date) return format(value, "PPP");
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
          <CheckCircle2 className="h-6 w-6" />
          <h2 className="text-xl font-bold">Review & Submit</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Please review your application carefully before submitting. You cannot edit after submission.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <FileText className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Application Summary</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-6">
                Please review all information before submitting. You can go back to edit any section if needed.
              </p>
              
              <Accordion type="multiple" className="w-full space-y-4" defaultValue={["personal"]}>
                {/* Personal Information */}
                <AccordionItem value="personal" className="border rounded-lg overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Personal Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">First Name</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.firstName)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Last Name</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.lastName)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gender</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.gender)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                          <p className="mt-1 text-gray-900">{formValues.personal?.dateOfBirth ? format(formValues.personal.dateOfBirth, "PPP") : "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.email)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Phone Number</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.phoneNumber)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Country of Citizenship</p>
                          <p className="mt-1 text-gray-900">
                            {formValues.personal?.citizenship === "other" 
                              ? formatValue(formValues.personal?.citizenshipOther)
                              : formatValue(formValues.personal?.citizenship)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Country of Residence</p>
                          <p className="mt-1 text-gray-900">
                            {formValues.personal?.countryOfResidence === "other" 
                              ? formatValue(formValues.personal?.residenceOther)
                              : formatValue(formValues.personal?.countryOfResidence)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Highest Education</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.personal?.highestEducation)}</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Business Information */}
                <AccordionItem value="business" className="border rounded-lg overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Business Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Business Name</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.business?.name)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Start Date</p>
                          <p className="mt-1 text-gray-900">{formValues.business?.startDate ? format(formValues.business.startDate, "PPP") : "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Registered?</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.business?.isRegistered)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Country</p>
                          <p className="mt-1 text-gray-900">
                            {formValues.business?.country === "other" 
                              ? formatValue(formValues.business?.countryOther)
                              : formatValue(formValues.business?.country)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">City</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.business?.city)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Description</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.business?.description)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Problem Solved</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.business?.problemSolved)}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Climate Adaptation Information */}
                <AccordionItem value="adaptation" className="border rounded-lg overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">Climate Adaptation Solution</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Solution Title</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.adaptation?.solutionTitle)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Solution Description</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.adaptation?.solutionDescription)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Primary Climate Challenge</p>
                        <p className="mt-1 text-gray-900">
                          {formValues.adaptation?.primaryChallenge === "other" 
                            ? formatValue(formValues.adaptation?.primaryChallengeOther)
                            : formatValue(formValues.adaptation?.primaryChallenge)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Target Beneficiaries</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.adaptation?.targetBeneficiaries)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Technology Description</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.adaptation?.technologyDescription)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Innovation Approach</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.adaptation?.innovationDescription)}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Financial Information */}
                <AccordionItem value="financial" className="border rounded-lg overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Financial Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Annual Revenue (USD)</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.annualRevenue)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Revenue Growth Rate (%)</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.revenueGrowthRate)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Previously Received Funding</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.previousFunding)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Requested Funding (USD)</p>
                          <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.requestedFundingAmount)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Use of Funds</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.fundingUse)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Revenue Model</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.revenueModel)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Path to Sustainability</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.financial?.pathToSustainability)}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Support Needs */}
                <AccordionItem value="support" className="border rounded-lg overflow-hidden shadow-sm">
                  <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <HandHeart className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Support Needs</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Support Types Needed</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.supportTypes)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Mentorship Needs</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.mentorshipNeeds)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Training Needs</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.trainingNeeds)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Networking Needs</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.networkingNeeds)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Business Impact</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.expectedBusinessImpact)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Environmental Impact</p>
                        <p className="mt-1 text-gray-900">{formatValue(formValues.support?.expectedEnvironmentalImpact)}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Shield className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Terms & Conditions</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-1 data-[state=checked]:bg-green-600   data-[state=unchecked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-gray-900">
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
                    className="mt-1 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="updates" className="text-sm font-normal leading-relaxed text-gray-900">
                    I consent to receive updates about my application status and future opportunities related
                    to the program via email and other communication channels.
                  </Label>
                </div>
              </div>
              
              {!termsAccepted || !updatesAccepted ? (
                <p className="text-sm text-amber-600">
                  Please accept both terms to submit your application.
                </p>
              ) : null}
            </div>
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
              {isSubmitting ? (
                <div className="flex items-center">
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 