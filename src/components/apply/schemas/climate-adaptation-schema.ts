import { z } from "zod";

export const climateAdaptationSchema = z.object({
  adaptation: z.object({
    // Climate Solution Details
    solutionTitle: z.string().min(2, { message: "Title must be at least 2 characters" }),
    solutionDescription: z
      .string()
      .min(50, { message: "Description must be at least 50 characters" })
      .max(2000, { message: "Description must not exceed 2000 characters" }),
    
    // Primary Climate Challenge Addressed
    primaryChallenge: z.enum(["drought", "flood", "heatwave", "storm", "sealevel", "other"], {
      required_error: "Please select a primary climate challenge",
    }),
    primaryChallengeOther: z.string().optional().nullable(),
    
    // Secondary Climate Challenges
    secondaryChallenges: z.array(z.string()).optional(),
    
    // Target Beneficiaries
    targetBeneficiaries: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    estimatedBeneficiariesCount: z
      .number()
      .int({ message: "Please enter a whole number" })
      .min(1, { message: "Must have at least 1 beneficiary" })
      .optional()
      .nullable(),
    
    // Technology & Innovation
    technologyDescription: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    innovationDescription: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Implementation & Scaling
    implementationApproach: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    scalingStrategy: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Impact & Evidence
    measurableImpact: z.string().min(10, {
      message: "Description must be at least 10 characters",
    }),
    evidenceOfImpact: z
      .string()
      .min(0)
      .max(1000, { message: "Description must not exceed 1000 characters" })
      .optional(),
  })
});

export type ClimateAdaptationFormValues = z.infer<typeof climateAdaptationSchema>;

// Default values for the form
export const defaultClimateAdaptation: ClimateAdaptationFormValues = {
  adaptation: {
    solutionTitle: "",
    solutionDescription: "",
    primaryChallenge: "drought" as const,
    primaryChallengeOther: null,
    secondaryChallenges: [],
    targetBeneficiaries: "",
    estimatedBeneficiariesCount: null,
    technologyDescription: "",
    innovationDescription: "",
    implementationApproach: "",
    scalingStrategy: "",
    measurableImpact: "",
    evidenceOfImpact: "",
  }
}; 