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
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
    <div className="space-y-6">
      <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Climate Adaptation Solution</h2>
            <p className="text-muted-foreground mt-1">
          Describe your climate adaptation solution and its impact.
        </p>
      </div>
      
      <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Solution Details Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Solution Details</h3>
                
                {/* Solution Title */}
                <FormField
                  control={form.control}
                  name="adaptation.solutionTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Solution Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter the title of your climate solution" 
                          className="bg-white dark:bg-gray-800" 
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
                      <FormLabel className="required">Solution Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of your climate adaptation solution" 
                          className="bg-white dark:bg-gray-800 min-h-[150px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what your solution does, how it works, and the specific climate challenges it addresses.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Primary Climate Challenge Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Climate Challenges</h3>
                
                {/* Primary Challenge */}
                <FormField
                  control={form.control}
                  name="adaptation.primaryChallenge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Primary Climate Challenge</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-800">
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
                        <FormLabel className="required">Specify Primary Climate Challenge</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the primary climate challenge" 
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
                
                {/* Secondary Challenges - Checkboxes */}
                <FormField
                  control={form.control}
                  name="adaptation.secondaryChallenges"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Secondary Climate Challenges (Optional)</FormLabel>
                        <FormDescription>
                          Select any additional climate challenges your solution addresses.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SECONDARY_CHALLENGES.map((challenge) => (
                          <FormField
                            key={challenge.id}
                            control={form.control}
                            name="adaptation.secondaryChallenges"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={challenge.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
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
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
              
              {/* Target Beneficiaries Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Target Beneficiaries</h3>
                
                {/* Target Beneficiaries Description */}
                <FormField
                  control={form.control}
                  name="adaptation.targetBeneficiaries"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Target Beneficiaries</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe who will benefit from your solution" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                      <FormLabel>Estimated Number of Beneficiaries (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          className="bg-white dark:bg-gray-800"
                          placeholder="E.g., 1000"
                          {...field}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value, 10);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Approximate number of people who will benefit directly.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Technology & Innovation */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Technology & Innovation</h3>
                
                {/* Technology Description */}
                <FormField
                  control={form.control}
                  name="adaptation.technologyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Technology Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the technology used in your solution" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
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
                      <FormLabel className="required">Innovation Approach</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what makes your solution innovative" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what makes your solution innovative and different from existing approaches.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Implementation & Scaling */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Implementation & Scaling</h3>
                
                {/* Implementation Approach */}
                <FormField
                  control={form.control}
                  name="adaptation.implementationApproach"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Implementation Approach</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how you implement your solution" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
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
                      <FormLabel className="required">Scaling Strategy</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how you plan to scale your solution" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain your strategy for scaling up your solution to reach more beneficiaries.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Measurable Impact */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Measurable Impact</h3>
                
                {/* Measurable Impact Description */}
                <FormField
                  control={form.control}
                  name="adaptation.measurableImpact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Measurable Impact</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the measurable impact of your solution"
                          className="bg-white dark:bg-gray-800 min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide specific metrics or data showing your solution&apos;s impact (minimum 10 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </div>
          
              {/* Navigation Buttons */}
          <div className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onPrevious}
                  className="w-full md:w-auto"
                >
              Previous: Business Information
            </Button>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? "Saving..." : "Next: Financial Information"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
      </CardContent>
    </Card>
  );
} 