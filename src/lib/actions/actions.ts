"use server";

import { z } from "zod";
import { applications, businesses, applicants, businessTargetCustomers, businessFunding, eligibilityResults, userProfiles } from "../../../db/schema";
import { revalidatePath } from "next/cache";
import db from "../../../db/drizzle";
import { checkEligibility } from "./eligibility";
import { eq, and, desc, count as drizzleCount, SQL, InferSelectModel, gte, lte } from "drizzle-orm";
import { auth } from "@/auth";

// Calculate min and max dates for age validation (18-35 years)
const now = new Date();
const minBirthYear = now.getFullYear() - 35;
const maxBirthYear = now.getFullYear() - 18;
const minDate = new Date(minBirthYear, now.getMonth(), now.getDate());
const maxDate = new Date(maxBirthYear, now.getMonth(), now.getDate());

// Application submission schema - updated to match new form schemas
const applicationSubmissionSchema = z.object({
  personal: z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    gender: z.enum(["male", "female", "other"]),
    dateOfBirth: z.date().min(minDate).max(maxDate),
    citizenship: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"]),
    countryOfResidence: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"]),
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
    country: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"]),
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
    
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "User not authenticated. Please login to submit an application.",
      };
    }
    
    const userId = session.user.id;
    console.log("📋 Submitting application for user:", userId);
    
    // Validate form data
    const validatedData = applicationSubmissionSchema.parse(formData);
    
    // Check if user already has an application
    const existingApplication = await db.query.applications.findFirst({
      where: eq(applications.userId, userId)
    });
    
    if (existingApplication) {
      return {
        success: false,
        message: "You have already submitted an application. Multiple applications are not allowed.",
      };
    }
    
    // Create or update user profile from application data
    try {
      const existingProfile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      if (!existingProfile) {
        // Create new user profile
        await db.insert(userProfiles).values({
          userId,
          firstName: validatedData.personal.firstName,
          lastName: validatedData.personal.lastName,
          email: validatedData.personal.email,
          role: 'applicant',
          phoneNumber: validatedData.personal.phoneNumber,
          country: validatedData.personal.countryOfResidence,
          isCompleted: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log("✅ Created user profile for:", userId);
      }
    } catch (profileError) {
      console.error("⚠️ Error creating user profile (continuing with application):", profileError);
      // Continue with application submission even if profile creation fails
    }
    
    // Insert applicant information - updated to not include "other" fields
    const newApplicant = {
      userId,
      firstName: validatedData.personal.firstName,
      lastName: validatedData.personal.lastName,
      gender: validatedData.personal.gender,
      dateOfBirth: validatedData.personal.dateOfBirth.toISOString().split('T')[0],
      citizenship: validatedData.personal.citizenship,
      citizenshipOther: null, // Set to null since we no longer support "other" option
      countryOfResidence: validatedData.personal.countryOfResidence,
      residenceOther: null, // Set to null since we no longer support "other" option
      phoneNumber: validatedData.personal.phoneNumber,
      email: validatedData.personal.email,
      highestEducation: validatedData.personal.highestEducation,
    };
    
    const [applicant] = await db.insert(applicants).values(newApplicant).returning();
    console.log("✅ Created applicant record:", applicant.id);
    
    // Insert business information - updated to not include "other" fields
    const newBusiness = {
      applicantId: applicant.id,
      name: validatedData.business.name,
      startDate: validatedData.business.startDate.toISOString().split('T')[0],
      isRegistered: validatedData.business.isRegistered,
      registrationCertificateUrl: validatedData.business.registrationCertificateUrl,
      country: validatedData.business.country,
      countryOther: null, // Set to null since we no longer support "other" option
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
    const applicationData = {
      userId: userId,
      businessId: business.id,
      status: 'submitted' as const,
      referralSource: validatedData.referralSource,
      referralSourceOther: validatedData.referralSourceOther,
      submittedAt: new Date(),
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
    console.error("❌ Error submitting application:", error);
    
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
    
    const totalCountResult = await db.select({ count: drizzleCount() }).from(applications);
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
    const applicationData = await db.query.applications.findFirst({
      where: (apps, { eq }) => eq(apps.id, id),
      with: {
        business: {
          with: {
            applicant: true,
            funding: true,
            targetCustomers: true,
          },
        },
        eligibilityResults: {
          orderBy: (results, { desc }) => [desc(results.evaluatedAt)],
          limit: 1,
        },
      },
    });
    
    if (!applicationData) {
      return {
        success: false,
        error: "Application not found",
      };
    }
    
    // Structure the data for easier integration
    const structuredData = {
      id: applicationData.id,
      status: applicationData.status,
      submittedAt: applicationData.submittedAt?.toISOString() ?? null,
      business: {
        id: applicationData.business.id,
        name: applicationData.business.name,
        country: applicationData.business.country,
        city: applicationData.business.city,
        startDate: applicationData.business.startDate,
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
        funding: applicationData.business.funding,
        targetCustomers: applicationData.business.targetCustomers.map(tc => tc.customerSegment),
      },
      applicant: {
        id: applicationData.business.applicant.id,
        userId: applicationData.business.applicant.userId,
        firstName: applicationData.business.applicant.firstName,
        lastName: applicationData.business.applicant.lastName,
        gender: applicationData.business.applicant.gender,
        dateOfBirth: applicationData.business.applicant.dateOfBirth,
        citizenship: applicationData.business.applicant.citizenship,
        countryOfResidence: applicationData.business.applicant.countryOfResidence,
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
      } : null,
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

// Evaluation Action
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
    // TODO: Get evaluator user ID once auth is implemented
    const evaluatorId = null;
    
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
        evaluatedBy: evaluatorId,
        updatedAt: new Date(),
        // Keep existing mandatory flags if updating, set defaults if inserting
        isEligible: existingResult?.isEligible ?? false,
        ageEligible: existingResult?.ageEligible ?? false,
        registrationEligible: existingResult?.registrationEligible ?? false,
        revenueEligible: existingResult?.revenueEligible ?? false,
        businessPlanEligible: existingResult?.businessPlanEligible ?? false,
        impactEligible: existingResult?.impactEligible ?? false,
    };

    if (existingResult) {
      // Update the existing eligibility record
      await db.update(eligibilityResults)
        .set(evaluationPayload)
        .where(eq(eligibilityResults.id, existingResult.id));
    } else {
      // Insert a new eligibility record
      await db.insert(eligibilityResults)
        .values(evaluationPayload);
    }
      
    // Update the application status
    await db.update(applications)
      .set({ 
        status: 'under_review',
        updatedAt: new Date()
      })
      .where(eq(applications.id, data.applicationId));
      
    // Revalidate paths to reflect changes
    revalidatePath(`/admin/applications/${data.applicationId}`);
    revalidatePath(`/admin/applications/${data.applicationId}/evaluate`);
    revalidatePath(`/admin/applications`);
    
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

// Analytics Interfaces and Functions
export interface AnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  country?: string;
  gender?: string;
  status?: string;
  isEligible?: string;
  ageRange?: string;
  educationLevel?: string;
}

export interface AnalyticsData {
  overview: {
    totalApplications: number;
    eligibleApplications: number;
    femaleApplicants: number;
    maleApplicants: number;
    averageAge: number;
    totalRevenue: number;
    totalEmployees: number;
  };
  demographics: {
    genderDistribution: Array<{ gender: string; count: number; percentage: number }>;
    ageDistribution: Array<{ ageRange: string; count: number; percentage: number }>;
    educationDistribution: Array<{ education: string; count: number; percentage: number }>;
    countryDistribution: Array<{ country: string; count: number; percentage: number }>;
  };
  business: {
    revenueDistribution: Array<{ range: string; count: number; percentage: number }>;
    employmentDistribution: Array<{ range: string; count: number; percentage: number }>;
    registrationStatus: Array<{ status: string; count: number; percentage: number }>;
  };
  evaluation: {
    averageScores: {
      marketPotential: number;
      innovation: number;
      climateAdaptation: number;
      jobCreation: number;
      viability: number;
      managementCapacity: number;
      locationBonus: number;
      genderBonus: number;
      total: number;
    };
    scoreDistribution: Array<{ scoreRange: string; count: number; percentage: number }>;
  };
  timeline: Array<{
    month: string;
    applications: number;
    eligible: number;
    femaleApplicants: number;
  }>;
}

/**
 * Get comprehensive analytics data with optional filtering
 */
export async function getAnalyticsData(filters: AnalyticsFilters = {}) {
  try {
    // Build WHERE conditions based on filters
    const whereConditions: SQL[] = [];
    
    if (filters.dateFrom) {
      whereConditions.push(gte(applications.submittedAt, new Date(filters.dateFrom)));
    }
    
    if (filters.dateTo) {
      whereConditions.push(lte(applications.submittedAt, new Date(filters.dateTo)));
    }
    
    if (filters.status && filters.status !== 'all') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whereConditions.push(eq(applications.status, filters.status as any));
    }

    // Get all applications with related data
    const applicationsData = await db.query.applications.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        business: {
          with: {
            applicant: true,
            funding: true,
            targetCustomers: true,
          },
        },
        eligibilityResults: {
          orderBy: (results, { desc }) => [desc(results.evaluatedAt)],
          limit: 1,
        },
      },
    });

    // Apply additional filters that require data processing
    const filteredApplications = applicationsData.filter(app => {
      // Gender filter
      if (filters.gender && filters.gender !== 'all') {
        if (app.business.applicant.gender !== filters.gender) return false;
      }

      // Country filter
      if (filters.country && filters.country !== 'all') {
        if (app.business.country !== filters.country) return false;
      }

      // Eligibility filter
      if (filters.isEligible && filters.isEligible !== 'all') {
        const isEligible = app.eligibilityResults[0]?.isEligible ?? false;
        if (filters.isEligible === 'true' && !isEligible) return false;
        if (filters.isEligible === 'false' && isEligible) return false;
      }

      // Age range filter
      if (filters.ageRange && filters.ageRange !== 'all') {
        const birthDate = new Date(app.business.applicant.dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        switch (filters.ageRange) {
          case '18-24':
            if (age < 18 || age > 24) return false;
            break;
          case '25-29':
            if (age < 25 || age > 29) return false;
            break;
          case '30-34':
            if (age < 30 || age > 34) return false;
            break;
          case '35+':
            if (age < 35) return false;
            break;
        }
      }

      // Education filter
      if (filters.educationLevel && filters.educationLevel !== 'all') {
        if (app.business.applicant.highestEducation !== filters.educationLevel) return false;
      }

      return true;
    });

    const totalApplications = filteredApplications.length;
    
    // Calculate overview metrics
    const eligibleApplications = filteredApplications.filter(app => 
      app.eligibilityResults[0]?.isEligible ?? false
    ).length;
    
    const femaleApplicants = filteredApplications.filter(app => 
      app.business.applicant.gender === 'female'
    ).length;
    
    const maleApplicants = filteredApplications.filter(app => 
      app.business.applicant.gender === 'male'
    ).length;

    const ages = filteredApplications.map(app => {
      const birthDate = new Date(app.business.applicant.dateOfBirth);
      return new Date().getFullYear() - birthDate.getFullYear();
    });
    const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;

    const totalRevenue = filteredApplications.reduce((sum, app) => 
      sum + parseFloat(app.business.revenueLastTwoYears || '0'), 0
    );

    const totalEmployees = filteredApplications.reduce((sum, app) => 
      sum + (app.business.fullTimeEmployeesTotal || 0) + 
      (app.business.partTimeEmployeesMale || 0) + 
      (app.business.partTimeEmployeesFemale || 0), 0
    );

    // Calculate demographics
    const genderCounts = { female: 0, male: 0, other: 0 };
    filteredApplications.forEach(app => {
      genderCounts[app.business.applicant.gender as keyof typeof genderCounts]++;
    });

    const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
      gender: gender.charAt(0).toUpperCase() + gender.slice(1),
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    // Age distribution
    const ageCounts = { '18-24': 0, '25-29': 0, '30-34': 0, '35+': 0 };
    filteredApplications.forEach(app => {
      const birthDate = new Date(app.business.applicant.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      if (age >= 18 && age <= 24) ageCounts['18-24']++;
      else if (age >= 25 && age <= 29) ageCounts['25-29']++;
      else if (age >= 30 && age <= 34) ageCounts['30-34']++;
      else if (age >= 35) ageCounts['35+']++;
    });

    const ageDistribution = Object.entries(ageCounts).map(([ageRange, count]) => ({
      ageRange,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    // Education distribution
    const educationCounts: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const education = app.business.applicant.highestEducation;
      educationCounts[education] = (educationCounts[education] || 0) + 1;
    });

    const educationLabels: Record<string, string> = {
      'primary_school_and_below': 'Primary School',
      'high_school': 'High School',
      'technical_college': 'Technical College',
      'undergraduate': 'Undergraduate',
      'postgraduate': 'Postgraduate',
    };

    const educationDistribution = Object.entries(educationCounts).map(([education, count]) => ({
      education: educationLabels[education] || education,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    // Country distribution
    const countryCounts: Record<string, number> = {};
    filteredApplications.forEach(app => {
      const country = app.business.country;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const countryLabels: Record<string, string> = {
      'ghana': 'Ghana',
      'kenya': 'Kenya',
      'nigeria': 'Nigeria',
      'rwanda': 'Rwanda',
      'tanzania': 'Tanzania',
    };

    const countryDistribution = Object.entries(countryCounts).map(([country, count]) => ({
      country: countryLabels[country] || country,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    // Business metrics
    const revenueCounts = { '$0 - $999': 0, '$1,000 - $4,999': 0, '$5,000 - $9,999': 0, '$10,000 - $49,999': 0, '$50,000+': 0 };
    filteredApplications.forEach(app => {
      const revenue = parseFloat(app.business.revenueLastTwoYears || '0');
      if (revenue < 1000) revenueCounts['$0 - $999']++;
      else if (revenue < 5000) revenueCounts['$1,000 - $4,999']++;
      else if (revenue < 10000) revenueCounts['$5,000 - $9,999']++;
      else if (revenue < 50000) revenueCounts['$10,000 - $49,999']++;
      else revenueCounts['$50,000+']++;
    });

    const revenueDistribution = Object.entries(revenueCounts).map(([range, count]) => ({
      range,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    const employmentCounts = { '0 employees': 0, '1-4 employees': 0, '5-9 employees': 0, '10-19 employees': 0, '20+ employees': 0 };
    filteredApplications.forEach(app => {
      const totalEmp = (app.business.fullTimeEmployeesTotal || 0) + 
                      (app.business.partTimeEmployeesMale || 0) + 
                      (app.business.partTimeEmployeesFemale || 0);
      
      if (totalEmp === 0) employmentCounts['0 employees']++;
      else if (totalEmp <= 4) employmentCounts['1-4 employees']++;
      else if (totalEmp <= 9) employmentCounts['5-9 employees']++;
      else if (totalEmp <= 19) employmentCounts['10-19 employees']++;
      else employmentCounts['20+ employees']++;
    });

    const employmentDistribution = Object.entries(employmentCounts).map(([range, count]) => ({
      range,
      count,
      percentage: totalApplications > 0 ? Math.round((count / totalApplications) * 100) : 0,
    }));

    const registeredCount = filteredApplications.filter(app => app.business.isRegistered).length;
    const registrationStatus = [
      {
        status: 'Registered',
        count: registeredCount,
        percentage: totalApplications > 0 ? Math.round((registeredCount / totalApplications) * 100) : 0,
      },
      {
        status: 'Not Registered',
        count: totalApplications - registeredCount,
        percentage: totalApplications > 0 ? Math.round(((totalApplications - registeredCount) / totalApplications) * 100) : 0,
      },
    ];

    // Evaluation metrics
    const evaluatedApplications = filteredApplications.filter(app => app.eligibilityResults.length > 0);
    const evaluationCount = evaluatedApplications.length;

    let averageScores = {
      marketPotential: 0,
      innovation: 0,
      climateAdaptation: 0,
      jobCreation: 0,
      viability: 0,
      managementCapacity: 0,
      locationBonus: 0,
      genderBonus: 0,
      total: 0,
    };

    if (evaluationCount > 0) {
      const totals = evaluatedApplications.reduce((acc, app) => {
        const result = app.eligibilityResults[0];
        return {
          marketPotential: acc.marketPotential + (result.marketPotentialScore || 0),
          innovation: acc.innovation + (result.innovationScore || 0),
          climateAdaptation: acc.climateAdaptation + (result.climateAdaptationScore || 0),
          jobCreation: acc.jobCreation + (result.jobCreationScore || 0),
          viability: acc.viability + (result.viabilityScore || 0),
          managementCapacity: acc.managementCapacity + (result.managementCapacityScore || 0),
          locationBonus: acc.locationBonus + (result.locationBonus || 0),
          genderBonus: acc.genderBonus + (result.genderBonus || 0),
          total: acc.total + (result.totalScore || 0),
        };
      }, averageScores);

      averageScores = {
        marketPotential: Math.round((totals.marketPotential / evaluationCount) * 10) / 10,
        innovation: Math.round((totals.innovation / evaluationCount) * 10) / 10,
        climateAdaptation: Math.round((totals.climateAdaptation / evaluationCount) * 10) / 10,
        jobCreation: Math.round((totals.jobCreation / evaluationCount) * 10) / 10,
        viability: Math.round((totals.viability / evaluationCount) * 10) / 10,
        managementCapacity: Math.round((totals.managementCapacity / evaluationCount) * 10) / 10,
        locationBonus: Math.round((totals.locationBonus / evaluationCount) * 10) / 10,
        genderBonus: Math.round((totals.genderBonus / evaluationCount) * 10) / 10,
        total: Math.round((totals.total / evaluationCount) * 10) / 10,
      };
    }

    const scoreCounts = { '0-19': 0, '20-39': 0, '40-59': 0, '60-79': 0, '80+': 0 };
    evaluatedApplications.forEach(app => {
      const score = app.eligibilityResults[0].totalScore || 0;
      if (score < 20) scoreCounts['0-19']++;
      else if (score < 40) scoreCounts['20-39']++;
      else if (score < 60) scoreCounts['40-59']++;
      else if (score < 80) scoreCounts['60-79']++;
      else scoreCounts['80+']++;
    });

    const scoreDistribution = Object.entries(scoreCounts).map(([scoreRange, count]) => ({
      scoreRange,
      count,
      percentage: evaluationCount > 0 ? Math.round((count / evaluationCount) * 100) : 0,
    }));

    // Timeline data (last 6 months)
    const timeline = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthApplications = filteredApplications.filter(app => {
        const submittedAt = new Date(app.submittedAt || '');
        return submittedAt >= monthStart && submittedAt <= monthEnd;
      });

      const monthEligible = monthApplications.filter(app => 
        app.eligibilityResults[0]?.isEligible ?? false
      ).length;

      const monthFemale = monthApplications.filter(app => 
        app.business.applicant.gender === 'female'
      ).length;

      timeline.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        applications: monthApplications.length,
        eligible: monthEligible,
        femaleApplicants: monthFemale,
      });
    }

    const analyticsData: AnalyticsData = {
      overview: {
        totalApplications,
        eligibleApplications,
        femaleApplicants,
        maleApplicants,
        averageAge,
        totalRevenue,
        totalEmployees,
      },
      demographics: {
        genderDistribution,
        ageDistribution,
        educationDistribution,
        countryDistribution,
      },
      business: {
        revenueDistribution,
        employmentDistribution,
        registrationStatus,
      },
      evaluation: {
        averageScores,
        scoreDistribution,
      },
      timeline,
    };

    return {
      success: true,
      data: analyticsData,
    };

  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      success: false,
      error: "Failed to fetch analytics data",
    };
  }
}

/**
 * Export analytics data as CSV
 */
export async function exportAnalyticsData(filters: AnalyticsFilters = {}) {
  try {
    const result = await getAnalyticsData(filters);
    
    if (!result.success || !result.data) {
      return {
        success: false,
        error: "Failed to fetch data for export",
      };
    }

    // Get detailed application data for CSV export
    const whereConditions: SQL[] = [];
    
    if (filters.dateFrom) {
      whereConditions.push(gte(applications.submittedAt, new Date(filters.dateFrom)));
    }
    
    if (filters.dateTo) {
      whereConditions.push(lte(applications.submittedAt, new Date(filters.dateTo)));
    }
    
    if (filters.status && filters.status !== 'all') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      whereConditions.push(eq(applications.status, filters.status as any));
    }

    const applicationsData = await db.query.applications.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        business: {
          with: {
            applicant: true,
            funding: true,
            targetCustomers: true,
          },
        },
        eligibilityResults: {
          orderBy: (results, { desc }) => [desc(results.evaluatedAt)],
          limit: 1,
        },
      },
    });

    // Apply additional filters
    const filteredApplications = applicationsData.filter(app => {
      if (filters.gender && filters.gender !== 'all') {
        if (app.business.applicant.gender !== filters.gender) return false;
      }

      if (filters.country && filters.country !== 'all') {
        if (app.business.country !== filters.country) return false;
      }

      if (filters.isEligible && filters.isEligible !== 'all') {
        const isEligible = app.eligibilityResults[0]?.isEligible ?? false;
        if (filters.isEligible === 'true' && !isEligible) return false;
        if (filters.isEligible === 'false' && isEligible) return false;
      }

      if (filters.ageRange && filters.ageRange !== 'all') {
        const birthDate = new Date(app.business.applicant.dateOfBirth);
        const age = new Date().getFullYear() - birthDate.getFullYear();
        
        switch (filters.ageRange) {
          case '18-24':
            if (age < 18 || age > 24) return false;
            break;
          case '25-29':
            if (age < 25 || age > 29) return false;
            break;
          case '30-34':
            if (age < 30 || age > 34) return false;
            break;
          case '35+':
            if (age < 35) return false;
            break;
        }
      }

      if (filters.educationLevel && filters.educationLevel !== 'all') {
        if (app.business.applicant.highestEducation !== filters.educationLevel) return false;
      }

      return true;
    });

    // Convert to CSV format
    const csvHeaders = [
      'Application ID',
      'Status',
      'Submitted At',
      'First Name',
      'Last Name',
      'Gender',
      'Age',
      'Education',
      'Citizenship',
      'Country of Residence',
      'Email',
      'Phone',
      'Business Name',
      'Business Country',
      'Business City',
      'Start Date',
      'Is Registered',
      'Revenue (Last 2 Years)',
      'Full Time Employees',
      'Part Time Employees',
      'Is Eligible',
      'Total Score',
      'Market Potential Score',
      'Innovation Score',
      'Climate Adaptation Score',
      'Job Creation Score',
      'Viability Score',
      'Management Capacity Score',
      'Location Bonus',
      'Gender Bonus',
    ];

    const csvRows = filteredApplications.map(app => {
      const applicant = app.business.applicant;
      const business = app.business;
      const eligibility = app.eligibilityResults[0];
      
      const birthDate = new Date(applicant.dateOfBirth);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      
      const totalPartTime = (business.partTimeEmployeesMale || 0) + (business.partTimeEmployeesFemale || 0);

      return [
        app.id,
        app.status,
        app.submittedAt?.toISOString().split('T')[0] || '',
        applicant.firstName,
        applicant.lastName,
        applicant.gender,
        age,
        applicant.highestEducation,
        applicant.citizenship,
        applicant.countryOfResidence,
        applicant.email,
        applicant.phoneNumber,
        business.name,
        business.country,
        business.city,
        business.startDate,
        business.isRegistered ? 'Yes' : 'No',
        business.revenueLastTwoYears,
        business.fullTimeEmployeesTotal || 0,
        totalPartTime,
        eligibility?.isEligible ? 'Yes' : 'No',
        eligibility?.totalScore || 0,
        eligibility?.marketPotentialScore || 0,
        eligibility?.innovationScore || 0,
        eligibility?.climateAdaptationScore || 0,
        eligibility?.jobCreationScore || 0,
        eligibility?.viabilityScore || 0,
        eligibility?.managementCapacityScore || 0,
        eligibility?.locationBonus || 0,
        eligibility?.genderBonus || 0,
      ];
    });

    // Create CSV content
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return {
      success: true,
      data: csvContent,
      filename: `analytics_export_${new Date().toISOString().split('T')[0]}.csv`,
    };

  } catch (error) {
    console.error("Error exporting analytics data:", error);
    return {
      success: false,
      error: "Failed to export analytics data",
    };
  }
} 