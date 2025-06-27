/* eslint-disable @typescript-eslint/no-explicit-any */
  "use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { financialInfoSchema } from "../schemas/financial-info-schema";
import { DollarSign, TrendingUp, Banknote, Target, BarChart3, Leaf } from "lucide-react";

// Define form value types

// Funding sources options
const FUNDING_SOURCES = [
  { id: "personal", label: "Personal Savings/Investments" },
  { id: "family", label: "Family & Friends" },
  { id: "bank", label: "Bank Loan" },
  { id: "venture", label: "Venture Capital" },
  { id: "angel", label: "Angel Investors" },
  { id: "grant", label: "Grant Funding" },
  { id: "government", label: "Government Support" },
  { id: "crowdfunding", label: "Crowdfunding" },
];

// Props type
type FinancialInfoFormProps = {
  form: UseFormReturn<any>;
  onNext: () => void;
  onPrevious: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FinancialInfoForm({ form, onNext, onPrevious }: FinancialInfoFormProps) {
  
  const handleSubmit = async (data: any) => {
    try {
      // Validate the form data against the schema
      financialInfoSchema.parse(data);
      console.log("Financial Info Data:", data.financial);
    onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Please fill all required fields correctly.");
        // Trigger validation to show errors
        form.trigger("financial");
      }
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full mb-4">
          <DollarSign className="h-6 w-6" />
          <h2 className="text-xl font-bold">Financial Information</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Provide details about your business finances, funding history, and future financial plans.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Current Financial Status Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Current Financial Status</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Annual Revenue */}
              <FormField
                control={form.control}
                name="financial.annualRevenue"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="text-gray-900 font-medium">Annual Revenue (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="100"
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="E.g., 10000"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? null : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Your company&apos;s annual revenue in USD (if applicable).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Revenue Growth Rate */}
              <FormField
                control={form.control}
                name="financial.revenueGrowthRate"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="text-gray-900 font-medium">Revenue Growth Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="-100"
                        max="1000"
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="E.g., 20"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? null : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Your annual revenue growth rate as a percentage.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Profit Margin */}
              <FormField
                control={form.control}
                name="financial.profitMargin"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="text-gray-900 font-medium">Profit Margin (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="-100"
                        max="100"
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="E.g., 15"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = e.target.value === "" ? null : parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Previous Funding Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Banknote className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Previous Funding</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Has Previous Funding */}
              <FormField
                control={form.control}
                name="financial.previousFunding"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-gray-900 font-medium">Have you received any funding before?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value ? "true" : "false"}
                        className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-8"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                          <FormControl>
                            <RadioGroupItem 
                              value="true" 
                              className="scale-125 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-blue-700"
                            />
                          </FormControl>
                          <FormLabel className="font-medium text-gray-900 cursor-pointer">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer">
                          <FormControl>
                            <RadioGroupItem 
                              value="false" 
                              className="scale-125 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-blue-700"
                            />
                          </FormControl>
                          <FormLabel className="font-medium text-gray-900 cursor-pointer">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Previous Funding Sources - Conditional */}
              {form.watch("financial.previousFunding") && (
                <>
                  <FormField
                    control={form.control}
                    name="financial.previousFundingSources"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-gray-900 font-medium">Funding Sources</FormLabel>
                          <FormDescription className="text-gray-600">
                            Select all sources of previous funding.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {FUNDING_SOURCES.map((source) => (
                            <FormField
                              key={source.id}
                              control={form.control}
                              name="financial.previousFundingSources"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={source.id}
                                    className="flex flex-row items-start space-x-4 space-y-0 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(source.id)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          return checked
                                            ? field.onChange([...current, source.id])
                                            : field.onChange(
                                                current.filter((value: any) => value !== source.id)
                                              );
                                        }}
                                        className="scale-125 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-blue-700"
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-gray-900 cursor-pointer">
                                      {source.label}
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
                  
                  <FormField
                    control={form.control}
                    name="financial.previousFundingAmount"
                    render={({ field }) => (
                      <FormItem className="max-w-xs">
                        <FormLabel className="text-gray-900 font-medium">Total Previous Funding (USD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="100"
                            className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="E.g., 50000"
                            {...field}
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : parseFloat(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormDescription className="text-gray-600">
                          Total amount of funding received so far.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          </div>
          
          {/* Funding Request Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Target className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Funding Request</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Requested Funding Amount */}
              <FormField
                control={form.control}
                name="financial.requestedFundingAmount"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel className="text-gray-900 font-medium">Requested Funding Amount (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1000"
                        max="100000"
                        step="100"
                        className="h-12 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="E.g., 25000"
                        {...field}
                        value={field.value === null ? "" : field.value}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Amount must be between $1,000 and $100,000 USD.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Funding Use */}
              <FormField
                control={form.control}
                name="financial.fundingUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Use of Funds</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe how you plan to use the funding" 
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Provide a detailed breakdown of how you will allocate the funds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Business Model Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <BarChart3 className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Business Model</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Revenue Model */}
              <FormField
                control={form.control}
                name="financial.revenueModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Revenue Model</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your revenue model" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain how your business generates or will generate revenue.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Cost Structure */}
              <FormField
                control={form.control}
                name="financial.costStructure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Cost Structure</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your cost structure" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Outline your main costs and expenses.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Sustainability Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Leaf className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Path to Sustainability</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Path to Sustainability */}
              <FormField
                control={form.control}
                name="financial.pathToSustainability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Path to Financial Sustainability</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your plan for achieving financial sustainability" 
                        className="min-h-[150px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Explain your strategy for achieving long-term financial sustainability.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Financial Challenges */}
              <FormField
                control={form.control}
                name="financial.financialChallenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Financial Challenges</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your current financial challenges" 
                        className="min-h-[100px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none" 
                        {...field}
                      />
                    </FormControl>
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