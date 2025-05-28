/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportNeedsSchema } from "../schemas/support-needs-schema";
import { HandHeart, Settings, Users, Network, Target } from "lucide-react";

// Define form value types
type SupportNeedsFormValues = z.infer<typeof supportNeedsSchema>;

// Support Types
const SUPPORT_TYPES = [
  { id: "funding", label: "Funding & Investment" },
  { id: "mentorship", label: "Mentorship & Coaching" },
  { id: "networking", label: "Networking & Connections" },
  { id: "technical", label: "Technical Assistance" },
  { id: "training", label: "Training & Workshops" },
  { id: "marketing", label: "Marketing & Visibility" },
  { id: "space", label: "Office/Workspace" },
  { id: "legal", label: "Legal & Regulatory Support" },
];

// Mentor Expertise
const MENTOR_EXPERTISE = [
  { id: "business", label: "Business Strategy" },
  { id: "finance", label: "Financial Management" },
  { id: "tech", label: "Technology & Innovation" },
  { id: "climate", label: "Climate Science" },
  { id: "social", label: "Social Impact" },
  { id: "marketing", label: "Marketing & Sales" },
  { id: "operations", label: "Operations & Logistics" },
  { id: "legal", label: "Legal & Compliance" },
];

// Networking Connections
const NETWORKING_CONNECTIONS = [
  { id: "investors", label: "Investors & Funders" },
  { id: "partners", label: "Business Partners" },
  { id: "suppliers", label: "Suppliers & Vendors" },
  { id: "customers", label: "Customers & End Users" },
  { id: "experts", label: "Industry Experts" },
  { id: "government", label: "Government Officials" },
  { id: "ngo", label: "NGOs & Development Organizations" },
  { id: "research", label: "Research Institutions" },
];

// Props type
type SupportNeedsFormProps = {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrevious: () => void;
};

export function SupportNeedsForm({ form, onNext, onPrevious }: SupportNeedsFormProps) {
  const { formState } = form;
  
  const handleSubmit = async (data: any) => {
    try {
      // Validate the form data against the schema
      supportNeedsSchema.parse(data);
      console.log("Support Needs Data:", data.support);
    onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Please fill all required fields correctly.");
        // Trigger validation to show errors
        form.trigger("support");
      }
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full mb-4">
          <HandHeart className="h-6 w-6" />
          <h2 className="text-xl font-bold">Support Needs</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Tell us what support you need to grow your business and enhance your climate adaptation solution.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Support Types Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Settings className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Support Types</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Support Types */}
              <FormField
                control={form.control}
                name="support.supportTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-gray-900 font-medium">Types of Support Needed</FormLabel>
                      <FormDescription className="text-gray-600">
                        Select all types of support your business needs.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {SUPPORT_TYPES.map((type) => (
                        <FormField
                          key={type.id}
                          control={form.control}
                          name="support.supportTypes"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={type.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(type.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, type.id])
                                        : field.onChange(
                                            current.filter((value: any) => value !== type.id)
                                          );
                                    }}
                                    className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 cursor-pointer">
                                  {type.label}
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
              
              {/* Other Support Types - Conditional */}
              {form.watch("support.supportTypes")?.includes("other") && (
                <FormField
                  control={form.control}
                  name="support.supportTypesOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Specify Other Support Types</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter other support types needed" 
                          className="h-12 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"
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
          </div>
          
          {/* Mentorship Needs Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Users className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Mentorship & Training</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Mentorship Needs */}
              <FormField
                control={form.control}
                name="support.mentorshipNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Mentorship Needs</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what kind of mentorship you need" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain the areas where you need mentorship and guidance.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Preferred Mentor Expertise */}
              <FormField
                control={form.control}
                name="support.preferredMentorExpertise"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-gray-900 font-medium">Preferred Mentor Expertise</FormLabel>
                      <FormDescription className="text-gray-600">
                        Select the areas of expertise you'd like in a mentor.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {MENTOR_EXPERTISE.map((expertise) => (
                        <FormField
                          key={expertise.id}
                          control={form.control}
                          name="support.preferredMentorExpertise"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={expertise.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(expertise.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, expertise.id])
                                        : field.onChange(
                                            current.filter((value: any) => value !== expertise.id)
                                          );
                                    }}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 cursor-pointer">
                                  {expertise.label}
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
              
              {/* Training Needs */}
              <FormField
                control={form.control}
                name="support.trainingNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Training Needs</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what training you need for your team" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Detail the training your team needs to grow your business.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Preferred Training Format */}
              <FormField
                control={form.control}
                name="support.preferredTrainingFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Preferred Training Format</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select preferred training format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inPerson">In-Person</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Networking Needs Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Network className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Networking & Resources</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Networking Needs */}
              <FormField
                control={form.control}
                name="support.networkingNeeds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Networking Needs</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what networking support you need" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain the networking opportunities that would benefit your business.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Desired Networking Connections */}
              <FormField
                control={form.control}
                name="support.desiredNetworkingConnections"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-gray-900 font-medium">Desired Networking Connections</FormLabel>
                      <FormDescription className="text-gray-600">
                        Select the types of connections you'd like to make.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {NETWORKING_CONNECTIONS.map((connection) => (
                        <FormField
                          key={connection.id}
                          control={form.control}
                          name="support.desiredNetworkingConnections"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={connection.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(connection.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      return checked
                                        ? field.onChange([...current, connection.id])
                                        : field.onChange(
                                            current.filter((value: any) => value !== connection.id)
                                          );
                                    }}
                                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 cursor-pointer">
                                  {connection.label}
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
              
              {/* Resources Needed */}
              <FormField
                control={form.control}
                name="support.resourcesNeeded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Resources Needed</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the resources you need to grow your business" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Detail the physical, digital, or other resources you need.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Expected Impact Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Target className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Expected Impact</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Expected Business Impact */}
              <FormField
                control={form.control}
                name="support.expectedBusinessImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Expected Business Impact</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how this support will impact your business" 
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain how the requested support will help your business grow.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Expected Environmental Impact */}
              <FormField
                control={form.control}
                name="support.expectedEnvironmentalImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Expected Environmental Impact</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the environmental impact this support will help create" 
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Detail how this support will enhance your climate adaptation solution.
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