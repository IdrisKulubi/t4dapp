"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { z } from "zod";
import { personalInfoSchema } from "../schemas/personal-info-schema";

// Define the form values type based on the schema
export type PersonalInfoFormValues = {
  personal: z.infer<typeof personalInfoSchema>;
};

// Define the props for the component
export interface PersonalInfoFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onNext: () => void;
}

export function PersonalInfoForm({ form, onNext }: PersonalInfoFormProps) {
  const { formState } = form;
  const [showOtherCitizenship, setShowOtherCitizenship] = useState(
    form.getValues().personal?.citizenship === "other"
  );
  const [showOtherResidence, setShowOtherResidence] = useState(
    form.getValues().personal?.countryOfResidence === "other"
  );
  
  // Add this at the component level, with other state hooks
  const [dateOfBirthInput, setDateOfBirthInput] = useState(
    form.getValues().personal?.dateOfBirth 
      ? format(form.getValues().personal.dateOfBirth, "yyyy-MM-dd") 
      : ""
  );
  
  // Handle show/hide of other country fields
  const handleCitizenshipChange = (value: string) => {
    setShowOtherCitizenship(value === "other");
    if (value !== "other") {
      form.setValue("personal.citizenshipOther", null);
    }
  };
  
  const handleResidenceChange = (value: string) => {
    setShowOtherResidence(value === "other");
    if (value !== "other") {
      form.setValue("personal.residenceOther", null);
    }
  };
  
  const handleSubmit = async (data: PersonalInfoFormValues) => {
    // Validate fields
    try {
      personalInfoSchema.parse(data.personal);
      console.log("Personal Info Data:", data.personal);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Please fill all required fields correctly.");
        // Highlight missing required fields
        form.trigger("personal");
      }
    }
  };
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Personal Information</h2>
            <p className="text-muted-foreground mt-1">
              Please provide your personal details for the application.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Basic Details</h3>
                
                {/* Name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="personal.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your first name" 
                            className="bg-white dark:bg-gray-800" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personal.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your last name" 
                            className="bg-white dark:bg-gray-800" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Gender field */}
                <FormField
                  control={form.control}
                  name="personal.gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="required">Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Date of Birth field */}
                <FormField
                  control={form.control}
                  name="personal.dateOfBirth"
                  render={({ field }) => {
                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setDateOfBirthInput(value);
                      
                      // Try to parse the input value
                      try {
                        const date = parse(value, "yyyy-MM-dd", new Date());
                        if (!isNaN(date.getTime())) {
                          field.onChange(date);
                        }
                      } catch (error) {
                        console.error("Invalid date format:", error);
                        toast.error("Invalid date format. Please enter a valid date.");
                        // Invalid date format
                      }
                    };

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="required">Date of Birth</FormLabel>
                        <div className="relative">
                          <Input
                            type="date"
                            value={dateOfBirthInput}
                            onChange={handleInputChange}
                            className="bg-white dark:bg-gray-800 pr-10"
                            max={format(new Date(), "yyyy-MM-dd")}
                          />
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                              >
                                <CalendarIcon className="h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    field.onChange(date);
                                    setDateOfBirthInput(format(date, "yyyy-MM-dd"));
                                  }
                                }}
                                disabled={(date) => {
                                  const now = new Date();
                                  const minDate = new Date(
                                    now.getFullYear() - 35,
                                    now.getMonth(),
                                    now.getDate()
                                  );
                                  const maxDate = new Date(
                                    now.getFullYear() - 18,
                                    now.getMonth(),
                                    now.getDate()
                                  );
                                  return date > maxDate || date < minDate;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormDescription>
                          You must be between 18 and 35 years old. Format: YYYY-MM-DD
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Citizenship & Residence</h3>
                
                {/* Citizenship field */}
                <FormField
                  control={form.control}
                  name="personal.citizenship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Country of Citizenship</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleCitizenshipChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select your country of citizenship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="rwanda">Rwanda</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Other Citizenship field - conditional */}
                {showOtherCitizenship && (
                  <FormField
                    control={form.control}
                    name="personal.citizenshipOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Specify Country of Citizenship</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter country name" 
                            className="bg-white dark:bg-gray-800"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {/* Country of Residence field */}
                <FormField
                  control={form.control}
                  name="personal.countryOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Country of Residence</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleResidenceChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select your country of residence" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ghana">Ghana</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="nigeria">Nigeria</SelectItem>
                          <SelectItem value="rwanda">Rwanda</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Other Residence field - conditional */}
                {showOtherResidence && (
                  <FormField
                    control={form.control}
                    name="personal.residenceOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Specify Country of Residence</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter country name" 
                            className="bg-white dark:bg-gray-800"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="personal.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your phone number" 
                            className="bg-white dark:bg-gray-800"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="personal.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="required">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your email address" 
                            type="email"
                            className="bg-white dark:bg-gray-800"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="personal.highestEducation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Highest Education Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select your highest education level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primary_school_and_below">Primary School and Below</SelectItem>
                          <SelectItem value="high_school">High School</SelectItem>
                          <SelectItem value="technical_college">Technical College</SelectItem>
                          <SelectItem value="undergraduate">Undergraduate</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? "Saving..." : "Continue to Business Info"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
} 