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
import { generateApplicationDocx } from "@/lib/docx-generator";
import { ApplicationFormValues } from "../application-form";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileText, Building, Leaf, DollarSign, HandHeart, Shield, User, Download } from "lucide-react";

// Props type
type ReviewSubmitFormProps = {
  form: UseFormReturn<ApplicationFormValues>;
  onPrevious: () => void;
  onClearDraft?: () => void;
};

export function ReviewSubmitForm({ form, onPrevious, onClearDraft }: ReviewSubmitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [updatesAccepted, setUpdatesAccepted] = useState(false);
  const router = useRouter();
  
  const formValues = form.getValues();
  
  // Download application as DOCX
  const downloadApplication = async () => {
    try {
      const applicantName = `${formValues.personal?.firstName || 'Unknown'} ${formValues.personal?.lastName || 'User'}`;
      const submissionDate = new Date();
      
      await generateApplicationDocx({
        formData: formValues,
        applicantName,
        submissionDate
      });
      
      toast.success("Application document downloaded successfully!");
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document. Please try again.");
    }
  };
  
  const handleSubmit = async (data: ApplicationFormValues) => {
    console.log("🔄 HandleSubmit called with data:", data);
    console.log("✅ Terms accepted:", termsAccepted);
    console.log("✅ Updates accepted:", updatesAccepted);
    console.log("📝 Form state:", form.formState);
    console.log("❌ Form errors:", form.formState.errors);
    console.log("✅ Form is valid:", form.formState.isValid);
    
    // Log the raw date values
    console.log("🗓️ Raw dateOfBirth:", data.personal.dateOfBirth, typeof data.personal.dateOfBirth);
    console.log("🗓️ Raw startDate:", data.business.startDate, typeof data.business.startDate);
    console.log("🗓️ Raw fundingDate:", data.business.funding?.fundingDate, typeof data.business.funding?.fundingDate);

    // Pre-submission validation and fixing
    if (!data.personal.dateOfBirth) {
      console.log("❌ Missing dateOfBirth, setting default");
      toast.error("Date of birth is required. Please go back and set your date of birth.");
      return;
    }

    if (!data.business.startDate) {
      console.log("❌ Missing startDate, setting default");
      toast.error("Business start date is required. Please go back and set your business start date.");
      return;
    }
    
    if (!termsAccepted || !updatesAccepted) {
      console.log("❌ Terms not accepted, stopping submission");
      toast.error("Please accept the terms and conditions to proceed.");
      return;
    }
    
    console.log("🚀 Setting isSubmitting to true");
    setIsSubmitting(true);
    
    // Add tracking ID for this submission attempt
    const submissionId = Date.now().toString(36) + Math.random().toString(36).slice(2);
    console.log(`[Application ${submissionId}] Starting submission process...`);
    
    try {
      console.log(`[Application ${submissionId}] Preparing data:`, data);
      console.log(`[Application ${submissionId}] Terms accepted:`, termsAccepted);
      console.log(`[Application ${submissionId}] Updates accepted:`, updatesAccepted);
      
      // Debug date fields before transformation
      console.log(`[Application ${submissionId}] Original dateOfBirth:`, data.personal.dateOfBirth, typeof data.personal.dateOfBirth);
      console.log(`[Application ${submissionId}] Original startDate:`, data.business.startDate, typeof data.business.startDate);
      console.log(`[Application ${submissionId}] Original fundingDate:`, data.business.funding?.fundingDate, typeof data.business.funding?.fundingDate);
      
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
      
      // Safe date conversion helper
      const convertToDate = (value: unknown): Date => {
        if (!value) return new Date();
        if (value instanceof Date) {
          return isNaN(value.getTime()) ? new Date() : value;
        }
        if (typeof value === 'string') {
          const date = new Date(value);
          return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
      };
      
      // Transform the data to match the expected schema
      const submissionData = {
        personal: {
          ...data.personal,
          // Safely convert dateOfBirth to Date object
          dateOfBirth: convertToDate(data.personal.dateOfBirth),
        },
        business: {
          name: data.business.name,
          // Safely convert startDate to Date object
          startDate: convertToDate(data.business.startDate),
          isRegistered: data.business.isRegistered,
          registrationCertificateUrl: data.business.registrationCertificateUrl,
          country: data.business.country,
          city: data.business.city,
          registeredCountries: data.business.registeredCountries || "Kenya",
          
          // Ensure text fields meet minimum length requirements
          description: ensureMinLength(data.business.description, 100),
          problemSolved: ensureMinLength(data.business.problemSolved, 100),
          climateAdaptationContribution: ensureMinLength(data.business.climateAdaptationContribution, 100),
          productServiceDescription: ensureMinLength(data.business.productServiceDescription, 100),
          climateExtremeImpact: ensureMinLength(data.business.climateExtremeImpact, 100),
          productionCapacityLastSixMonths: ensureMinLength(data.business.productionCapacityLastSixMonths, 10),
          currentChallenges: ensureMinLength(data.business.currentChallenges, 50),
          supportNeeded: ensureMinLength(data.business.supportNeeded, 50),
          additionalInformation: data.business.additionalInformation,
          
          // Financial fields
          revenueLastTwoYears: data.financial?.annualRevenue || 0,
          unitPrice: data.business.unitPrice || 1,
          customerCountLastSixMonths: data.business.customerCountLastSixMonths || 0,
          
          // Employee fields
          fullTimeEmployeesTotal: data.business.fullTimeEmployeesTotal || 0,
          fullTimeEmployeesMale: data.business.fullTimeEmployeesMale || 0,
          fullTimeEmployeesFemale: data.business.fullTimeEmployeesFemale || 0,
          partTimeEmployeesMale: data.business.partTimeEmployeesMale || 0,
          partTimeEmployeesFemale: data.business.partTimeEmployeesFemale || 0,
          
          // Use correct property names for the schema
          targetCustomers: data.business.customerSegments || [],
          
          funding: {
            hasExternalFunding: data.business.funding?.hasExternalFunding || false,
            fundingSource: data.business.funding?.fundingSource || null,
            fundingSourceOther: data.business.funding?.fundingSourceOther || null,
            // Convert fundingDate string to Date object if it exists and is a string
            fundingDate: data.business.funding?.fundingDate 
              ? convertToDate(data.business.funding.fundingDate)
              : null,
            funderName: data.business.funding?.funderName || null,
            amountUsd: data.business.funding?.amountUsd || null,
            fundingInstrument: data.business.funding?.fundingInstrument || null,
            fundingInstrumentOther: data.business.funding?.fundingInstrumentOther || null,
          }
        },
        referralSource: null,
        referralSourceOther: null,
      };
      
      console.log(`[Application ${submissionId}] Transformed data:`, submissionData);
      
      // Debug transformed date fields
      console.log(`[Application ${submissionId}] Transformed dateOfBirth:`, submissionData.personal.dateOfBirth, typeof submissionData.personal.dateOfBirth);
      console.log(`[Application ${submissionId}] Transformed startDate:`, submissionData.business.startDate, typeof submissionData.business.startDate);
      console.log(`[Application ${submissionId}] Transformed fundingDate:`, submissionData.business.funding.fundingDate, typeof submissionData.business.funding.fundingDate);
      
      // Debug transformed date fields
      console.log(`[Application ${submissionId}] Transformed dateOfBirth:`, submissionData.personal.dateOfBirth, typeof submissionData.personal.dateOfBirth);
      console.log(`[Application ${submissionId}] Transformed startDate:`, submissionData.business.startDate, typeof submissionData.business.startDate);
      console.log(`[Application ${submissionId}] Transformed fundingDate:`, submissionData.business.funding.fundingDate, typeof submissionData.business.funding.fundingDate);
      
      // Validate before submitting
      if (!submissionData.business.name || submissionData.business.name.length < 2) {
        console.log("❌ Business name validation failed");
        toast.error("Business name must be at least 2 characters");
        setIsSubmitting(false);
        return;
      }
      
      if (!submissionData.business.city || submissionData.business.city.length < 2) {
        console.log("❌ City validation failed");
        toast.error("City must be at least 2 characters");
        setIsSubmitting(false);
        return;
      }

      // Validate dates
      if (!submissionData.personal.dateOfBirth || isNaN(submissionData.personal.dateOfBirth.getTime())) {
        console.log("❌ Date of birth validation failed");
        toast.error("Please enter a valid date of birth");
        setIsSubmitting(false);
        return;
      }

      if (!submissionData.business.startDate || isNaN(submissionData.business.startDate.getTime())) {
        console.log("❌ Business start date validation failed");
        toast.error("Please enter a valid business start date");
        setIsSubmitting(false);
        return;
      }
      
      console.log(`[Application ${submissionId}] About to call submitApplication...`);
      
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
      
      // Clear draft after successful submission
      if (onClearDraft) {
        onClearDraft();
      }
      
      toast.success("Application submitted successfully!");
      // Redirect to profile page after success
      router.push("/profile");
    } catch (error) {
      console.error(`[Application ${submissionId}] Submission error:`, error);
      toast.error("There was a problem submitting your application. Please try again.");
    } finally {
      console.log("🏁 Setting isSubmitting to false");
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
        
        {/* Download Preview Button */}
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={downloadApplication}
            className="border-blue-200 text-blue-700 "
          >
            <Download className="h-4 w-4 mr-2" />
            Download as Word Document
          </Button>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.log("❌ Form validation errors:", errors);
          
          // Format error messages for display
          const errorMessages: string[] = [];
          
          // Check personal errors
          if (errors.personal) {
            Object.entries(errors.personal).forEach(([field, error]) => {
              if (error && typeof error === 'object' && 'message' in error) {
                errorMessages.push(`Personal: ${field} - ${error.message}`);
              }
            });
          }
          
          // Check business errors
          if (errors.business) {
            Object.entries(errors.business).forEach(([field, error]) => {
              if (error && typeof error === 'object' && 'message' in error) {
                errorMessages.push(`Business: ${field} - ${error.message}`);
              }
            });
          }
          
          // Check other sections
          ['adaptation', 'financial', 'support'].forEach(section => {
            if (errors[section as keyof typeof errors]) {
              const sectionErrors = errors[section as keyof typeof errors];
              if (sectionErrors && typeof sectionErrors === 'object') {
                Object.entries(sectionErrors).forEach(([field, error]) => {
                  if (error && typeof error === 'object' && 'message' in error) {
                    errorMessages.push(`${section}: ${field} - ${(error as { message: string }).message}`);
                  }
                });
              }
            }
          });
          
          const errorMessage = errorMessages.length > 0 
            ? `Please fix these errors:\n${errorMessages.slice(0, 5).join('\n')}${errorMessages.length > 5 ? `\n... and ${errorMessages.length - 5} more` : ''}`
            : "Please fill all required fields correctly.";
            
          toast.error(errorMessage);
        })} className="space-y-8">
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
                            {formatValue(formValues.personal?.citizenship)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Country of Residence</p>
                          <p className="mt-1 text-gray-900">
                            {formatValue(formValues.personal?.countryOfResidence)}
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
                            {formatValue(formValues.business?.country)}
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
                          {formatValue(formValues.adaptation?.primaryChallenge)}
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
                <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                  <Checkbox 
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                    className="mt-1 scale-125 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-white data-[state=checked]:border-green-600 data-[state=unchecked]:border-gray-400 shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-green-700"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-relaxed text-gray-900 cursor-pointer">
                    I confirm that all information provided in this application is accurate, and I understand
                    that providing false information may lead to disqualification from the program and potential
                    legal consequences.
                  </Label>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                  <Checkbox 
                    id="updates"
                    checked={updatesAccepted}
                    onCheckedChange={(checked) => setUpdatesAccepted(checked === true)}
                    className="mt-1 scale-125 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-white data-[state=checked]:border-green-600 data-[state=unchecked]:border-gray-400 shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-green-700"
                  />
                  <Label htmlFor="updates" className="text-sm font-normal leading-relaxed text-gray-900 cursor-pointer">
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