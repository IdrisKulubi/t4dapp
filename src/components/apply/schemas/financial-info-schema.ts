import { z } from "zod";

export const financialInfoSchema = z.object({
  financial: z.object({
    // Current Financial Status
    annualRevenue: z
      .number()
      .min(0, { message: "Revenue cannot be negative" })
      .optional()
      .nullable(),
    revenueGrowthRate: z
      .number()
      .min(-100, { message: "Growth rate cannot be less than -100%" })
      .max(1000, { message: "Growth rate cannot exceed 1000%" })
      .optional()
      .nullable(),
    profitMargin: z
      .number()
      .min(-100, { message: "Profit margin cannot be less than -100%" })
      .max(100, { message: "Profit margin cannot exceed 100%" })
      .optional()
      .nullable(),
    
    // Funding Information
    previousFunding: z.boolean(),
    previousFundingSources: z.array(z.string()).optional(),
    previousFundingAmount: z
      .number()
      .min(0, { message: "Funding amount cannot be negative" })
      .optional()
      .nullable(),
    
    // Funding Request
    requestedFundingAmount: z
      .number()
      .min(1000, { message: "Funding request must be at least $1,000" })
      .max(100000, { message: "Funding request cannot exceed $100,000" }),
    fundingUse: z
      .string()
      .min(50, { message: "Description must be at least 50 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Business Model
    revenueModel: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    costStructure: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Financial Projections
    projectedRevenueOneYear: z
      .number()
      .min(0, { message: "Projected revenue cannot be negative" })
      .optional()
      .nullable(),
    projectedRevenueTwoYears: z
      .number()
      .min(0, { message: "Projected revenue cannot be negative" })
      .optional()
      .nullable(),
    projectedRevenueThreeYears: z
      .number()
      .min(0, { message: "Projected revenue cannot be negative" })
      .optional()
      .nullable(),
    
    // Financial Sustainability
    pathToSustainability: z
      .string()
      .min(50, { message: "Description must be at least 50 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
      
    // Additional Financial Information
    financialChallenges: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    additionalFinancialInfo: z.string().optional()
  })
});

export type FinancialInfoFormValues = z.infer<typeof financialInfoSchema>;

// Default values for the form
export const defaultFinancialInfo: FinancialInfoFormValues = {
  financial: {
    annualRevenue: null,
    revenueGrowthRate: null,
    profitMargin: null,
    previousFunding: false,
    previousFundingSources: [],
    previousFundingAmount: null,
    requestedFundingAmount: 1000,
    fundingUse: "",
    revenueModel: "",
    costStructure: "",
    projectedRevenueOneYear: null,
    projectedRevenueTwoYears: null,
    projectedRevenueThreeYears: null,
    pathToSustainability: "",
    financialChallenges: "",
    additionalFinancialInfo: ""
  }
}; 