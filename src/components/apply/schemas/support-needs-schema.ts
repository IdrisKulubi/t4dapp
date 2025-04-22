import { z } from "zod";

export const supportNeedsSchema = z.object({
  support: z.object({
    // Support Type Needed
    supportTypes: z
      .array(z.string())
      .min(1, { message: "Please select at least one type of support needed" }),
    supportTypesOther: z.string().optional().nullable(),
    
    // Mentorship Needs
    mentorshipNeeds: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    preferredMentorExpertise: z
      .array(z.string())
      .min(1, { message: "Please select at least one area of expertise" }),
    preferredMentorExpertiseOther: z.string().optional().nullable(),
    
    // Training Needs
    trainingNeeds: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    preferredTrainingFormat: z.enum(["inPerson", "online", "hybrid"], {
      required_error: "Please select a preferred training format",
    }),
    
    // Networking Needs
    networkingNeeds: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    desiredNetworkingConnections: z
      .array(z.string())
      .min(1, { message: "Please select at least one type of connection" }),
    
    // Resources Needs
    resourcesNeeded: z
      .string()
      .min(20, { message: "Description must be at least 20 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Expected Impact
    expectedBusinessImpact: z
      .string()
      .min(50, { message: "Description must be at least 50 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    expectedEnvironmentalImpact: z
      .string()
      .min(50, { message: "Description must be at least 50 characters" })
      .max(1000, { message: "Description must not exceed 1000 characters" }),
    
    // Additional Information
    additionalSupportInfo: z.string().optional()
  })
});

export type SupportNeedsFormValues = z.infer<typeof supportNeedsSchema>;

// Default values for the form
export const defaultSupportNeeds: SupportNeedsFormValues = {
  support: {
    supportTypes: [],
    supportTypesOther: null,
    mentorshipNeeds: "",
    preferredMentorExpertise: [],
    preferredMentorExpertiseOther: null,
    trainingNeeds: "",
    preferredTrainingFormat: "hybrid" as const,
    networkingNeeds: "",
    desiredNetworkingConnections: [],
    resourcesNeeded: "",
    expectedBusinessImpact: "",
    expectedEnvironmentalImpact: "",
    additionalSupportInfo: ""
  }
}; 