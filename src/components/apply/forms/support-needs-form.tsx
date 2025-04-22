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
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
    <div className="space-y-6">
      <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Support Needs</h2>
            <p className="text-muted-foreground mt-1">
          Tell us what support you need to grow your business and climate adaptation solution.
        </p>
      </div>
      
      <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Support Types Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Support Types</h3>
                
                {/* Support Types */}
                <FormField
                  control={form.control}
                  name="support.supportTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="required">Types of Support Needed</FormLabel>
                        <FormDescription>
                          Select all types of support your business needs.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SUPPORT_TYPES.map((type) => (
                          <FormField
                            key={type.id}
                            control={form.control}
                            name="support.supportTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        return checked
                                          ? field.onChange([...current, type.id])
                                          : field.onChange(
                                              current.filter((value) => value !== type.id)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
                        <FormLabel className="required">Specify Other Support Types</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter other support types needed" 
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
              
              {/* Mentorship Needs Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Mentorship & Training</h3>
                
                {/* Mentorship Needs */}
                <FormField
                  control={form.control}
                  name="support.mentorshipNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Mentorship Needs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what kind of mentorship you need" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                        <FormLabel className="required">Preferred Mentor Expertise</FormLabel>
                        <FormDescription>
                          Select the areas of expertise you'd like in a mentor.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {MENTOR_EXPERTISE.map((expertise) => (
                          <FormField
                            key={expertise.id}
                            control={form.control}
                            name="support.preferredMentorExpertise"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={expertise.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(expertise.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        return checked
                                          ? field.onChange([...current, expertise.id])
                                          : field.onChange(
                                              current.filter((value) => value !== expertise.id)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
                      <FormLabel className="required">Training Needs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what training you need for your team" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                      <FormLabel className="required">Preferred Training Format</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-gray-800">
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
              
              {/* Networking Needs Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Networking & Resources</h3>
                
                {/* Networking Needs */}
                <FormField
                  control={form.control}
                  name="support.networkingNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Networking Needs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what networking support you need" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                        <FormLabel className="required">Desired Networking Connections</FormLabel>
                        <FormDescription>
                          Select the types of connections you'd like to make.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {NETWORKING_CONNECTIONS.map((connection) => (
                          <FormField
                            key={connection.id}
                            control={form.control}
                            name="support.desiredNetworkingConnections"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={connection.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(connection.id)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        return checked
                                          ? field.onChange([...current, connection.id])
                                          : field.onChange(
                                              current.filter((value) => value !== connection.id)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
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
                      <FormLabel className="required">Resources Needed</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the resources you need to grow your business" 
                          className="bg-white dark:bg-gray-800 min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Detail the physical, digital, or other resources you need.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Expected Impact Section */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Expected Impact</h3>
                
                {/* Expected Business Impact */}
                <FormField
                  control={form.control}
                  name="support.expectedBusinessImpact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="required">Expected Business Impact</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how this support will impact your business" 
                          className="bg-white dark:bg-gray-800 min-h-[150px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
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
                      <FormLabel className="required">Expected Environmental Impact</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the environmental impact this support will help create" 
                          className="bg-white dark:bg-gray-800 min-h-[150px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Detail how this support will enhance your climate adaptation solution.
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
              Previous: Financial Information
            </Button>
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? "Saving..." : "Next: Review & Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
      </CardContent>
    </Card>
  );
} 