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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { getApplicationById, saveEvaluation } from "@/lib/actions/actions"; // Import saveEvaluation
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EvaluationApplicationData {
  id: number;
  status: string;
  submittedAt: string | null;
  business: {
    id: number;
    name: string;
    country: string;
    city: string;
    // ... other business fields if needed ...
  };
  applicant: {
    id: number;
    firstName: string;
    lastName: string;
    // ... other applicant fields if needed ...
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

// Define state for form inputs
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

export default function EvaluateApplicationPage({ params }: { params: { id: string } }) {
  const applicationId = parseInt(params.id, 10);
  const router = useRouter();
  const [application, setApplication] = useState<EvaluationApplicationData | null>(null);
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
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetching data on the client side - consider RSC fetching if preferred
        const result = await getApplicationById(applicationId);
        if (!result.success || !result.data) {
          if (result.error === "Application not found") {
            // We can't call notFound() directly in useEffect/client component
            // Redirect or show specific UI instead
             setError("Application not found. It may have been deleted.");
             setApplication(null); // Ensure no stale data is shown
          } else {
            throw new Error(result.error || "Failed to fetch application data.");
          }
        } else {
          setApplication(result.data);
          // Initialize form state with existing evaluation data if available
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

  // Calculate total score whenever form state changes
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
    
    startTransition(async () => {
      setError(null); // Clear previous errors
      try {
        const result = await saveEvaluation({
          applicationId,
          ...formState,
          totalScore,
          evaluationNotes: formState.evaluationNotes || null, // Send null if empty
        });

        if (result.success) {
          toast.success(result.message || "Evaluation saved successfully.");
          // Redirect back to the detail page after successful submission
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
     // This state might occur briefly or if fetch fails without specific error handled above
     return (
       <div className="container mx-auto py-8 text-center">
         <p className="text-muted-foreground">Application data could not be loaded.</p>
          <Button asChild className="mt-4">
            <Link href="/admin/applications">Back to Applications</Link>
         </Button>
       </div>
     );
  }

  // Determine overall mandatory eligibility (assuming initial check was done)
  const mandatoryEligible = application.eligibility ? (
      application.eligibility.mandatoryCriteria.ageEligible &&
      application.eligibility.mandatoryCriteria.registrationEligible &&
      application.eligibility.mandatoryCriteria.revenueEligible &&
      application.eligibility.mandatoryCriteria.businessPlanEligible &&
      application.eligibility.mandatoryCriteria.impactEligible
  ) : false; // Default to false if no eligibility record exists

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
          {/* Evaluation Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Evaluation Scores Section */}
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Scores</CardTitle>
                <CardDescription>Score each criterion based on the application details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sliders for each score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <Label htmlFor="marketPotentialScore">Market Potential (0-10)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="marketPotentialScore"
                          min={0} max={10} step={1}
                          value={[formState.marketPotentialScore]}
                          onValueChange={(val) => handleSliderChange('marketPotentialScore', val)}
                        />
                        <span className="font-medium w-8 text-right">{formState.marketPotentialScore}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="innovationScore">Innovation (0-10)</Label>
                       <div className="flex items-center gap-2">
                        <Slider
                          id="innovationScore"
                          min={0} max={10} step={1}
                          value={[formState.innovationScore]}
                          onValueChange={(val) => handleSliderChange('innovationScore', val)}
                        />
                        <span className="font-medium w-8 text-right">{formState.innovationScore}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="climateAdaptationScore">Climate Adaptation (0-20)</Label>
                       <div className="flex items-center gap-2">
                          <Slider
                            id="climateAdaptationScore"
                            min={0} max={20} step={1}
                            value={[formState.climateAdaptationScore]}
                            onValueChange={(val) => handleSliderChange('climateAdaptationScore', val)}
                          />
                          <span className="font-medium w-8 text-right">{formState.climateAdaptationScore}</span>
                       </div>
                   </div>
                   <div>
                      <Label htmlFor="jobCreationScore">Job Creation Potential (0-10)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="jobCreationScore"
                          min={0} max={10} step={1}
                          value={[formState.jobCreationScore]}
                          onValueChange={(val) => handleSliderChange('jobCreationScore', val)}
                        />
                        <span className="font-medium w-8 text-right">{formState.jobCreationScore}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="viabilityScore">Financial Viability (0-10)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="viabilityScore"
                          min={0} max={10} step={1}
                          value={[formState.viabilityScore]}
                          onValueChange={(val) => handleSliderChange('viabilityScore', val)}
                        />
                         <span className="font-medium w-8 text-right">{formState.viabilityScore}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="managementCapacityScore">Management Capacity (0-10)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="managementCapacityScore"
                          min={0} max={10} step={1}
                          value={[formState.managementCapacityScore]}
                           onValueChange={(val) => handleSliderChange('managementCapacityScore', val)}
                        />
                        <span className="font-medium w-8 text-right">{formState.managementCapacityScore}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="locationBonus">Location Bonus (0-5)</Label>
                       <div className="flex items-center gap-2">
                        <Slider
                          id="locationBonus"
                          min={0} max={5} step={1}
                          value={[formState.locationBonus]}
                           onValueChange={(val) => handleSliderChange('locationBonus', val)}
                        />
                        <span className="font-medium w-8 text-right">{formState.locationBonus}</span>
                      </div>
                   </div>
                   <div>
                      <Label htmlFor="genderBonus">Gender Bonus (0-5)</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id="genderBonus"
                          min={0} max={5} step={1}
                          value={[formState.genderBonus]}
                          onValueChange={(val) => handleSliderChange('genderBonus', val)}
                        />
                         <span className="font-medium w-8 text-right">{formState.genderBonus}</span>
                      </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            {/* Evaluation Notes Section */}
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

          {/* Summary & Mandatory Criteria Column */}
          <div className="space-y-6">
            {/* Total Score Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Total Evaluation Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-center">{totalScore} / 80</p>
                 {/* Display server-side error message if exists */}
                 {error && (
                   <Alert variant="destructive" className="mt-4">
                     <XCircle className="h-4 w-4" />
                     <AlertTitle>Submission Error</AlertTitle>
                     <AlertDescription>{error}</AlertDescription>
                   </Alert>
                 )}
              </CardContent>
            </Card>

            {/* Mandatory Criteria */}
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
        
        {/* Form Actions */}
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