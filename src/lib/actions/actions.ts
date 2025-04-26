"use server";

import { z } from "zod";
import { applications, businesses, applicants, businessTargetCustomers, businessFunding, eligibilityResults } from "../../../db/schema";
import { revalidatePath } from "next/cache";
import db from "../../../db/drizzle";
import { checkEligibility } from "./eligibility";
import { eq, and, desc, count as drizzleCount, SQL, InferSelectModel } from "drizzle-orm";

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

export type ApplicationSubmission = z.infer<typeof applicationSubmissionSchema>;

export async function submitApplication(formData: ApplicationSubmission) {
  try {
    console.log("🚀 Starting application submission process...");
    
    // Validate form data
    console.log("Validating form data...");
    const validatedData = applicationSubmissionSchema.parse(formData);
    console.log("✅ Form data validated successfully");
    
    // TODO: Add userId once authentication is implemented
    const userId = "00000000-0000-0000-0000-000000000000"; // Placeholder
    
    // Insert applicant information
    console.log("Saving applicant information to database...");
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
    console.log(`✅ Applicant saved with ID: ${applicant.id}`);
    
    // Insert business information
    console.log("Saving business information to database...");
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
    console.log(`✅ Business saved with ID: ${business.id}`);
    
    // Insert target customers
    if (validatedData.business.targetCustomers.length > 0) {
      console.log("Saving target customers...");
      const targetCustomerValues = validatedData.business.targetCustomers.map(segment => ({
        businessId: business.id,
        customerSegment: segment,
      }));
      
      await db.insert(businessTargetCustomers).values(targetCustomerValues);
      console.log(`✅ ${targetCustomerValues.length} target customer segments saved`);
    }
    
    // Insert funding information if business has external funding
    if (validatedData.business.funding.hasExternalFunding) {
      console.log("Saving funding information...");
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
      console.log(`✅ Funding information saved for business ID: ${business.id}`);
    }
    
    // Insert application and set status to 'submitted'
    console.log("Creating application record...");
    const now = new Date();
    const applicationData = {
      businessId: business.id,
      status: 'submitted' as const,
      referralSource: validatedData.referralSource,
      referralSourceOther: validatedData.referralSourceOther,
      submittedAt: now,
    };
    
    const [application] = await db.insert(applications).values(applicationData).returning();
    console.log(`✅ Application created with ID: ${application.id}`);
    
    // Run eligibility check algorithm
    console.log("Running eligibility check...");
    const eligibilityResult = await checkEligibility(application.id);
    console.log(`✅ Eligibility check completed: ${eligibilityResult.data?.eligibilityResult?.isEligible ? 'Eligible' : 'Not Eligible'}`);
    
    revalidatePath("/apply");
    
    console.log("🎉 Application submission process completed successfully!");
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
    console.error("❌ Error submitting application:", error);
    
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
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

// Types for the admin dashboard
export interface ApplicationFilters {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  isEligible?: boolean;
}

/**
 * Get application statistics for the admin dashboard
 */
export async function getApplicationStats() {
  try {
    console.log("Fetching application statistics...");
    
    // Get total applications count
    const totalApplicationsResult = await db.select({ count: drizzleCount() }).from(applications);
    const totalApplications = totalApplicationsResult[0]?.count ?? 0;

    // Get eligible applications count
    const eligibleApplicationsResult = await db.select({ count: drizzleCount() }).from(eligibilityResults)
      .where(eq(eligibilityResults.isEligible, true));
    const eligibleApplications = eligibleApplicationsResult[0]?.count ?? 0;

    // Get applications pending review count
    const pendingReviewResult = await db.select({ count: drizzleCount() }).from(applications)
      .where(eq(applications.status, 'submitted'));
    const pendingReview = pendingReviewResult[0]?.count ?? 0;

    return {
      success: true,
      data: {
        totalApplications,
        eligibleApplications,
        pendingReview,
      },
    };
  } catch (error) {
    console.error("Error fetching application statistics:", error);
    return {
      success: false,
      error: "Failed to fetch application statistics",
    };
  }
}

/**
 * Get applications for the admin dashboard with filtering
 */
export async function getApplications(filters: ApplicationFilters = {}) {
  try {
    console.log(`Fetching applications with filters:`, filters);
    
    // Default pagination
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;
    
    // Build query conditions
    const conditions: SQL[] = [];
    
    // Filter by status if provided
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'eligible' || filters.status === 'ineligible') {
        // Special case for eligibility filters - will be handled after fetching
      } else {
        // Ensure filter.status is treated as the correct enum type
        conditions.push(eq(applications.status, filters.status as InferSelectModel<typeof applications>['status']));
      }
    }
    
    // Fetch applications with related data
    const applicationsData = await db.query.applications.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(applications.updatedAt)],
      with: {
        business: {
          with: {
            applicant: true,
          },
        },
        eligibilityResults: true,
      },
      offset,
      limit,
    });
    
    // Filter by search term if provided
    let filteredData = applicationsData;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(app => 
        app.business.name.toLowerCase().includes(searchTerm) ||
        app.business.applicant.firstName.toLowerCase().includes(searchTerm) ||
        app.business.applicant.lastName.toLowerCase().includes(searchTerm) ||
        app.business.city.toLowerCase().includes(searchTerm) ||
        app.business.country.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by eligibility if requested
    if (filters.status === 'eligible') {
      filteredData = filteredData.filter(app => 
        app.eligibilityResults.length > 0 && app.eligibilityResults[0].isEligible
      );
    } else if (filters.status === 'ineligible') {
      filteredData = filteredData.filter(app => 
        app.eligibilityResults.length > 0 && !app.eligibilityResults[0].isEligible
      );
    }
    
    // Re-apply only the status filter for accurate total count before search/eligibility filtering
    const countConditions: SQL[] = [];
    if (filters.status && filters.status !== 'all' && filters.status !== 'eligible' && filters.status !== 'ineligible') {
      countConditions.push(eq(applications.status, filters.status as InferSelectModel<typeof applications>['status']));
    }
    const totalCountResult = await db.select({ count: drizzleCount() }).from(applications)
      .where(countConditions.length ? and(...countConditions) : undefined);
    const totalCount = totalCountResult[0]?.count ?? 0;
    
    return {
      success: true,
      data: filteredData,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching applications:", error);
    return {
      success: false,
      error: "Failed to fetch applications",
    };
  }
}

/**
 * Get a single application by its ID with related data
 */
export async function getApplicationById(id: number) {
  try {
    console.log(`Fetching application with ID: ${id}`);
    
    const applicationData = await db.query.applications.findFirst({
      where: (apps, { eq }) => eq(apps.id, id),
      with: {
        business: {
          with: {
            applicant: true,
            funding: true, // Assuming you might want funding info later
            targetCustomers: true, // Assuming you might want target customers later
          },
        },
        eligibilityResults: {
          orderBy: (results, { desc }) => [desc(results.evaluatedAt)], // Get the latest evaluation
          limit: 1, // Only get the most recent one
        },
      },
    });
    
    if (!applicationData) {
      return {
        success: false,
        error: "Application not found",
      };
    }
    
    // Structure the data similarly to your placeholder for easier integration
    const structuredData = {
      id: applicationData.id,
      status: applicationData.status,
      submittedAt: applicationData.submittedAt?.toISOString() ?? null,
      business: {
        id: applicationData.business.id,
        name: applicationData.business.name,
        country: applicationData.business.country,
        countryOther: applicationData.business.countryOther,
        city: applicationData.business.city,
        startDate: applicationData.business.startDate, // Already a string YYYY-MM-DD
        isRegistered: applicationData.business.isRegistered,
        registrationCertificateUrl: applicationData.business.registrationCertificateUrl,
        registeredCountries: applicationData.business.registeredCountries,
        description: applicationData.business.description,
        problemSolved: applicationData.business.problemSolved,
        revenueLastTwoYears: applicationData.business.revenueLastTwoYears,
        employees: {
          fullTimeTotal: applicationData.business.fullTimeEmployeesTotal,
          fullTimeMale: applicationData.business.fullTimeEmployeesMale,
          fullTimeFemale: applicationData.business.fullTimeEmployeesFemale,
          partTimeMale: applicationData.business.partTimeEmployeesMale,
          partTimeFemale: applicationData.business.partTimeEmployeesFemale,
        },
        climateAdaptationContribution: applicationData.business.climateAdaptationContribution,
        productServiceDescription: applicationData.business.productServiceDescription,
        climateExtremeImpact: applicationData.business.climateExtremeImpact,
        unitPrice: applicationData.business.unitPrice,
        customerCountLastSixMonths: applicationData.business.customerCountLastSixMonths,
        productionCapacityLastSixMonths: applicationData.business.productionCapacityLastSixMonths,
        currentChallenges: applicationData.business.currentChallenges,
        supportNeeded: applicationData.business.supportNeeded,
        additionalInformation: applicationData.business.additionalInformation,
        funding: applicationData.business.funding, // Keep nested funding info
        targetCustomers: applicationData.business.targetCustomers.map(tc => tc.customerSegment), // Extract segments
      },
      applicant: {
        id: applicationData.business.applicant.id,
        userId: applicationData.business.applicant.userId,
        firstName: applicationData.business.applicant.firstName,
        lastName: applicationData.business.applicant.lastName,
        gender: applicationData.business.applicant.gender,
        dateOfBirth: applicationData.business.applicant.dateOfBirth, // Already a string YYYY-MM-DD
        citizenship: applicationData.business.applicant.citizenship,
        citizenshipOther: applicationData.business.applicant.citizenshipOther,
        countryOfResidence: applicationData.business.applicant.countryOfResidence,
        residenceOther: applicationData.business.applicant.residenceOther,
        phoneNumber: applicationData.business.applicant.phoneNumber,
        email: applicationData.business.applicant.email,
        highestEducation: applicationData.business.applicant.highestEducation,
      },
      eligibility: applicationData.eligibilityResults.length > 0 ? {
        id: applicationData.eligibilityResults[0].id,
        isEligible: applicationData.eligibilityResults[0].isEligible,
        totalScore: applicationData.eligibilityResults[0].totalScore ?? 0,
        mandatoryCriteria: {
          ageEligible: applicationData.eligibilityResults[0].ageEligible,
          registrationEligible: applicationData.eligibilityResults[0].registrationEligible,
          revenueEligible: applicationData.eligibilityResults[0].revenueEligible,
          businessPlanEligible: applicationData.eligibilityResults[0].businessPlanEligible,
          impactEligible: applicationData.eligibilityResults[0].impactEligible,
        },
        evaluationScores: {
          marketPotentialScore: applicationData.eligibilityResults[0].marketPotentialScore ?? 0,
          innovationScore: applicationData.eligibilityResults[0].innovationScore ?? 0,
          climateAdaptationScore: applicationData.eligibilityResults[0].climateAdaptationScore ?? 0,
          jobCreationScore: applicationData.eligibilityResults[0].jobCreationScore ?? 0,
          viabilityScore: applicationData.eligibilityResults[0].viabilityScore ?? 0,
          managementCapacityScore: applicationData.eligibilityResults[0].managementCapacityScore ?? 0,
          locationBonus: applicationData.eligibilityResults[0].locationBonus ?? 0,
          genderBonus: applicationData.eligibilityResults[0].genderBonus ?? 0,
        },
        evaluationNotes: applicationData.eligibilityResults[0].evaluationNotes,
        evaluatedAt: applicationData.eligibilityResults[0].evaluatedAt?.toISOString() ?? null,
        evaluatedBy: applicationData.eligibilityResults[0].evaluatedBy,
      } : null, // Handle case where no evaluation exists yet
    };

    return {
      success: true,
      data: structuredData,
    };
  } catch (error) {
    console.error("Error fetching application by ID:", error);
    return {
      success: false,
      error: "Failed to fetch application details",
    };
  }
}

// --- Evaluation Action ---

interface EvaluationData {
  applicationId: number;
  marketPotentialScore: number;
  innovationScore: number;
  climateAdaptationScore: number;
  jobCreationScore: number;
  viabilityScore: number;
  managementCapacityScore: number;
  locationBonus: number;
  genderBonus: number;
  totalScore: number;
  evaluationNotes: string | null;
}

/**
 * Save manual evaluation scores and notes for an application
 */
export async function saveEvaluation(data: EvaluationData) {
  try {
    console.log(`Saving evaluation for application ID: ${data.applicationId}`);
    
    // TODO: Add validation using Zod if desired
    
    // TODO: Get evaluator user ID once auth is implemented
    const evaluatorId = null; // Placeholder
    
    // Find the existing eligibility record to update or create if missing
    const existingResult = await db.query.eligibilityResults.findFirst({
      where: eq(eligibilityResults.applicationId, data.applicationId),
    });
    
    const evaluationPayload = {
        applicationId: data.applicationId,
        marketPotentialScore: data.marketPotentialScore,
        innovationScore: data.innovationScore,
        climateAdaptationScore: data.climateAdaptationScore,
        jobCreationScore: data.jobCreationScore,
        viabilityScore: data.viabilityScore,
        managementCapacityScore: data.managementCapacityScore,
        locationBonus: data.locationBonus,
        genderBonus: data.genderBonus,
        totalScore: data.totalScore,
        evaluationNotes: data.evaluationNotes,
        evaluatedAt: new Date(),
        evaluatedBy: evaluatorId, // Use actual evaluator ID later
        updatedAt: new Date(),
        // Keep existing mandatory flags if updating, set defaults if inserting
        isEligible: existingResult?.isEligible ?? false, // Preserve or default
        ageEligible: existingResult?.ageEligible ?? false,
        registrationEligible: existingResult?.registrationEligible ?? false,
        revenueEligible: existingResult?.revenueEligible ?? false,
        businessPlanEligible: existingResult?.businessPlanEligible ?? false,
        impactEligible: existingResult?.impactEligible ?? false,
    };

    if (existingResult) {
      // Update the existing eligibility record
      console.log(`Updating existing eligibility record ID: ${existingResult.id}`);
      await db.update(eligibilityResults)
        .set(evaluationPayload)
        .where(eq(eligibilityResults.id, existingResult.id));
    } else {
      // Insert a new eligibility record
      console.log(`No existing eligibility record found. Inserting new one for application ID: ${data.applicationId}`);
      await db.insert(eligibilityResults)
        .values(evaluationPayload);
      // Note: If inserting, the mandatory fields default to false.
      // Consider if checkEligibility should be re-run here or if manual review is sufficient.
    }
      
    // Optionally, update the application status (e.g., to 'under_review' or 'evaluated')
    await db.update(applications)
      .set({ 
        status: 'under_review', // Or another status like 'evaluated'
        updatedAt: new Date()
      })
      .where(eq(applications.id, data.applicationId));
      
    console.log(`✅ Evaluation saved successfully for application ID: ${data.applicationId}`);
    
    // Revalidate paths to reflect changes
    revalidatePath(`/admin/applications/${data.applicationId}`);
    revalidatePath(`/admin/applications/${data.applicationId}/evaluate`);
    revalidatePath(`/admin/applications`); // Revalidate list page too
    
    return {
      success: true,
      message: "Evaluation saved successfully.",
    };

  } catch (error) {
    console.error("Error saving evaluation:", error);
    return {
      success: false,
      error: "Failed to save evaluation.",
    };
  }
} 