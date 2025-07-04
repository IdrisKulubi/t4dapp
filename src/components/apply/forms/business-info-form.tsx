/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
  { id: "other", label: "Other" },
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
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const getCleanFileName = (url: string): string => {
    if (!url) return 'Document';
    // If it's a utfs.io URL, we can't get the original filename.
    // Show a user-friendly generic name.
    if (url.includes('utfs.io')) {
      return 'Uploaded Document';
    }
    // For other URLs, try to get the last part.
    try {
      const urlParts = url.split('/');
      const decoded = decodeURIComponent(urlParts[urlParts.length - 1]);
      // Truncate if it's too long
      if (decoded.length > 40) {
        return `${decoded.substring(0, 25)}...`;
      }
      return decoded || 'Document';
    } catch {
      return 'Document';
    }
  };
  
  useEffect(() => {
    if (currentUrl) {
      setFileName(getCleanFileName(currentUrl));
    }
  }, [currentUrl]);

  const handleUploadComplete = (res: any) => {
    setIsUploading(false);
    if (res && res[0]) {
      const file = res[0];
      form.setValue(formFieldName, file.url);
      setFileName(file.name);
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
    setFileName(null);
    toast.success(`${label} removed successfully.`);
  };

 

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-6">
      {/* Document Label & Description */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-900">{label}</h4>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* URL Input Section */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name={formFieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Document URL (Optional)
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={`https://drive.google.com/file/d/...`} 
                    {...field} 
                    value={field.value || ""} 
                    className="h-11 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500">
                  Paste a link from Google Drive, Dropbox, or any cloud storage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Upload Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">
            Upload Document
          </label>
          
          {currentUrl ? (
            /* Success State */
            <div className="relative group">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-xl transition-all duration-200 hover:shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-emerald-900 truncate" title={fileName || ""}>
                      {fileName || getCleanFileName(currentUrl || "")}
                    </p>
                    <p className="text-xs text-emerald-600">
                      ✓ Successfully uploaded
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(currentUrl, '_blank')}
                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                  >
                    <ExternalLinkIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Upload Area */
            <div className="relative">
              <UploadButton
                endpoint={endpoint as any}
                onBeforeUploadBegin={(files) => {
                  setIsUploading(true);
                  toast.loading(`Uploading ${label}...`, { id: `upload-${formFieldName}` });
                  return files;
                }}
                onClientUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
                className="w-full ut-button:w-full ut-button:h-auto ut-button:bg-transparent ut-button:border-0 ut-button:p-0 ut-button:shadow-none ut-button:ring-0 ut-button:focus:ring-0 ut-button:focus-visible:ring-0 ut-button:hover:bg-transparent ut-allowed-content:hidden ut-label:hidden"
                content={{
                  button({ ready, isUploading: uploading }) {
                    if (uploading) {
                      return (
                        <div className="relative overflow-hidden">
                          <div className="flex flex-col items-center justify-center p-8 border-2 border-blue-300 border-dashed rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50">
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                  <UploadIcon className="w-6 h-6 text-blue-600 animate-bounce" />
                                </div>
                                <div className="absolute inset-0 w-12 h-12 border-2 border-blue-300 rounded-full animate-ping"></div>
                              </div>
                              <div className="text-center space-y-1">
                                <p className="text-base font-semibold text-blue-900">
                                  Uploading your document...
                                </p>
                                <p className="text-sm text-blue-700">
                                  Please wait while we securely process your file
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    if (ready) {
                      return (
                        <div
                          className={cn(
                            'group relative cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all duration-300',
                            isDragOver
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50'
                          )}
                           onDragOver={handleDragOver}
                           onDragLeave={handleDragLeave}
                           onDrop={handleDrop}
                        >
                          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                            <div
                              className={cn(
                                'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 transition-all duration-300',
                                isDragOver ? 'bg-blue-100' : 'group-hover:bg-blue-100'
                              )}
                            >
                              <UploadIcon
                                className={cn(
                                  'h-7 w-7 text-gray-500 transition-all duration-300',
                                  isDragOver ? 'text-blue-600' : 'group-hover:text-blue-500'
                                )}
                              />
                            </div>
                            <div className="sm:text-left">
                              <p
                                className={cn(
                                  'text-base font-semibold transition-colors duration-300',
                                  isDragOver ? 'text-blue-800' : 'text-gray-800 group-hover:text-blue-700'
                                )}
                              >
                                Click to upload or drag and drop
                              </p>
                              <p
                                className={cn(
                                  'mt-0.5 text-sm transition-colors duration-300',
                                  isDragOver ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                                )}
                              >
                                PDF, DOC, or DOCX (max. 8MB)
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                            <UploadIcon className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-gray-600">
                              Preparing upload...
                            </p>
                            <p className="text-xs text-gray-500">
                              Please wait a moment
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                }}
                disabled={isUploading}
              />
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX • Maximum size: 8MB
          </p>
        </div>
      </div>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BusinessInfoForm({ form, onNext, onPrevious }: BusinessInfoFormProps) {
  const [showCertificateUpload, setShowCertificateUpload] = useState(false);
  const [startDateInput, setStartDateInput] = useState("");

  // Initialize startDateInput with existing value
  useEffect(() => {
    const currentValue = form.getValues("business.startDate");
    if (currentValue) {
      setStartDateInput(format(currentValue, "yyyy-MM-dd"));
    }
  }, [form]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = async (data: any) => {
    toast.success("Business information saved successfully!");
    onNext();
  };
  
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center lg:text-left">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full mb-4">
          <Building2 className="h-6 w-6" />
          <h2 className="text-xl font-bold">Business Information</h2>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Please provide comprehensive details about your business operations, structure, and impact for the InCountry YouthAdapt Challenge 2025.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Business Information Section */}
          <div className=" rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
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
                        className="border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 bg-white"
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
                  render={({ field }) => {
                    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setStartDateInput(value);
                      if (value) {
                        field.onChange(new Date(value));
                      } else {
                        field.onChange(undefined);
                      }
                    };

                    return (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-gray-900 font-medium">Start Date *</FormLabel>
                        <div className="relative">
                          <Input
                            type="date"
                            value={startDateInput}
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
                                    setStartDateInput(format(date, "yyyy-MM-dd"));
                                  }
                                }}
                                disabled={(date) => date > new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormDescription className="text-gray-600">
                          When did your business start operations? Format: DD/MM/YYYY
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                
                <FormField
                  control={form.control}
                  name="business.isRegistered"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-gray-900 font-medium">Registration Status</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md">
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setShowCertificateUpload(checked);
                            }}
                            className="scale-125 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400 data-[state=checked]:hover:bg-green-700 data-[state=unchecked]:hover:bg-gray-500 shadow-lg border-2 data-[state=checked]:border-green-600 data-[state=unchecked]:border-gray-400"
                          />
                          <span className={cn(
                            "text-sm font-medium",
                            field.value ? "text-green-700" : "text-gray-600"
                          )}>
                            {field.value ? "Registered" : "Not Registered"}
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription className="text-gray-900">
                        Is your business legally registered to operate?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {showCertificateUpload && (
                <DocumentUpload
                  endpoint="registrationCertificateUploader"
                  formFieldName="business.registrationCertificateUrl"
                  label="Registration Certificate"
                  description="Upload your business registration certificate (e.g., Certificate of Incorporation)."
                  currentUrl={form.watch("business.registrationCertificateUrl")}
                  form={form}
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
            
            <div className="p-8 space-y-12">
              {/* Business Overview */}
              <DocumentUpload
                endpoint="businessOverviewUploader"
                formFieldName="business.businessOverviewUrl"
                label="Business Overview (PDF or DOCX)"
                description="A comprehensive overview of your business operations, mission, and vision."
                currentUrl={form.watch("business.businessOverviewUrl")}
                form={form}
              />
              
              {/* CR12 */}
              <DocumentUpload
                endpoint="cr12Uploader"
                formFieldName="business.cr12Url"
                label="CR12 Document"
                description="Certificate of Registration (CR12) or equivalent business registration document."
                currentUrl={form.watch("business.cr12Url")}
                form={form}
              />
              
              {/* Audited Accounts */}
              <DocumentUpload
                endpoint="auditedAccountsUploader"
                formFieldName="business.auditedAccountsUrl"
                label="Last 2 Years' Audited Accounts"
                description="Financial statements audited by a certified public accountant for the past two years."
                currentUrl={form.watch("business.auditedAccountsUrl")}
                form={form}
              />
              
              {/* Tax Compliance Certificate */}
              <DocumentUpload
                endpoint="taxComplianceUploader"
                formFieldName="business.taxComplianceUrl"
                label="Tax Compliance Certificate"
                description="Current tax compliance certificate showing your business is up to date with tax obligations."
                currentUrl={form.watch("business.taxComplianceUrl")}
                form={form}
              />
            </div>
          </div>

          {/* Sector Categorization Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                render={({ field }) => {
                  // Function to get full sector display text
                  const getSectorDisplayText = (value: string) => {
                    switch (value) {
                      case "food-security":
                        return "Food Security\n\nEnsuring reliable access to sufficient, safe, and nutritious food.";
                      case "infrastructure":
                        return "Infrastructure\n\nWater management, renewable energy, climate-resilient construction, and sustainable infrastructure systems.";
                      case "other":
                        return "Other\n\nAny other sector relevant to your business.";
                      default:
                        return "";
                    }
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Which sector best describes your business?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="min-h-[80px] h-auto border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 py-3 dark:bg-gray-800">
                            <SelectValue placeholder="Select sector">
                              {field.value && (
                                <div className="text-left whitespace-pre-line text-sm leading-relaxed text-gray-900 dark:text-gray-100">
                                  {getSectorDisplayText(field.value)}
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="food-security" className="py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">Food Security</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Ensuring reliable access to sufficient, safe, and nutritious food.</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="infrastructure" className="py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">Infrastructure</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Water management, renewable energy, climate-resilient construction, and sustainable infrastructure systems.</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="other" className="py-3">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">Other</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">Any other sector relevant to your business.</div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-gray-600 dark:text-gray-400">
                        Select the sector that most closely aligns with your business operations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {form.watch("business.sector") === "other" && (
                <FormField
                  control={form.control}
                  name="business.sectorOther"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Please Specify Sector</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please specify your business sector"
                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          
          {/* Location Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 p-6">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="h-6 w-6" />
                <h3 className="text-xl  font-semibold">Location</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="business.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Country of Operation</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select country" />
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
                      <FormDescription className="text-gray-600 dark:text-gray-100">
                        Select the participating country where your business primarily operates
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="business.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">City/Town</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter city name" 
                          {...field} 
                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
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
                    <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Countries Where Registered</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Kenya, Rwanda, Tanzania" 
                        {...field} 
                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-100">
                      List all participating countries where your business is registered to operate (separate with commas)
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                        className="border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-100">
                      Total revenue generated over the last two years (USD)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
                  <h4 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    Employment Data
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">Direct and indirect employment created by your business</p>
                  
                  {/* Direct Employment (Full-Time) */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3 border-l-2 border-blue-500 pl-2">
                      Direct Employment (Full-Time)
                    </h5>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="business.fullTimeEmployeesTotal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Total Full-Time Employees</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ""}
                                className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-11"
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
                              <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Male (Full-Time)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  value={field.value || ""}
                                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-11"
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
                              <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Female (Full-Time)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  value={field.value || ""}
                                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-11"
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
                
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-100 dark:border-green-800">
                  <h4 className="text-base font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    Employment Data
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-4">Indirect employment opportunities created</p>
                  
                  {/* Indirect Employment (Part-Time) */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-green-800 dark:text-green-200 mb-3 border-l-2 border-green-500 pl-2">
                      Indirect Employment (Part-Time)
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="business.partTimeEmployeesMale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Male (Part-Time)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ""}
                                className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-green-500 focus:ring-green-500 h-11"
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
                            <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Female (Part-Time)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ""}
                                className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-green-500 focus:ring-green-500 h-11"
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
          </div>
          
          {/* Product/Service Information Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
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
                    <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Product/Service Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your main products or services..." 
                        className="min-h-[120px] border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-100">
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
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Unit Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value || ""}
                          className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600 dark:text-gray-100">
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
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Customers (Last 6 Months)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          value={field.value || ""}
                          className="border-gray-300 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-600 dark:text-gray-100">
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
                    <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Production Capacity (Last 6 Months)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 500 units per month, 10 clients per week" 
                        {...field} 
                        className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-600 dark:text-gray-100">
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
                    <div className="mb-4 ">
                      <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Target Customer Segments</FormLabel>
                      <FormDescription className="text-gray-600 dark:text-gray-100">
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
                                className="flex flex-row items-start space-x-4 space-y-0 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/20 dark:hover:to-blue-800/20 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
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
                                    className="scale-125 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:border-gray-400 data-[state=unchecked]:bg-white shadow-lg border-2 hover:shadow-xl data-[state=checked]:hover:bg-blue-700"
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-gray-900 dark:text-gray-100 cursor-pointer">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Conditional "Other" specification input */}
                    {form.watch("business.customerSegments")?.includes("other") && (
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name="business.customerSegmentsOther"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-900 dark:text-gray-100 font-medium">Please Specify Other Customer Segments</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Please specify your other customer segments"
                                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:border-blue-500 focus:ring-blue-500 h-12"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-gray-600 dark:text-gray-400">
                                Describe any additional customer segments not listed above
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    
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
                        className="min-h-[120px] border-gray-300 text-gray-900
                         focus:border-green-500 focus:ring-green-500 resize-none"
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-green-500 focus:ring-green-500 resize-none"
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
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
                        className="min-h-[120px] border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 resize-none"
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