"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

// Secondary climate challenges options - Updated with YouthADAPT specific needs
const SECONDARY_CHALLENGES = [
  { id: "drought_water_scarcity", label: "Drought and Water Scarcity", description: "Resilient irrigation systems, water harvesting techniques, efficient water management" },
  { id: "heat_stress_rising_temperatures", label: "Heat Stress and Rising Temperatures", description: "Heat-resilient infrastructure, reflective pavements, passive cooling innovations" },
  { id: "flooding_stormwater", label: "Flooding and Stormwater Management", description: "Smart flood response systems, green infrastructure, permeable pavements" },
  { id: "post_harvest_losses", label: "Post-Harvest Losses", description: "Solar-powered cold storage, hermetic storage bags, resilient market chains" },
  { id: "livestock_crop_resilience", label: "Livestock and Crop Resilience", description: "Heat- and disease-tolerant breeds, sustainable rangeland practices, CSA" },
  { id: "climate_information_access", label: "Climate Information Access", description: "Mobile advisory platforms, localized weather alerts, community-based resource hubs" },
  { id: "inclusive_adaptation", label: "Inclusive Adaptation", description: "Gender-responsive approaches ensuring women and youth access inputs, training, financing" },
];

// Props type
type ClimateAdaptationFormProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrevious: () => void;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ClimateAdaptationForm({ form, onNext, onPrevious }: ClimateAdaptationFormProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                      <SelectContent className="max-h-80 overflow-y-auto">
                        {/* Core YouthADAPT Adaptation Needs */}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Core YouthADAPT Adaptation Needs
                        </div>
                        <SelectItem value="drought_water_scarcity">Drought and Water Scarcity</SelectItem>
                        <SelectItem value="heat_stress_rising_temperatures">Heat Stress and Rising Temperatures</SelectItem>
                        <SelectItem value="flooding_stormwater">Flooding and Stormwater Management</SelectItem>
                        <SelectItem value="post_harvest_losses">Post-Harvest Losses</SelectItem>
                        <SelectItem value="livestock_crop_resilience">Livestock and Crop Resilience</SelectItem>
                        <SelectItem value="climate_information_access">Climate Information Access</SelectItem>
                        <SelectItem value="inclusive_adaptation">Inclusive Adaptation</SelectItem>
                        
                        <div className="border-t my-2"></div>
                        
                        {/* Additional Climate Risks & Hazards */}
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Additional Climate Risks & Hazards
                        </div>
                        <SelectItem value="extreme_weather_events">Extreme Weather Events</SelectItem>
                        <SelectItem value="sea_level_rise_coastal_erosion">Sea Level Rise & Coastal Erosion</SelectItem>
                        <SelectItem value="desertification_land_degradation">Desertification & Land Degradation</SelectItem>
                        <SelectItem value="biodiversity_ecosystem_loss">Biodiversity & Ecosystem Loss</SelectItem>
                        <SelectItem value="vector_borne_diseases">Vector-Borne Diseases</SelectItem>
                        <SelectItem value="food_insecurity_malnutrition">Food Insecurity & Malnutrition</SelectItem>
                        <SelectItem value="water_quality_contamination">Water Quality & Contamination</SelectItem>
                        <SelectItem value="infrastructure_vulnerability">Infrastructure Vulnerability</SelectItem>
                        <SelectItem value="energy_security_access">Energy Security & Access</SelectItem>
                        <SelectItem value="migration_displacement">Migration & Displacement</SelectItem>
                        <SelectItem value="economic_climate_impacts">Economic Climate Impacts</SelectItem>
                        <SelectItem value="agricultural_productivity_decline">Agricultural Productivity Decline</SelectItem>
                        <SelectItem value="urban_heat_island_effects">Urban Heat Island Effects</SelectItem>
                        <SelectItem value="wildfire_risk_management">Wildfire Risk Management</SelectItem>
                        <SelectItem value="climate_induced_conflicts">Climate-Induced Conflicts</SelectItem>
                        
                        <div className="border-t my-2"></div>
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
                    <div className="grid grid-cols-1 gap-4">
                      {SECONDARY_CHALLENGES.map((challenge) => (
                        <FormField
                          key={challenge.id}
                          control={form.control}
                          name="adaptation.secondaryChallenges"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={challenge.id}
                                className="flex flex-row items-start space-x-4 space-y-0 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(challenge.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, challenge.id])
                                        : field.onChange(
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            current.filter((value: any) => value !== challenge.id)
                                          );
                                    }}
                                    className="scale-125 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-blue-700 mt-1"
                                  />
                                </FormControl>
                                <div className="flex-1 cursor-pointer">
                                  <FormLabel className="font-medium text-gray-900 cursor-pointer block mb-1">
                                    {challenge.label}
                                  </FormLabel>
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {challenge.description}
                                  </p>
                                </div>
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
                      Provide specific metrics or data showing your solution&apos;s impact (minimum 10 characters)
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