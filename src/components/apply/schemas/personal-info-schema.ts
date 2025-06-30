import { z } from "zod";

// Calculate min and max dates for age validation (18-35 years)
const now = new Date();
const minBirthYear = now.getFullYear() - 35;
const maxBirthYear = now.getFullYear() - 18;
const minDate = new Date(minBirthYear, now.getMonth(), now.getDate());
const maxDate = new Date(maxBirthYear, now.getMonth(), now.getDate());

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(100, { message: "First name must be less than 100 characters" }),
  
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(100, { message: "Last name must be less than 100 characters" }),
  
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),
  
  genderOther: z.string().optional(),
  
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
      invalid_type_error: "Invalid date format",
    })
    .min(minDate, { message: "You must be 35 years or younger" })
    .max(maxDate, { message: "You must be at least 18 years old" }),
  
  citizenship: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"], {
    required_error: "Please select your country of citizenship from the participating countries",
  }),
  
  countryOfResidence: z.enum(["ghana", "kenya", "nigeria", "rwanda", "tanzania"], {
    required_error: "Please select your country of residence from the participating countries",
  }),
  
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number must be at least 8 characters" })
    .max(20, { message: "Phone number must be less than 20 characters" }),
  
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  
  highestEducation: z.enum(
    ["primary_school_and_below", "high_school", "technical_college", "undergraduate", "postgraduate"],
    {
      required_error: "Please select your highest level of education",
    }
  ),
})
.refine(data => {
  if (data.gender === 'other') {
    return data.genderOther && data.genderOther.length > 2;
  }
  return true;
}, {
  message: "Please specify your gender",
  path: ["genderOther"],
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>; 