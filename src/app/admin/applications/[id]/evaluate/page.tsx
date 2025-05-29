"use client"; 
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { getApplicationById, saveEvaluation } from "@/lib/actions/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Eye, TrendingUp, Lightbulb, Leaf, Users, DollarSign, UserCheck, MapPin, Heart } from "lucide-react";
import { toast } from "sonner";

interface EvaluationApplicationData {
  id: number;
  status: string;
  submittedAt: string | null;
  business: {
    id: number;
    name: string;
    country: string;
    countryOther?: string | null;
    city: string;
    startDate: string;
    isRegistered: boolean;
    registrationCertificateUrl?: string | null;
    registeredCountries: string;
    description: string;
    problemSolved: string;
    revenueLastTwoYears: string;
    employees: {
      fullTimeTotal: number;
      fullTimeMale: number;
      fullTimeFemale: number;
      partTimeMale: number;
      partTimeFemale: number;
    };
    climateAdaptationContribution: string;
    productServiceDescription: string;
    climateExtremeImpact: string;
    unitPrice: string;
    customerCountLastSixMonths: number;
    productionCapacityLastSixMonths: string;
    currentChallenges: string;
    supportNeeded: string;
    additionalInformation?: string | null;
    funding?: Array<{
      fundingSource?: string | null;
      fundingSourceOther?: string | null;
      amountUsd?: string | null;
      fundingDate?: string | null;
      fundingInstrument?: string | null;
    }>;
    targetCustomers?: string[];
  };
  applicant: {
    id: number;
    userId: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    citizenship: string;
    citizenshipOther?: string | null;
    countryOfResidence: string;
    residenceOther?: string | null;
    phoneNumber: string;
    email: string;
    highestEducation: string;
  };
  eligibility: {
    id: number;
    isEligible: boolean;
    totalScore: number;
    mandatoryCriteria: {
      ageEligible: boolean;
      registrationEligible: boolean;
      revenueEligible: boolean;
      businessPlanEligible: boolean;
      impactEligible: boolean;
    };
    evaluationScores: {
      marketPotentialScore: number;
      innovationScore: number;
      climateAdaptationScore: number;
      jobCreationScore: number;
      viabilityScore: number;
      managementCapacityScore: number;
      locationBonus: number;
      genderBonus: number;
    };
    evaluationNotes: string | null;
    evaluatedAt: string | null;
  } | null;
}

interface EvaluationFormState {
  marketPotentialScore: number;
  innovationScore: number;
  climateAdaptationScore: number;
  jobCreationScore: number;
  viabilityScore: number;
  managementCapacityScore: number;
  locationBonus: number;
  genderBonus: number;
  evaluationNotes: string;
}

interface EvaluationCriterionProps {
  id: string;
  label: string;
  maxScore: number;
  value: number;
  onChange: (value: number[]) => void;
  icon: React.ReactNode;
  modalTitle: string;
  modalContent: React.ReactNode;
  description?: string;
}

function EvaluationCriterion({
  id,
  label,
  maxScore,
  value,
  onChange,
  icon,
  modalTitle,
  modalContent,
  description
}: EvaluationCriterionProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm font-medium flex items-center gap-2">
          {icon}
          {label} (0-{maxScore})
        </Label>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-3">
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {icon}
                {modalTitle}
              </DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
            <div className="mt-4">
              {modalContent}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-3">
        <Slider
          id={id}
          min={0}
          max={maxScore}
          step={1}
          value={[value]}
          onValueChange={onChange}
          className="flex-1"
        />
        <div className="w-12 text-right">
          <span className="font-medium text-lg">{value}</span>
          <span className="text-sm text-muted-foreground">/{maxScore}</span>
        </div>
      </div>
    </div>
  );
}

export default function EvaluateApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [application, setApplication] = useState<EvaluationApplicationData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startTransition] = useTransition();
  const [formState, setFormState] = useState<EvaluationFormState>({
    marketPotentialScore: 0,
    innovationScore: 0,
    climateAdaptationScore: 0,
    jobCreationScore: 0,
    viabilityScore: 0,
    managementCapacityScore: 0,
    locationBonus: 0,
    genderBonus: 0,
    evaluationNotes: "",
  });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    async function resolveParams() {
      try {
        const resolvedParams = await params;
        setApplicationId(parseInt(resolvedParams.id, 10));
      } catch (err) {
        console.error("Error resolving params promise:", err);
        setError("Failed to load application ID.");
      }
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (applicationId === null) {
      return;
    }
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const result = await getApplicationById(applicationId as number);
        if (!result.success || !result.data) {
          if (result.error === "Application not found") {
             setError("Application not found. It may have been deleted.");
             setApplication(null);
          } else {
            throw new Error(result.error || "Failed to fetch application data.");
          }
        } else {
          setApplication(result.data);
          if (result.data.eligibility) {
            setFormState({
              marketPotentialScore: result.data.eligibility.evaluationScores.marketPotentialScore,
              innovationScore: result.data.eligibility.evaluationScores.innovationScore,
              climateAdaptationScore: result.data.eligibility.evaluationScores.climateAdaptationScore,
              jobCreationScore: result.data.eligibility.evaluationScores.jobCreationScore,
              viabilityScore: result.data.eligibility.evaluationScores.viabilityScore,
              managementCapacityScore: result.data.eligibility.evaluationScores.managementCapacityScore,
              locationBonus: result.data.eligibility.evaluationScores.locationBonus,
              genderBonus: result.data.eligibility.evaluationScores.genderBonus,
              evaluationNotes: result.data.eligibility.evaluationNotes || "",
            });
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Error fetching application for evaluation:", err);
        setError(err.message || "An unexpected error occurred while fetching data.");
        setApplication(null); 
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [applicationId]);

  useEffect(() => {
    const score = 
      formState.marketPotentialScore +
      formState.innovationScore +
      formState.climateAdaptationScore +
      formState.jobCreationScore +
      formState.viabilityScore +
      formState.managementCapacityScore +
      formState.locationBonus +
      formState.genderBonus;
    setTotalScore(score);
  }, [formState]);

  const handleSliderChange = (name: keyof EvaluationFormState, value: number[]) => {
    setFormState(prev => ({ ...prev, [name]: value[0] }));
  };
  
   const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     setFormState(prev => ({ ...prev, evaluationNotes: event.target.value }));
   };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (applicationId === null) {
      toast.error("Application ID is missing, cannot save evaluation.");
      return;
    }
    
    startTransition(async () => {
      setError(null); 
      try {
        const result = await saveEvaluation({
          applicationId,
          ...formState,
          totalScore,
          evaluationNotes: formState.evaluationNotes || null,
        });

        if (result.success) {
          toast.success(result.message || "Evaluation saved successfully.");
          router.push(`/admin/applications/${applicationId}`);
        } else {
          throw new Error(result.error || "Failed to save evaluation.");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
         console.error("Error submitting evaluation:", err);
         setError(err.message || "An unexpected error occurred during submission.");
         toast.error(err.message || "Failed to save evaluation. Please try again.");
      }
    });
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatCountry = (country: string, countryOther?: string | null) => {
    if (country === 'other' && countryOther) {
      return countryOther;
    }
    return country.charAt(0).toUpperCase() + country.slice(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="ml-2 text-muted-foreground">Loading Application Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
         <Alert variant="destructive" className="max-w-lg mx-auto mb-4">
           <XCircle className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
         <Button asChild>
            <Link href="/admin/applications">Back to Applications</Link>
         </Button>
      </div>
    );
  }
  
  if (!application) {
     return (
       <div className="container mx-auto py-8 text-center">
         <p className="text-muted-foreground">Application data could not be loaded.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/applications">Back to Applications</Link>
         </Button>
       </div>
     );
  }

  const mandatoryEligible = application.eligibility ? (
      application.eligibility.mandatoryCriteria.ageEligible &&
      application.eligibility.mandatoryCriteria.registrationEligible &&
      application.eligibility.mandatoryCriteria.revenueEligible &&
      application.eligibility.mandatoryCriteria.businessPlanEligible &&
      application.eligibility.mandatoryCriteria.impactEligible
  ) : false;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
         <Link
            href={`/admin/applications/${applicationId}`}
            className="text-sm text-muted-foreground hover:underline mb-2 inline-block"
          >
            ← Back to Application Detail
          </Link>
        <h1 className="text-3xl font-bold">Evaluate Application #{application.id}</h1>
        <p className="text-muted-foreground">
            {application.business.name} - {application.applicant.firstName} {application.applicant.lastName}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Scores</CardTitle>
                <CardDescription>
                  Score each criterion based on the application details. Click &quot;View Details&quot; to see the applicant&apos;s responses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <EvaluationCriterion
                    id="marketPotentialScore"
                    label="Market Potential"
                    maxScore={10}
                    value={formState.marketPotentialScore}
                    onChange={(val) => handleSliderChange('marketPotentialScore', val)}
                    icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
                    modalTitle="Market Potential Assessment"
                    description="Evaluate the market opportunity and customer demand for this solution"
                    modalContent={
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Customer Base</h4>
                            <p className="text-sm text-blue-800">
                              <strong>Last 6 Months:</strong> {application.business.customerCountLastSixMonths} customers
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Unit Price</h4>
                            <p className="text-sm text-green-800">
                              {formatCurrency(application.business.unitPrice)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Product/Service Description</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                              {application.business.productServiceDescription}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Problem Being Solved</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                              {application.business.problemSolved}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Production Capacity</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                              {application.business.productionCapacityLastSixMonths}
                            </p>
                          </div>
                          
                          {application.business.targetCustomers && application.business.targetCustomers.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Target Customer Segments</h4>
                              <div className="flex flex-wrap gap-2">
                                {application.business.targetCustomers.map((segment: string, index: number) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                    {segment.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="innovationScore"
                    label="Innovation"
                    maxScore={10}
                    value={formState.innovationScore}
                    onChange={(val) => handleSliderChange('innovationScore', val)}
                    icon={<Lightbulb className="h-4 w-4 text-yellow-600" />}
                    modalTitle="Innovation Assessment"
                    description="Assess the novelty and innovative aspects of the solution"
                    modalContent={
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Business Description</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.description}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Product/Service Innovation</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.productServiceDescription}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Current Challenges & Innovation Opportunities</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.currentChallenges}
                          </p>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-900 mb-2">Business Age</h4>
                          <p className="text-sm text-yellow-800">
                            Started: {new Date(application.business.startDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="climateAdaptationScore"
                    label="Climate Adaptation Impact"
                    maxScore={20}
                    value={formState.climateAdaptationScore}
                    onChange={(val) => handleSliderChange('climateAdaptationScore', val)}
                    icon={<Leaf className="h-4 w-4 text-green-600" />}
                    modalTitle="Climate Adaptation Impact Assessment"
                    description="Evaluate the solution's contribution to climate adaptation and resilience"
                    modalContent={
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Climate Adaptation Contribution</h4>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.climateAdaptationContribution}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Impact of Climate Extremes</h4>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.climateExtremeImpact}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Product/Service Climate Focus</h4>
                          <p className="text-sm text-gray-700 bg-green-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.productServiceDescription}
                          </p>
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="jobCreationScore"
                    label="Job Creation Potential"
                    maxScore={10}
                    value={formState.jobCreationScore}
                    onChange={(val) => handleSliderChange('jobCreationScore', val)}
                    icon={<Users className="h-4 w-4 text-purple-600" />}
                    modalTitle="Job Creation Potential Assessment"
                    description="Assess the potential for creating employment opportunities"
                    modalContent={
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Current Employment</h4>
                            <div className="space-y-1 text-sm text-purple-800">
                              <p><strong>Full-time Total:</strong> {application.business.employees.fullTimeTotal}</p>
                              <p><strong>Full-time Male:</strong> {application.business.employees.fullTimeMale}</p>
                              <p><strong>Full-time Female:</strong> {application.business.employees.fullTimeFemale}</p>
                              <p><strong>Part-time Male:</strong> {application.business.employees.partTimeMale}</p>
                              <p><strong>Part-time Female:</strong> {application.business.employees.partTimeFemale}</p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Growth Indicators</h4>
                            <div className="space-y-1 text-sm text-blue-800">
                              <p><strong>Revenue (2 years):</strong> {formatCurrency(application.business.revenueLastTwoYears)}</p>
                              <p><strong>Customers (6 months):</strong> {application.business.customerCountLastSixMonths}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Support Needed (Growth Plans)</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.supportNeeded}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Current Challenges</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.currentChallenges}
                          </p>
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="viabilityScore"
                    label="Financial Viability"
                    maxScore={10}
                    value={formState.viabilityScore}
                    onChange={(val) => handleSliderChange('viabilityScore', val)}
                    icon={<DollarSign className="h-4 w-4 text-green-600" />}
                    modalTitle="Financial Viability Assessment"
                    description="Evaluate the financial sustainability and business model strength"
                    modalContent={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Revenue</h4>
                            <p className="text-sm text-green-800">
                              <strong>Last 2 Years:</strong><br />
                              {formatCurrency(application.business.revenueLastTwoYears)}
                            </p>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Unit Economics</h4>
                            <p className="text-sm text-blue-800">
                              <strong>Unit Price:</strong><br />
                              {formatCurrency(application.business.unitPrice)}
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Customer Base</h4>
                            <p className="text-sm text-purple-800">
                              <strong>Last 6 Months:</strong><br />
                              {application.business.customerCountLastSixMonths} customers
                            </p>
                          </div>
                        </div>
                        
                        {application.business.funding && application.business.funding.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Funding History</h4>
                            <div className="space-y-2">
                              {application.business.funding.map((fund, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <strong>Source:</strong> {fund.fundingSource || 'N/A'}
                                      {fund.fundingSourceOther && ` (${fund.fundingSourceOther})`}
                                    </div>
                                    <div>
                                      <strong>Amount:</strong> {fund.amountUsd ? formatCurrency(fund.amountUsd) : 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Date:</strong> {fund.fundingDate || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Instrument:</strong> {fund.fundingInstrument || 'N/A'}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <h4 className="font-semibold mb-2">Business Registration Status</h4>
                          <div className="bg-gray-50 p-3 rounded">
                            <p className="text-sm">
                              <strong>Registered:</strong> {application.business.isRegistered ? 'Yes' : 'No'}
                            </p>
                            {application.business.registeredCountries && (
                              <p className="text-sm mt-1">
                                <strong>Registered in:</strong> {application.business.registeredCountries}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="managementCapacityScore"
                    label="Management Capacity"
                    maxScore={10}
                    value={formState.managementCapacityScore}
                    onChange={(val) => handleSliderChange('managementCapacityScore', val)}
                    icon={<UserCheck className="h-4 w-4 text-indigo-600" />}
                    modalTitle="Management Capacity Assessment"
                    description="Evaluate the leadership and management capabilities"
                    modalContent={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-indigo-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 mb-2">Founder Profile</h4>
                            <div className="space-y-1 text-sm text-indigo-800">
                              <p><strong>Name:</strong> {application.applicant.firstName} {application.applicant.lastName}</p>
                              <p><strong>Age:</strong> {new Date().getFullYear() - new Date(application.applicant.dateOfBirth).getFullYear()} years</p>
                              <p><strong>Education:</strong> {application.applicant.highestEducation.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                              <p><strong>Gender:</strong> {application.applicant.gender.charAt(0).toUpperCase() + application.applicant.gender.slice(1)}</p>
                            </div>
                          </div>
                          
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Business Experience</h4>
                            <div className="space-y-1 text-sm text-green-800">
                              <p><strong>Business Age:</strong> {Math.floor((new Date().getTime() - new Date(application.business.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365))} years</p>
                              <p><strong>Team Size:</strong> {application.business.employees.fullTimeTotal} full-time employees</p>
                              <p><strong>Revenue Track Record:</strong> {formatCurrency(application.business.revenueLastTwoYears)} over 2 years</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Business Vision & Strategy</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.description}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Challenge Management</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.currentChallenges}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Support & Development Needs</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded whitespace-pre-wrap">
                            {application.business.supportNeeded}
                          </p>
                        </div>
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="locationBonus"
                    label="Location Bonus"
                    maxScore={5}
                    value={formState.locationBonus}
                    onChange={(val) => handleSliderChange('locationBonus', val)}
                    icon={<MapPin className="h-4 w-4 text-orange-600" />}
                    modalTitle="Location Bonus Assessment"
                    description="Bonus points for businesses in focus countries and strategic locations"
                    modalContent={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-orange-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-orange-900 mb-2">Business Location</h4>
                            <div className="space-y-1 text-sm text-orange-800">
                              <p><strong>Country:</strong> {formatCountry(application.business.country, application.business.countryOther)}</p>
                              <p><strong>City:</strong> {application.business.city}</p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Founder Location</h4>
                            <div className="space-y-1 text-sm text-blue-800">
                              <p><strong>Citizenship:</strong> {formatCountry(application.applicant.citizenship, application.applicant.citizenshipOther)}</p>
                              <p><strong>Residence:</strong> {formatCountry(application.applicant.countryOfResidence, application.applicant.residenceOther)}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-yellow-900 mb-2">Focus Countries</h4>
                          <p className="text-sm text-yellow-800 mb-2">
                            Priority countries for the YouthAdapt Challenge:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {['Ghana', 'Kenya', 'Nigeria', 'Rwanda', 'Tanzania'].map((country) => (
                              <span key={country} className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
                                {country}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {application.business.registeredCountries && (
                          <div>
                            <h4 className="font-semibold mb-2">Business Registration</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                              <strong>Registered in:</strong> {application.business.registeredCountries}
                            </p>
                          </div>
                        )}
                      </div>
                    }
                  />

                  <EvaluationCriterion
                    id="genderBonus"
                    label="Gender Bonus"
                    maxScore={5}
                    value={formState.genderBonus}
                    onChange={(val) => handleSliderChange('genderBonus', val)}
                    icon={<Heart className="h-4 w-4 text-pink-600" />}
                    modalTitle="Gender Bonus Assessment"
                    description="Bonus points for women-led enterprises and gender-inclusive teams"
                    modalContent={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-pink-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-pink-900 mb-2">Founder Gender</h4>
                            <p className="text-sm text-pink-800">
                              <strong>Gender:</strong> {application.applicant.gender.charAt(0).toUpperCase() + application.applicant.gender.slice(1)}
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Team Composition</h4>
                            <div className="space-y-1 text-sm text-purple-800">
                              <p><strong>Full-time Male:</strong> {application.business.employees.fullTimeMale}</p>
                              <p><strong>Full-time Female:</strong> {application.business.employees.fullTimeFemale}</p>
                              <p><strong>Part-time Male:</strong> {application.business.employees.partTimeMale}</p>
                              <p><strong>Part-time Female:</strong> {application.business.employees.partTimeFemale}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Gender Balance Analysis</h4>
                          <div className="space-y-2 text-sm text-green-800">
                            <p>
                              <strong>Total Female Employees:</strong> {application.business.employees.fullTimeFemale + application.business.employees.partTimeFemale}
                            </p>
                            <p>
                              <strong>Total Male Employees:</strong> {application.business.employees.fullTimeMale + application.business.employees.partTimeMale}
                            </p>
                            <p>
                              <strong>Female Representation:</strong> {
                                application.business.employees.fullTimeTotal > 0 
                                  ? Math.round(((application.business.employees.fullTimeFemale + application.business.employees.partTimeFemale) / 
                                      (application.business.employees.fullTimeFemale + application.business.employees.partTimeFemale + 
                                       application.business.employees.fullTimeMale + application.business.employees.partTimeMale)) * 100)
                                  : 0
                              }%
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Program Goals</h4>
                          <p className="text-sm text-blue-800">
                            The YouthAdapt Challenge aims for 50% women-led enterprises to promote gender equality in climate entrepreneurship.
                          </p>
                        </div>
                      </div>
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evaluation Notes</CardTitle>
                <CardDescription>Provide justification for the scores and overall assessment.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="evaluationNotes"
                  placeholder="Enter evaluation notes here..."
                  value={formState.evaluationNotes}
                  onChange={handleNotesChange}
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Evaluation Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-center">{totalScore} / 80</p>
                 {error && (
                   <Alert variant="destructive" className="mt-4">
                     <XCircle className="h-4 w-4" />
                     <AlertTitle>Submission Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                   </Alert>
                 )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mandatory Criteria</CardTitle>
                 <CardDescription>Based on initial automatic check.</CardDescription>
              </CardHeader>
              <CardContent>
                {application.eligibility ? (
                   <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center">
                      <span>Age (18-35)</span>
                      {application.eligibility.mandatoryCriteria.ageEligible 
                         ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                         : <XCircle className="h-5 w-5 text-red-600" />}
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Business Registration</span>
                       {application.eligibility.mandatoryCriteria.registrationEligible 
                         ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                         : <XCircle className="h-5 w-5 text-red-600" />}
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Revenue Generation (&gt; $0)</span>
                       {application.eligibility.mandatoryCriteria.revenueEligible 
                         ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                         : <XCircle className="h-5 w-5 text-red-600" />}
                    </li>
                     <li className="flex justify-between items-center">
                      <span>Business Plan (Complete)</span>
                       {application.eligibility.mandatoryCriteria.businessPlanEligible 
                         ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                         : <XCircle className="h-5 w-5 text-red-600" />}
                    </li>
                     <li className="flex justify-between items-center">
                      <span>Climate Impact Focus</span>
                       {application.eligibility.mandatoryCriteria.impactEligible 
                         ? <CheckCircle className="h-5 w-5 text-green-600" /> 
                         : <XCircle className="h-5 w-5 text-red-600" />}
                    </li>
                  </ul>
                ) : (
                   <p className="text-muted-foreground text-sm text-center py-4">Initial eligibility data not found.</p>
                )}
                 <div className={`mt-4 p-3 rounded-md text-center font-medium text-sm ${mandatoryEligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                   Mandatory Criteria: {mandatoryEligible ? "PASSED" : "FAILED"}
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="mt-8">
           <CardFooter className="flex justify-end gap-4 pt-6">
             <Button variant="outline" asChild>
               <Link href={`/admin/applications/${applicationId}`}>Cancel</Link>
             </Button>
             <Button type="submit" disabled={isSubmitting}>
               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
               {isSubmitting ? 'Saving...' : 'Save Evaluation'}
             </Button>
           </CardFooter>
        </Card>
      </form>
    </div>
  );
} 