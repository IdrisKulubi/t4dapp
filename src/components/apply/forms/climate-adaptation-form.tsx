/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { climateAdaptationSchema } from "../schemas/climate-adaptation-schema";
import { Zap, AlertTriangle, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Target } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ClimateAdaptationFormValues = z.infer<typeof climateAdaptationSchema>;

// Secondary climate challenges options
const SECONDARY_CHALLENGES = [
  { id: "drought", label: "Drought" },
  { id: "flood", label: "Flooding" },
  { id: "heatwave", label: "Heat Waves" },
  { id: "storm", label: "Storms & Cyclones" },
  { id: "sealevel", label: "Sea Level Rise" },
  { id: "landslide", label: "Landslides" },
  { id: "biodiversity", label: "Biodiversity Loss" },
  { id: "waterscarcity", label: "Water Scarcity" },
  { id: "foodsecurity", label: "Food Security" },
];

// Props type
type ClimateAdaptationFormProps = {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrevious: () => void;
};

export function ClimateAdaptationForm({ form, onNext, onPrevious }: ClimateAdaptationFormProps) {
  const { formState } = form;
  
  const handleSubmit = async (data: any) => {
    try {
      // Log the data being validated
      console.log("Validating Climate Adaptation Data:", data.adaptation);
      
      // Explicitly check measurableImpact as it's required
      if (!data.adaptation?.measurableImpact || data.adaptation.measurableImpact.length < 10) {
        toast.error("Measurable Impact is required and must be at least 10 characters.");
        form.setError("adaptation.measurableImpact", {
          type: "manual",
          message: "Description must be at least 10 characters"
        });
        return;
      }
      
      // Validate the form data against the schema
      climateAdaptationSchema.parse(data);
      console.log("Climate Adaptation Data is valid:", data.adaptation);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        toast.error("Please fill all required fields correctly.");
        // Trigger validation to show errors
        form.trigger("adaptation");
      }
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
          <Zap className="h-6 w-6" />
          <h2 className="text-xl font-bold">Climate Adaptation Solution</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Describe your climate adaptation solution and its impact on communities and the environment.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Solution Details Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Target className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Solution Details</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Solution Title */}
              <FormField
                control={form.control}
                name="adaptation.solutionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Solution Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter the title of your climate solution" 
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Solution Description */}
              <FormField
                control={form.control}
                name="adaptation.solutionDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Solution Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of your climate adaptation solution" 
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Describe what your solution does, how it works, and the specific climate challenges it addresses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Primary Climate Challenge Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Climate Challenges</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Primary Challenge */}
              <FormField
                control={form.control}
                name="adaptation.primaryChallenge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Primary Climate Challenge</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select primary climate challenge" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="drought">Drought</SelectItem>
                        <SelectItem value="flood">Flooding</SelectItem>
                        <SelectItem value="heatwave">Heat Waves</SelectItem>
                        <SelectItem value="storm">Storms & Cyclones</SelectItem>
                        <SelectItem value="sealevel">Sea Level Rise</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Other Primary Challenge - Conditional */}
              {form.watch("adaptation.primaryChallenge") === "other" && (
                <FormField
                  control={form.control}
                  name="adaptation.primaryChallengeOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Specify Primary Climate Challenge</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter the primary climate challenge" 
                          className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Secondary Challenges - Checkboxes */}
              <FormField
                control={form.control}
                name="adaptation.secondaryChallenges"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-gray-900 font-medium">Secondary Climate Challenges (Optional)</FormLabel>
                      <FormDescription className="text-gray-600">
                        Select any additional climate challenges your solution addresses.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SECONDARY_CHALLENGES.map((challenge) => (
                        <FormField
                          key={challenge.id}
                          control={form.control}
                          name="adaptation.secondaryChallenges"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={challenge.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(challenge.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, challenge.id])
                                        : field.onChange(
                                            current.filter((value: any) => value !== challenge.id)
                                          );
                                    }}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 cursor-pointer">
                                  {challenge.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Target Beneficiaries Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Users className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Target Beneficiaries</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Target Beneficiaries Description */}
              <FormField
                control={form.control}
                name="adaptation.targetBeneficiaries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Target Beneficiaries</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe who will benefit from your solution" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Describe the communities, demographics, or groups that will benefit from your solution.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Estimated Beneficiaries Count */}
              <FormField
                control={form.control}
                name="adaptation.estimatedBeneficiariesCount"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="text-gray-900 font-medium">Estimated Number of Beneficiaries (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="E.g., 1000"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Approximate number of people who will benefit directly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Technology & Innovation */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Zap className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Technology & Innovation</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Technology Description */}
              <FormField
                control={form.control}
                name="adaptation.technologyDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Technology Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the technology used in your solution" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Innovation Description */}
              <FormField
                control={form.control}
                name="adaptation.innovationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Innovation Approach</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what makes your solution innovative" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain what makes your solution innovative and different from existing approaches.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Implementation & Scaling */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Implementation & Scaling</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Implementation Approach */}
              <FormField
                control={form.control}
                name="adaptation.implementationApproach"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Implementation Approach</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how you implement your solution" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Scaling Strategy */}
              <FormField
                control={form.control}
                name="adaptation.scalingStrategy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Scaling Strategy</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how you plan to scale your solution" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain your strategy for scaling up your solution to reach more beneficiaries.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Measurable Impact */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <BarChart3 className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Measurable Impact</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Measurable Impact Description */}
              <FormField
                control={form.control}
                name="adaptation.measurableImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Measurable Impact</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the measurable impact of your solution"
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Provide specific metrics or data showing your solution's impact (minimum 10 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
} 