"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, User, MapPin, Phone } from "lucide-react";
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
  
  const [dateOfBirthInput, setDateOfBirthInput] = useState(
    form.getValues().personal?.dateOfBirth 
      ? format(form.getValues().personal.dateOfBirth, "yyyy-MM-dd") 
      : ""
  );
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
     
      
      // Validate the personal data specifically
      const personalData = data.personal;
      const validationResult = personalInfoSchema.safeParse(personalData);
      
      if (!validationResult.success) {
        console.error("Personal Info Validation Errors:", validationResult.error.errors);
        toast.error("Please fix the errors in the form before proceeding.");
        
        // Show specific field errors
        validationResult.error.errors.forEach((error) => {
          console.error(`Field ${error.path.join('.')}: ${error.message}`);
        });
        return;
      }
      
      console.log("Personal Info Data validated successfully:", validationResult.data);
      toast.success("Personal information saved successfully!");
      onNext();
    } catch (error) {
      console.error("Error in personal info form submission:", error);
      toast.error("An error occurred while saving your information. Please try again.");
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full mb-4">
          <User className="h-6 w-6" />
          <h2 className="text-xl font-bold">Personal Information</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Please provide your personal details for the InCountry YouthAdapt Challenge 2025. All information will be kept confidential and secure.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <User className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Basic Details</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personal.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">First Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your first name" 
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                      <FormLabel className="text-gray-900 font-medium">Last Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your last name" 
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                  <FormItem className="space-y-4">
                    <FormLabel className="text-gray-900 font-medium">Gender *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-8"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                          <FormControl>
                            <RadioGroupItem
                              value="male"
                              className="bg-gray-100 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-900">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="female" className="bg-gray-100 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-900">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="other" className="bg-gray-100 border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-gray-900">Other</FormLabel>
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
                    }
                  };

                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-900 font-medium">Date of Birth *</FormLabel>
                      <div className="relative">
                        <Input
                          type="date"
                          value={dateOfBirthInput}
                          onChange={handleInputChange}
                          className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12 pr-10"
                          max={format(new Date(), "yyyy-MM-dd")}
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 hover:bg-blue-50"
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
                      <FormDescription className="text-gray-600">
                        You must be between 18 and 35 years old. Format: YYYY-MM-DD
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          
          {/* Citizenship & Residence Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Citizenship & Residence</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Citizenship field - Remove Other option */}
              <FormField
                control={form.control}
                name="personal.citizenship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Country of Citizenship *</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12">
                          <SelectValue placeholder="Select your country of citizenship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="rwanda">Rwanda</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-600">
                      This challenge focuses on the 5 participating countries. You must hold nationality from one of these countries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Country of Residence field - Remove Other option */}
              <FormField
                control={form.control}
                name="personal.countryOfResidence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Country of Residence *</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12">
                          <SelectValue placeholder="Select your country of residence" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="rwanda">Rwanda</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-600">
                      You must be currently residing in one of the participating countries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Phone className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Contact Information</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="personal.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Phone Number *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your phone number" 
                          className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                      <FormLabel className="text-gray-900 font-medium">Email Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email address" 
                          type="email"
                          className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                    <FormLabel className="text-gray-900 font-medium">Highest Education Level *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 h-12">
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
          </div>
          
          {/* Data Protection Disclaimer */}
          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Data Protection Notice</h4>
                <p className="text-sm text-blue-800 leading-relaxed">
                  We are committed to protecting your personal information. We collect and use your data for the InCountry Youth Adapt Challenge 2025. 
                  We will not share your data with third parties without your consent, except as required by law. We have implemented security measures 
                  to protect your data from unauthorised access.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue to Business Information
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 