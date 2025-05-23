/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileIcon, ExternalLinkIcon, XIcon, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { UploadButton } from "@/utils/uploadthing";

const customerSegmentOptions = [
  { id: "household_individuals", label: "Household Individuals" },
  { id: "micro_small_medium_enterprises", label: "Micro, Small & Medium Enterprises" },
  { id: "institutions", label: "Institutions" },
  { id: "corporates", label: "Corporates" },
  { id: "government_and_ngos", label: "Government & NGOs" },
];

type BusinessInfoFormProps = {
  form: any;
  onNext: () => void;
  onPrevious: () => void;
};

// Enhanced Document Upload Component
interface DocumentUploadProps {
  endpoint: string;
  formFieldName: string;
  label: string;
  description?: string;
  currentUrl?: string;
  form: any;
}

function DocumentUpload({ 
  endpoint, 
  formFieldName, 
  label, 
  description, 
  currentUrl, 
  form 
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    if (res && res[0]?.url) {
      form.setValue(formFieldName, res[0].url);
      toast.success(`${label} uploaded successfully!`, { id: `upload-${formFieldName}` });
    }
  };

  const handleUploadError = (error: Error) => {
    setIsUploading(false);
    console.error("Upload error:", error);
    toast.error(`Failed to upload ${label}. Please try again.`, { id: `upload-${formFieldName}` });
  };

  const handleDelete = () => {
    form.setValue(formFieldName, "");
    toast.success(`${label} removed successfully.`);
  };

  const getFileName = (url: string) => {
    try {
      const urlParts = url.split('/');
      return decodeURIComponent(urlParts[urlParts.length - 1]);
    } catch {
      return 'Document';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={formFieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input 
                placeholder={`https://example.com/${label.toLowerCase().replace(/\s+/g, '-')}.pdf`} 
                {...field} 
                value={field.value || ""} 
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-3">
        {currentUrl ? (
          <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  {getFileName(currentUrl).slice(0, 12)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentUrl, '_blank')}
                  className="h-8 w-8 p-0"
                >
                  <ExternalLinkIcon className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-1">Document uploaded successfully</p>
          </div>
        ) : (
          <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900/50">
            <UploadIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Click on the choose file to upload 👇
            </p>
          </div>
        )}
        
        <UploadButton
          endpoint={endpoint as any}
          onBeforeUploadBegin={(files) => {
            setIsUploading(true);
            toast.loading(`Uploading ${label}...`, { id: `upload-${formFieldName}` });
            return files;
          }}
          onClientUploadComplete={handleUploadComplete}
          onUploadError={handleUploadError}
          className="ut-button:bg-teal-700 ut-button:ut-ready:bg-teal-700/50 w-full ut-button:disabled:bg-gray-400"
          disabled={isUploading}
        />
      </div>
    </div>
  );
}

export function BusinessInfoForm({ form, onNext, onPrevious }: BusinessInfoFormProps) {
  const [showCertificateUpload, setShowCertificateUpload] = useState(false);
  
  const handleSubmit = async (data: any) => {
    console.log("Business Info Data:", data);
    toast.success("Business information saved successfully!");
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
        <p className="mt-1 text-base text-gray-600">
          Please provide details about your business operations and structure.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Business Information Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
            
            <FormField
              control={form.control}
              name="business.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your business name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business.startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When did your business start operations?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="business.isRegistered"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Registration Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setShowCertificateUpload(checked);
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          {field.value ? "Registered" : "Not Registered"}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Is your business legally registered to operate?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {showCertificateUpload && (
              <FormField
                control={form.control}
                name="business.registrationCertificateUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Certificate URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/my-certificate.pdf" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a link to your registration certificate (Google Drive, Dropbox, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          
          {/* Document Uploads Section */}
          <div className="space-y-6 pt-4 border-t border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Business Overview & Compliance Documents</h3>
              <p className="text-gray-600 mt-1">Upload or provide a link for each required document. All uploads are secure and confidential.</p>
            </div>
            
            {/* Business Overview */}
            <DocumentUpload
              endpoint="businessOverviewUploader"
              formFieldName="business.businessOverviewUrl"
              label="Business Overview (PDF or DOCX)"
              description="Provide a link or upload below."
              currentUrl={form.watch("business.businessOverviewUrl")}
              form={form}
            />
            
            {/* CR12 */}
            <DocumentUpload
              endpoint="cr12Uploader"
              formFieldName="business.cr12Url"
              label="CR12 Document"
              description="Provide a link or upload below."
              currentUrl={form.watch("business.cr12Url")}
              form={form}
            />
            
            {/* Audited Accounts */}
            <DocumentUpload
              endpoint="auditedAccountsUploader"
              formFieldName="business.auditedAccountsUrl"
              label="Last 2 Years' Audited Accounts"
              description="Provide a link or upload below."
              currentUrl={form.watch("business.auditedAccountsUrl")}
              form={form}
            />
            
            {/* Tax Compliance Certificate */}
            <DocumentUpload
              endpoint="taxComplianceUploader"
              formFieldName="business.taxComplianceUrl"
              label="Tax Compliance Certificate"
              description="Provide a link or upload below."
              currentUrl={form.watch("business.taxComplianceUrl")}
              form={form}
            />
          </div>

          {/* Sector Categorization Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Sector Categorization</h3>
            <FormField
              control={form.control}
              name="business.sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Which sector best describes your business?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="food-security">
                        Food Security
                        <span className="block text-xs text-gray-500">Ensuring reliable access to sufficient, safe, and nutritious food.</span>
                      </SelectItem>
                      <SelectItem value="infrastructure">
                        Infrastructure
                        <span className="block text-xs text-gray-500">Developing and maintaining essential facilities and systems.</span>
                      </SelectItem>
                      <SelectItem value="other">
                        Other
                        <span className="block text-xs text-gray-500">Any other sector relevant to your business.</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the sector that most closely aligns with your business. Hover for descriptions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Location Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Location</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Operation</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
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
                    <FormDescription>
                      Primary country where your business operates
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("business.country") === "other" && (
                <FormField
                  control={form.control}
                  name="business.countryOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specify Country</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter country name" 
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="business.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City/Town</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="business.registeredCountries"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Countries Where Registered</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Kenya, Rwanda, Tanzania" {...field} />
                  </FormControl>
                  <FormDescription>
                    List all countries where your business is registered to operate (separate with commas)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Business Description Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Business Description</h3>
            
            <FormField
              control={form.control}
              name="business.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business, its mission, and vision..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a comprehensive description of your business
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business.problemSolved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Solved</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What problem does your business solve? How does it address a market need?" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Clearly articulate the problem your business addresses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Business Performance Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Business Performance</h3>
            
            <FormField
              control={form.control}
              name="business.revenueLastTwoYears"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Revenue (Last Two Years) in USD</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Total revenue generated over the last two years (USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-base font-medium text-gray-700 mb-2">Employment Data</h4>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="business.fullTimeEmployeesTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Full-Time Employees</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="business.fullTimeEmployeesMale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Male (Full-Time)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="business.fullTimeEmployeesFemale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Female (Full-Time)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-base font-medium text-gray-700 mb-2">Part-Time Employment</h4>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="business.partTimeEmployeesMale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Male (Part-Time)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="business.partTimeEmployeesFemale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Female (Part-Time)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Product/Service Information Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Product/Service Information</h3>
            
            <FormField
              control={form.control}
              name="business.productServiceDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product/Service Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your main products or services..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about what you offer to customers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="business.unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price (USD)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Average unit price of your product/service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="business.customerCountLastSixMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customers (Last 6 Months)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of customers served in the last 6 months
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="business.productionCapacityLastSixMonths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Production Capacity (Last 6 Months)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 500 units per month, 10 clients per week" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe your production or service delivery capacity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business.customerSegments"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Target Customer Segments</FormLabel>
                    <FormDescription>
                      Select all customer segments that apply to your business
                    </FormDescription>
                  </div>
                  <div className="space-y-2">
                    {customerSegmentOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="business.customerSegments"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...(field.value || []), option.id]
                                      : field.value?.filter(
                                          (value: string) => value !== option.id
                                        );
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
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
          
          {/* Climate Adaptation Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Climate Impact</h3>
            
            <FormField
              control={form.control}
              name="business.climateAdaptationContribution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Climate Adaptation Contribution</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How does your business contribute to climate adaptation?" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Explain how your business helps communities adapt to climate change
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business.climateExtremeImpact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Impact on Climate Extremes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How does your business address extreme climate events?" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe how your business helps mitigate the impact of climate extremes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Challenges & Support Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800">Challenges & Support</h3>
            
            <FormField
              control={form.control}
              name="business.currentChallenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Challenges</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What challenges is your business currently facing?" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the major challenges affecting your business growth
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business.supportNeeded"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Needed</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="What support do you need to overcome these challenges?" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Specify the types of support that would help your business grow
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="business.additionalInformation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any other information you would like to share..." 
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any information not covered by the questions above
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
              className="bg-white hover:bg-gray-50"
            >
              Previous: Personal Information
            </Button>
            <Button 
              type="submit"
              className="bg-teal-700 hover:bg-teal-800 text-white"
            >
              Next: Climate Adaptation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 