"use server";

import { z } from "zod";
import { applications, businesses, applicants, businessTargetCustomers, businessFunding } from "../../../db/schema";
import { revalidatePath } from "next/cache";
import db from "../../../db/drizzle";
import { checkEligibility } from "./eligibility";

// Calculate min and max dates for age validation (18-35 years)
const now = new Date();
const minBirthYear = now.getFullYear() - 35;
const maxBirthYear = now.getFullYear() - 18;
const minDate = new Date(minBirthYear, now.getMonth(), now.getDate());
const maxDate = new Date(maxBirthYear, now.getMonth(), now.getDate());

// Application submission schema
const applicationSubmissionSchema = z.object({
  personal: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.date().min(minDate).max(maxDate),
    citizenship: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania", "other"]),
    citizenshipOther: z.string().optional().nullable(),
    countryOfResidence: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania", "other"]),
    residenceOther: z.string().optional().nullable(),
    phoneNumber: z.string().min(8).max(20),
    email: z.string().email().max(100),
    highestEducation: z.enum([
      "primary_school_and_below",
      "high_school",
      "technical_college",
      "undergraduate",
      "postgraduate"
    ]),
  }),
  business: z.object({
    name: z.string().min(2).max(200),
    startDate: z.date(),
    isRegistered: z.boolean(),
    registrationCertificateUrl: z.string().url().max(500).optional().nullable(),
    country: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania", "other"]),
    countryOther: z.string().max(100).optional().nullable(),
    city: z.string().min(2).max(100),
    registeredCountries: z.string(),
    description: z.string().min(100),
    problemSolved: z.string().min(100),
    revenueLastTwoYears: z.number().positive(),
    fullTimeEmployeesTotal: z.number().nonnegative().int(),
    fullTimeEmployeesMale: z.number().nonnegative().int(),
    fullTimeEmployeesFemale: z.number().nonnegative().int(),
    partTimeEmployeesMale: z.number().nonnegative().int(),
    partTimeEmployeesFemale: z.number().nonnegative().int(),
    climateAdaptationContribution: z.string().min(100),
    productServiceDescription: z.string().min(100),
    climateExtremeImpact: z.string().min(100),
    unitPrice: z.number().positive(),
    customerCountLastSixMonths: z.number().nonnegative().int(),
    productionCapacityLastSixMonths: z.string().min(10),
    currentChallenges: z.string().min(50),
    supportNeeded: z.string().min(50),
    additionalInformation: z.string().optional().nullable(),
    targetCustomers: z.array(
      z.enum([
        "household_individuals",
        "micro_small_medium_enterprises",
        "institutions",
        "corporates",
        "government_and_ngos"
      ])
    ),
    funding: z.object({
      hasExternalFunding: z.boolean(),
      fundingSource: z.enum([
        "high_net_worth_individual",
        "financial_institutions",
        "government_agency",
        "local_or_international_ngo",
        "other"
      ]).optional().nullable(),
      fundingSourceOther: z.string().max(100).optional().nullable(),
      fundingDate: z.date().optional().nullable(),
      funderName: z.string().max(200).optional().nullable(),
      amountUsd: z.number().positive().optional().nullable(),
      fundingInstrument: z.enum([
        "debt",
        "equity",
        "quasi",
        "other"
      ]).optional().nullable(),
      fundingInstrumentOther: z.string().max(100).optional().nullable(),
    }),
  }),
  referralSource: z.string().max(100).optional().nullable(),
  referralSourceOther: z.string().max(100).optional().nullable(),
});

type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;

export async function submitApplication(formData: ApplicationSubmission) {
  try {
    // Validate form data
    const validatedData = applicationSubmissionSchema.parse(formData);
    
    // TODO: Add userId once authentication is implemented
    const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder
    
    // Insert applicant information
    const newApplicant = {
      userId,
      firstName: validatedData.personal.firstName,
      lastName: validatedData.personal.lastName,
      gender: validatedData.personal.gender,
      dateOfBirth: validatedData.personal.dateOfBirth.toISOString().split('T')[0], // Format as YYYY-MM-DD
      citizenship: validatedData.personal.citizenship,
      citizenshipOther: validatedData.personal.citizenshipOther,
      countryOfResidence: validatedData.personal.countryOfResidence,
      residenceOther: validatedData.personal.residenceOther,
      phoneNumber: validatedData.personal.phoneNumber,
      email: validatedData.personal.email,
      highestEducation: validatedData.personal.highestEducation,
    };
    
    const [applicant] = await db.insert(applicants).values(newApplicant).returning();
    
    // Insert business information
    const newBusiness = {
      applicantId: applicant.id,
      name: validatedData.business.name,
      startDate: validatedData.business.startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
      isRegistered: validatedData.business.isRegistered,
      registrationCertificateUrl: validatedData.business.registrationCertificateUrl,
      country: validatedData.business.country,
      countryOther: validatedData.business.countryOther,
      city: validatedData.business.city,
      registeredCountries: validatedData.business.registeredCountries,
      description: validatedData.business.description,
      problemSolved: validatedData.business.problemSolved,
      revenueLastTwoYears: String(validatedData.business.revenueLastTwoYears),
      fullTimeEmployeesTotal: validatedData.business.fullTimeEmployeesTotal,
      fullTimeEmployeesMale: validatedData.business.fullTimeEmployeesMale,
      fullTimeEmployeesFemale: validatedData.business.fullTimeEmployeesFemale,
      partTimeEmployeesMale: validatedData.business.partTimeEmployeesMale,
      partTimeEmployeesFemale: validatedData.business.partTimeEmployeesFemale,
      climateAdaptationContribution: validatedData.business.climateAdaptationContribution,
      productServiceDescription: validatedData.business.productServiceDescription,
      climateExtremeImpact: validatedData.business.climateExtremeImpact,
      unitPrice: String(validatedData.business.unitPrice),
      customerCountLastSixMonths: validatedData.business.customerCountLastSixMonths,
      productionCapacityLastSixMonths: validatedData.business.productionCapacityLastSixMonths,
      currentChallenges: validatedData.business.currentChallenges,
      supportNeeded: validatedData.business.supportNeeded,
      additionalInformation: validatedData.business.additionalInformation,
    };
    
    const [business] = await db.insert(businesses).values(newBusiness).returning();
    
    // Insert target customers
    if (validatedData.business.targetCustomers.length > 0) {
      const targetCustomerValues = validatedData.business.targetCustomers.map(segment => ({
        businessId: business.id,
        customerSegment: segment,
      }));
      
      await db.insert(businessTargetCustomers).values(targetCustomerValues);
    }
    
    // Insert funding information if business has external funding
    if (validatedData.business.funding.hasExternalFunding) {
      const fundingData = {
        businessId: business.id,
        hasExternalFunding: validatedData.business.funding.hasExternalFunding,
        fundingSource: validatedData.business.funding.fundingSource,
        fundingSourceOther: validatedData.business.funding.fundingSourceOther,
        fundingDate: validatedData.business.funding.fundingDate 
          ? validatedData.business.funding.fundingDate.toISOString().split('T')[0] 
          : null,
        funderName: validatedData.business.funding.funderName,
        amountUsd: validatedData.business.funding.amountUsd ? String(validatedData.business.funding.amountUsd) : null,
        fundingInstrument: validatedData.business.funding.fundingInstrument,
        fundingInstrumentOther: validatedData.business.funding.fundingInstrumentOther,
      };
      
      await db.insert(businessFunding).values(fundingData);
    }
    
    // Insert application and set status to 'submitted'
    const now = new Date();
    const applicationData = {
      businessId: business.id,
      status: 'submitted' as const,
      referralSource: validatedData.referralSource,
      referralSourceOther: validatedData.referralSourceOther,
      submittedAt: now,
    };
    
    const [application] = await db.insert(applications).values(applicationData).returning();
    
    // Run eligibility check algorithm
    const eligibilityResult = await checkEligibility(application.id);
    
    revalidatePath("/apply");
    
    return {
      success: true,
      message: "Application submitted successfully",
      data: {
        applicantId: applicant.id,
        businessId: business.id,
        applicationId: application.id,
        eligibility: eligibilityResult,
      },
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error",
        errors: error.errors,
      };
    }
    
    return {
      success: false,
      message: "Failed to submit application",
    };
  }
} 