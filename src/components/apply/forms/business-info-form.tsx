/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileIcon, ExternalLinkIcon, XIcon, UploadIcon, Building2, MapPin, Target, TrendingUp, Package, Zap, MessageSquare } from "lucide-react";
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
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name={formFieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-900 font-medium">{label}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={`https://example.com/${label.toLowerCase().replace(/\s+/g, '-')}.pdf`} 
                  {...field} 
                  value={field.value || ""} 
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </FormControl>
              {description && <FormDescription className="text-gray-600">{description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
          {currentUrl ? (
            <div className="border border-green-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileIcon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-800">
                      {getFileName(currentUrl).slice(0, 20)}...
                    </span>
                    <p className="text-xs text-green-600">Document uploaded successfully</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="h-8 w-8 p-0 border-green-200 hover:bg-green-50"
                  >
                    <ExternalLinkIcon className="h-3 w-3 text-green-600" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 transition-colors">
              <div className="p-3 bg-blue-100 rounded-full mx-auto w-fit mb-3">
                <UploadIcon className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm text-blue-700 font-medium mb-1">
                Upload your document
              </p>
              <p className="text-xs text-blue-600">
                Click the button below to upload
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
            className="ut-button:bg-gradient-to-r ut-button:from-green-600 ut-button:to-emerald-600 ut-button:hover:from-green-700 ut-button:hover:to-emerald-700 w-full ut-button:disabled:bg-gray-400 ut-button:shadow-md ut-button:border-0"
            disabled={isUploading}
          />
        </div>
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full mb-4">
          <Building2 className="h-6 w-6" />
          <h2 className="text-xl font-bold">Business Information</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Please provide comprehensive details about your business operations, structure, and impact. This information helps us understand your business better.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Business Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Building2 className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Basic Information</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Business Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your business name" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="business.startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-900 font-medium">Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "h-12 pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
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
                      <FormDescription className="text-gray-600">
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
                      <FormLabel className="text-gray-900 font-medium">Registration Status</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border">
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setShowCertificateUpload(checked);
                            }}
                            className="data-[state=checked]:bg-green-600"
                          />
                          <span className={cn(
                            "text-sm font-medium",
                            field.value ? "text-green-700" : "text-gray-700"
                          )}>
                            {field.value ? "Registered" : "Not Registered"}
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-600">
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
                      <FormLabel className="text-gray-900 font-medium">Registration Certificate URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/my-certificate.pdf" 
                          {...field} 
                          value={field.value || ""}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
                        Provide a link to your registration certificate (Google Drive, Dropbox, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          
          {/* Document Uploads Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <FileIcon className="h-6 w-6" />
                <div>
                  <h3 className="text-xl font-semibold">Business Overview & Compliance Documents</h3>
                  <p className="text-green-100 text-sm mt-1">Upload or provide links for required documents. All uploads are secure and confidential.</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
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
          </div>

          {/* Sector Categorization Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Target className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Sector Categorization</h3>
              </div>
            </div>
            
            <div className="p-6">
              <FormField
                control={form.control}
                name="business.sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Which sector best describes your business?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="food-security" className="py-3">
                          <div>
                            <div className="font-medium">Food Security</div>
                            <div className="text-xs text-gray-500">Ensuring reliable access to sufficient, safe, and nutritious food.</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="infrastructure" className="py-3">
                          <div>
                            <div className="font-medium">Infrastructure</div>
                            <div className="text-xs text-gray-500">Developing and maintaining essential facilities and systems.</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="other" className="py-3">
                          <div>
                            <div className="font-medium">Other</div>
                            <div className="text-xs text-gray-500">Any other sector relevant to your business.</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-600">
                      Select the sector that most closely aligns with your business operations.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Location Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Location</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="business.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Country of Operation</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
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
                      <FormDescription className="text-gray-600">
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
                        <FormLabel className="text-gray-900 font-medium">Specify Country</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter country name" 
                            {...field}
                            value={field.value || ""}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                      <FormLabel className="text-gray-900 font-medium">City/Town</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter city name" 
                          {...field} 
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
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
                    <FormLabel className="text-gray-900 font-medium">Countries Where Registered</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Kenya, Rwanda, Tanzania" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      List all countries where your business is registered to operate (separate with commas)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Business Description Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <MessageSquare className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Business Description</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Business Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your business, its mission, and vision..." 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
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
                    <FormLabel className="text-gray-900 font-medium">Problem Solved</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What problem does your business solve? How does it address a market need?" 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Clearly articulate the problem your business addresses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Business Performance Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <TrendingUp className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Business Performance</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.revenueLastTwoYears"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Revenue (Last Two Years) in USD</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value || ""}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Total revenue generated over the last two years (USD)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-base font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Employment Data
                  </h4>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="business.fullTimeEmployeesTotal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium">Total Full-Time Employees</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="business.fullTimeEmployeesMale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 font-medium">Male (Full-Time)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ""}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
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
                            <FormLabel className="text-gray-900 font-medium">Female (Full-Time)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ""}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                  <h4 className="text-base font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Part-Time Employment
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="business.partTimeEmployeesMale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900 font-medium">Male (Part-Time)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-11"
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
                          <FormLabel className="text-gray-900 font-medium">Female (Part-Time)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                              className="border-gray-300 focus:border-green-500 focus:ring-green-500 h-11"
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
          </div>
          
          {/* Product/Service Information Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Package className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Product/Service Information</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.productServiceDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Product/Service Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your main products or services..." 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Provide details about what you offer to customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="business.unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-medium">Unit Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value || ""}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
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
                      <FormLabel className="text-gray-900 font-medium">Customers (Last 6 Months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || ""}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600">
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
                    <FormLabel className="text-gray-900 font-medium">Production Capacity (Last 6 Months)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 500 units per month, 10 clients per week" 
                        {...field} 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
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
                    <div className="mb-4">
                      <FormLabel className="text-gray-900 font-medium">Target Customer Segments</FormLabel>
                      <FormDescription className="text-gray-600">
                        Select all customer segments that apply to your business
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {customerSegmentOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="business.customerSegments"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
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
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 cursor-pointer">
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
          </div>
          
          {/* Climate Adaptation Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <Zap className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Climate Impact</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.climateAdaptationContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Climate Adaptation Contribution</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How does your business contribute to climate adaptation?" 
                        className="min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
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
                    <FormLabel className="text-gray-900 font-medium">Impact on Climate Extremes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="How does your business address extreme climate events?" 
                        className="min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Describe how your business helps mitigate the impact of climate extremes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Challenges & Support Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-green-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <MessageSquare className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Challenges & Support</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="business.currentChallenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">Current Challenges</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What challenges is your business currently facing?" 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
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
                    <FormLabel className="text-gray-900 font-medium">Support Needed</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What support do you need to overcome these challenges?" 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
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
                    <FormLabel className="text-gray-900 font-medium">Additional Information (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any other information you would like to share..." 
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600">
                      Add any information not covered by the questions above
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Desktop Navigation Buttons - REMOVED: Using unified navigation for all screen sizes */}
        </form>
      </Form>
    </div>
  );
} 