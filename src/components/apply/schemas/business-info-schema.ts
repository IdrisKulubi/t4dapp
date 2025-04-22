import { z } from "zod";

// Get the current date for validation
const now = new Date();
const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

export const businessInfoSchema = z.object({
  business: z.object({
    // Basic Information
    name: z.string().min(2, { message: "Business name must be at least 2 characters" }),
    startDate: z.date({ required_error: "Please select a start date" }),
    isRegistered: z.boolean(),
    registrationCertificateUrl: z.string().url({ message: "Please enter a valid URL" }).optional().nullable(),
    
    // Location
    country: z.string({ required_error: "Please select a country" }),
    countryOther: z.string().optional().nullable(),
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
    
    // Product/Service Information
    productServiceDescription: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    unitPrice: z
      .number()
      .min(0, { message: "Price cannot be negative" })
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
      .min(5, { message: "Capacity description must be at least 5 characters" })
      .optional(),
    customerSegments: z
      .array(z.string())
      .min(1, { message: "Please select at least one customer segment" }),
    
    // Climate Impact
    climateAdaptationContribution: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    climateExtremeImpact: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Challenges & Support
    currentChallenges: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    supportNeeded: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    additionalInformation: z.string().optional().nullable(),
  })
});

export type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

// Default values for the form
export const defaultBusinessInfo: BusinessInfoFormValues = {
  business: {
    name: "",
    startDate: new Date(),
    isRegistered: false,
    registrationCertificateUrl: null,
    country: "",
    countryOther: null,
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
    climateAdaptationContribution: "",
    climateExtremeImpact: "",
    currentChallenges: "",
    supportNeeded: "",
    additionalInformation: null,
  }
}; 