import { z } from "zod";

// Get the current date for validation
const now = new Date();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

export const businessInfoSchema = z.object({
  business: z.object({
    // Basic Information
    name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    startDate: z.date({ required_error: "Please select a start date" }),
    isRegistered: z.boolean(),
    registrationCertificateUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    
    // Document URLs
    businessOverviewUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    cr12Url: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    auditedAccountsUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    taxComplianceUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    
    // Sector Categorization
    sector: z.enum(["food-security", "infrastructure", "other"], {
      required_error: "Please select a sector"
    }).optional(),
    
    // Location - Updated to focus on participating countries only
    country: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"], { 
      required_error: "Please select a participating country" 
    }),
    city: z.string().min(2, { message: "City must be at least 2 characters" }),
    registeredCountries: z.string().optional(),
    
    // Business Description
    description: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    problemSolved: z
      .string()
      .min(20, { message: "Problem description must be at least 20 characters" })
      .max(1000, { message: "Problem description must not exceed 1000 characters" }),
    
    // Business Performance
    revenueLastTwoYears: z
      .number()
      .min(0, { message: "Revenue cannot be negative" })
      .optional()
      .nullable(),
    fullTimeEmployeesTotal: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    fullTimeEmployeesMale: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    fullTimeEmployeesFemale: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    partTimeEmployeesMale: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    partTimeEmployeesFemale: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    
    // Product/Service Details
    productServiceDescription: z
      .string()
      .min(20, { message: "Product/service description must be at least 20 characters" })
      .max(1000, { message: "Product/service description must not exceed 1000 characters" }),
    unitPrice: z
      .number()
      .min(0, { message: "Unit price cannot be negative" })
      .optional()
      .nullable(),
    customerCountLastSixMonths: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(0, { message: "Cannot be negative" })
      .optional()
      .nullable(),
    productionCapacityLastSixMonths: z
      .string()
      .min(10, { message: "Production capacity description must be at least 10 characters" })
      .optional(),
    
    // Customer Segments - Updated to match what actions file expects as "targetCustomers"
    customerSegments: z.array(
      z.enum([
        "household_individuals",
        "micro_small_medium_enterprises",
        "institutions",
        "corporates",
        "government_and_ngos"
      ])
    ).optional(),
    
    // Target Customers (alias for customerSegments to match actions file)
    targetCustomers: z.array(
      z.enum([
        "household_individuals",
        "micro_small_medium_enterprises",
        "institutions",
        "corporates",
        "government_and_ngos"
      ])
    ).optional(),
    
    // Climate Adaptation
    climateAdaptationContribution: z
      .string()
      .min(50, { message: "Climate adaptation contribution must be at least 50 characters" })
      .max(1000, { message: "Climate adaptation contribution must not exceed 1000 characters" }),
    climateExtremeImpact: z
      .string()
      .min(50, { message: "Climate extreme impact description must be at least 50 characters" })
      .max(1000, { message: "Climate extreme impact description must not exceed 1000 characters" }),
    
    // Challenges and Support
    currentChallenges: z
      .string()
      .min(20, { message: "Current challenges description must be at least 20 characters" })
      .max(1000, { message: "Current challenges description must not exceed 1000 characters" }),
    supportNeeded: z
      .string()
      .min(20, { message: "Support needed description must be at least 20 characters" })
      .max(1000, { message: "Support needed description must not exceed 1000 characters" }),
    additionalInformation: z
      .string()
      .max(1000, { message: "Additional information must not exceed 1000 characters" })
      .optional()
      .nullable(),
    
    // Funding Information - Complete funding schema to match actions file
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
    }).optional(),
  })
});

export type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

// Default values for the form - Fix linter error by using valid enum value
export const defaultBusinessInfo: BusinessInfoFormValues = {
  business: {
    name: "",
    startDate: new Date(),
    isRegistered: false,
    registrationCertificateUrl: null,
    businessOverviewUrl: null,
    cr12Url: null,
    auditedAccountsUrl: null,
    taxComplianceUrl: null,
    sector: undefined,
    country: "ghana" as const, // Fix linter error - use valid enum value instead of empty string
    city: "",
    registeredCountries: "",
    description: "",
    problemSolved: "",
    revenueLastTwoYears: null,
    fullTimeEmployeesTotal: null,
    fullTimeEmployeesMale: null,
    fullTimeEmployeesFemale: null,
    partTimeEmployeesMale: null,
    partTimeEmployeesFemale: null,
    productServiceDescription: "",
    unitPrice: null,
    customerCountLastSixMonths: null,
    productionCapacityLastSixMonths: "",
    customerSegments: [],
    targetCustomers: [],
    climateAdaptationContribution: "",
    climateExtremeImpact: "",
    currentChallenges: "",
    supportNeeded: "",
    additionalInformation: null,
    funding: {
      hasExternalFunding: false,
      fundingSource: null,
      fundingSourceOther: null,
      fundingDate: null,
      funderName: null,
      amountUsd: null,
      fundingInstrument: null,
      fundingInstrumentOther: null,
    },
  }
}; 