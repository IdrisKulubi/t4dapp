import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default async function ApplicationDetail({
  params,
}: {
  params: { id: string };
}) {
  // TODO: Fetch application data from the database
  const applicationId = params.id;
  
  // Placeholder data
  const application = {
    id: applicationId,
    status: "submitted",
    submittedAt: new Date().toISOString(),
    business: {
      name: "Example Business",
      country: "kenya",
      city: "Nairobi",
    },
    applicant: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      gender: "male",
      dateOfBirth: "1995-05-15",
    },
    eligibility: {
      isEligible: true,
      totalScore: 65,
      mandatoryCriteria: {
        ageEligible: true,
        registrationEligible: true,
        revenueEligible: true,
        businessPlanEligible: true,
        impactEligible: true,
      },
      evaluationScores: {
        marketPotentialScore: 8,
        innovationScore: 7,
        climateAdaptationScore: 15,
        jobCreationScore: 6,
        viabilityScore: 8,
        managementCapacityScore: 9,
        locationBonus: 5,
        genderBonus: 0,
      },
    },
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link
            href="/admin/applications"
            className="text-sm text-muted-foreground hover:underline mb-2 inline-block"
          >
            ← Back to Applications
          </Link>
          <h1 className="text-3xl font-bold">
            Application #{applicationId}
          </h1>
          <p className="text-muted-foreground">
            {application.business.name} - {application.applicant.firstName}{" "}
            {application.applicant.lastName}
          </p>
        </div>
        
        <div className="flex gap-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reject</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reject the application and notify the applicant. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Reject Application</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Approve</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                <AlertDialogDescription>
                  This will approve the application and notify the applicant. Proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Approve Application</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="summary">
            <TabsList className="w-full">
              <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
              <TabsTrigger value="personal" className="flex-1">Personal Info</TabsTrigger>
              <TabsTrigger value="business" className="flex-1">Business</TabsTrigger>
              <TabsTrigger value="adaptation" className="flex-1">Climate Adaptation</TabsTrigger>
              <TabsTrigger value="financial" className="flex-1">Financial</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Application Summary</CardTitle>
                  <CardDescription>
                    Overview of the application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-1">Business Name</h3>
                        <p>{application.business.name}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Location</h3>
                        <p>
                          {application.business.city}, {application.business.country.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Applicant</h3>
                        <p>
                          {application.applicant.firstName} {application.applicant.lastName}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Contact</h3>
                        <p>{application.applicant.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Submitted</h3>
                        <p>{new Date(application.submittedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Status</h3>
                        <p className="capitalize">{application.status}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="text-sm font-medium mb-2">Summary</h3>
                      <p className="text-muted-foreground">
                        Full application details will be displayed here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Personal information details will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Business information details will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="adaptation" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Climate Adaptation Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Climate adaptation solution details will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Financial information details will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Assessment</CardTitle>
              <CardDescription>
                Evaluation based on program criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Overall Result</h3>
                    <span className={application.eligibility.isEligible ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {application.eligibility.isEligible ? "ELIGIBLE" : "INELIGIBLE"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">Total Score</h3>
                    <span className="font-medium">{application.eligibility.totalScore}/80</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Mandatory Criteria</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Age (18-35)</span>
                      <span className={application.eligibility.mandatoryCriteria.ageEligible ? "text-green-600" : "text-red-600"}>
                        {application.eligibility.mandatoryCriteria.ageEligible ? "✓" : "✗"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Business Registration</span>
                      <span className={application.eligibility.mandatoryCriteria.registrationEligible ? "text-green-600" : "text-red-600"}>
                        {application.eligibility.mandatoryCriteria.registrationEligible ? "✓" : "✗"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Revenue Generation</span>
                      <span className={application.eligibility.mandatoryCriteria.revenueEligible ? "text-green-600" : "text-red-600"}>
                        {application.eligibility.mandatoryCriteria.revenueEligible ? "✓" : "✗"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Business Plan</span>
                      <span className={application.eligibility.mandatoryCriteria.businessPlanEligible ? "text-green-600" : "text-red-600"}>
                        {application.eligibility.mandatoryCriteria.businessPlanEligible ? "✓" : "✗"}
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Climate Impact</span>
                      <span className={application.eligibility.mandatoryCriteria.impactEligible ? "text-green-600" : "text-red-600"}>
                        {application.eligibility.mandatoryCriteria.impactEligible ? "✓" : "✗"}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Evaluation Scores</h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span>Market Potential</span>
                      <span>{application.eligibility.evaluationScores.marketPotentialScore}/10</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Innovation</span>
                      <span>{application.eligibility.evaluationScores.innovationScore}/10</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Climate Adaptation</span>
                      <span>{application.eligibility.evaluationScores.climateAdaptationScore}/20</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Job Creation</span>
                      <span>{application.eligibility.evaluationScores.jobCreationScore}/10</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Financial Viability</span>
                      <span>{application.eligibility.evaluationScores.viabilityScore}/10</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Management Capacity</span>
                      <span>{application.eligibility.evaluationScores.managementCapacityScore}/10</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Location Bonus</span>
                      <span>{application.eligibility.evaluationScores.locationBonus}/5</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Gender Bonus</span>
                      <span>{application.eligibility.evaluationScores.genderBonus}/5</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/admin/applications/${applicationId}/evaluate`}>
                  Re-evaluate Application
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 