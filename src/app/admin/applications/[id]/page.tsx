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
import { Badge } from "@/components/ui/badge";
import { getApplicationById } from "@/lib/actions/actions";
import { notFound } from 'next/navigation';
import { use } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Building, 
  Leaf, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Award,
  TrendingUp,
  AlertTriangle,
  FileText,
  Edit
} from "lucide-react";

export default function ApplicationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const awaitedParams = use(params);
  const applicationId = parseInt(awaitedParams.id, 10);

  const result = use(getApplicationById(applicationId));
  
  if (!result.success || !result.data) {
    if (result.error === "Application not found") {
      notFound();
    } else {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container mx-auto py-8 text-center">
            <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error Fetching Application</h1>
            <p className="text-gray-600 mb-6">{result.error || "An unexpected error occurred."}</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/admin/applications">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Applications
              </Link>
            </Button>
          </div>
        </div>
      );
    }
  }

  const application = result.data;
  
  const formattedSubmittedAt = application.submittedAt 
    ? new Date(application.submittedAt).toLocaleString() 
    : "Not Submitted";

  // Helper functions
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
      case 'under_review': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
      case 'approved': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Link
              href="/admin/applications"
              className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Applications
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Application #{application.id}
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                {application.business.name} - {application.applicant.firstName} {application.applicant.lastName}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge className={`${getStatusColor(application.status)} font-medium px-3 py-1`}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  Submitted: {formattedSubmittedAt}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reject the application and notify the applicant. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Reject Application
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Confirm Approval
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will approve the application and notify the applicant. Proceed?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-green-600 hover:bg-green-700">
                    Approve Application
                  </AlertDialogAction>
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
                            {application.business.city}, {application.business.country?.toUpperCase() ?? 'N/A'}
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
                          <p>{formattedSubmittedAt}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium mb-1">Status</h3>
                          <p className="capitalize">{application.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold mb-2">Business Description</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {application.business.description || "No description provided."} 
                        </p>
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <h3 className="text-lg font-semibold mb-2">Problem Solved</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {application.business.problemSolved || "Not specified."} 
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><h3 className="text-sm font-medium">First Name</h3><p>{application.applicant.firstName}</p></div>
                      <div><h3 className="text-sm font-medium">Last Name</h3><p>{application.applicant.lastName}</p></div>
                      <div><h3 className="text-sm font-medium">Email</h3><p>{application.applicant.email}</p></div>
                      <div><h3 className="text-sm font-medium">Phone</h3><p>{application.applicant.phoneNumber}</p></div>
                      <div><h3 className="text-sm font-medium">Gender</h3><p className="capitalize">{application.applicant.gender}</p></div>
                      <div><h3 className="text-sm font-medium">Date of Birth</h3><p>{application.applicant.dateOfBirth}</p></div>
                      <div><h3 className="text-sm font-medium">Citizenship</h3><p className="capitalize">{application.applicant.citizenship === 'other' ? application.applicant.citizenshipOther : application.applicant.citizenship}</p></div>
                      <div><h3 className="text-sm font-medium">Country of Residence</h3><p className="capitalize">{application.applicant.countryOfResidence === 'other' ? application.applicant.residenceOther : application.applicant.countryOfResidence}</p></div>
                      <div><h3 className="text-sm font-medium">Highest Education</h3><p className="capitalize">{application.applicant.highestEducation.replace(/_/g, ' ')}</p></div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><h3 className="text-sm font-medium">Business Name</h3><p>{application.business.name}</p></div>
                      <div><h3 className="text-sm font-medium">Start Date</h3><p>{application.business.startDate}</p></div>
                      <div><h3 className="text-sm font-medium">Registered?</h3><p>{application.business.isRegistered ? 'Yes' : 'No'}</p></div>
                      {application.business.isRegistered && application.business.registrationCertificateUrl && (
                        <div>
                          <h3 className="text-sm font-medium">Registration Certificate</h3>
                          <Link href={application.business.registrationCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Certificate</Link>
                        </div>
                      )}
                      <div><h3 className="text-sm font-medium">Country of Operation</h3><p className="capitalize">{application.business.country === 'other' ? application.business.countryOther : application.business.country}</p></div>
                      <div><h3 className="text-sm font-medium">City</h3><p>{application.business.city}</p></div>
                      <div><h3 className="text-sm font-medium">Registered Countries (Other)</h3><p>{application.business.registeredCountries}</p></div>
                      <div><h3 className="text-sm font-medium">Revenue (Last 2 Years)</h3><p>${application.business.revenueLastTwoYears?.toLocaleString() ?? 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Target Customers</h3><p>{application.business.targetCustomers.join(', ').replace(/_/g, ' ') || 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Unit Price</h3><p>${application.business.unitPrice?.toLocaleString() ?? 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Customers (Last 6 Mo)</h3><p>{application.business.customerCountLastSixMonths ?? 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Production Capacity (Last 6 Mo)</h3><p>{application.business.productionCapacityLastSixMonths || 'N/A'}</p></div>
                    </div>
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-2">Employees</h3>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div><h4 className="font-medium">Total Full-Time</h4><p>{application.business.employees.fullTimeTotal}</p></div>
                        <div><h4 className="font-medium">Full-Time Male</h4><p>{application.business.employees.fullTimeMale}</p></div>
                        <div><h4 className="font-medium">Full-Time Female</h4><p>{application.business.employees.fullTimeFemale}</p></div>
                        <div><h4 className="font-medium">Part-Time Male</h4><p>{application.business.employees.partTimeMale}</p></div>
                        <div><h4 className="font-medium">Part-Time Female</h4><p>{application.business.employees.partTimeFemale}</p></div>
                      </div>
                    </div>
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-semibold mb-2">Challenges & Support Needed</h3>
                      <div className="space-y-4">
                        <div><h4 className="font-medium text-sm">Current Challenges</h4><p className="text-muted-foreground whitespace-pre-wrap text-sm">{application.business.currentChallenges || 'N/A'}</p></div>
                        <div><h4 className="font-medium text-sm">Support Needed</h4><p className="text-muted-foreground whitespace-pre-wrap text-sm">{application.business.supportNeeded || 'N/A'}</p></div>
                      </div>
                    </div>
                     {application.business.additionalInformation && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap text-sm">{application.business.additionalInformation}</p>
                      </div>
                    )}
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
                      <div><h3 className="text-sm font-medium">Contribution to Climate Adaptation</h3><p className="text-muted-foreground whitespace-pre-wrap">{application.business.climateAdaptationContribution || 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Product/Service Description</h3><p className="text-muted-foreground whitespace-pre-wrap">{application.business.productServiceDescription || 'N/A'}</p></div>
                      <div><h3 className="text-sm font-medium">Impact of Climate Extremes</h3><p className="text-muted-foreground whitespace-pre-wrap">{application.business.climateExtremeImpact || 'N/A'}</p></div>
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
                    {application.business.funding && application.business.funding.length > 0 ? (
                      <div className="space-y-6">
                        {application.business.funding.map((fund, index) => (
                          <div key={fund.id} className={index > 0 ? "border-t pt-6" : ""}>
                            <h3 className="font-semibold mb-2">Funding Record {index + 1}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div><h4 className="font-medium">Has External Funding?</h4><p>{fund.hasExternalFunding ? 'Yes' : 'No'}</p></div>
                              {fund.hasExternalFunding && (
                                <>
                                  <div><h4 className="font-medium">Funding Source</h4><p className="capitalize">{fund.fundingSource === 'other' ? fund.fundingSourceOther : fund.fundingSource?.replace(/_/g, ' ')}</p></div>
                                  <div><h4 className="font-medium">Funder Name</h4><p>{fund.funderName || 'N/A'}</p></div>
                                  <div><h4 className="font-medium">Funding Date</h4><p>{fund.fundingDate ? new Date(fund.fundingDate).toLocaleDateString() : 'N/A'}</p></div>
                                  <div><h4 className="font-medium">Amount (USD)</h4><p>${fund.amountUsd?.toLocaleString() ?? 'N/A'}</p></div>
                                  <div><h4 className="font-medium">Instrument</h4><p className="capitalize">{fund.fundingInstrument === 'other' ? fund.fundingInstrumentOther : fund.fundingInstrument}</p></div>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No external funding information provided.
                      </p>
                    )}
                    <div className="mt-6 border-t pt-6">
                      <h3 className="font-semibold mb-2">Revenue (Last 2 Years)</h3>
                      <p>${application.business.revenueLastTwoYears?.toLocaleString() ?? 'N/A'}</p>
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
                  {application.eligibility ? 
                    `Last evaluated: ${application.eligibility.evaluatedAt ? new Date(application.eligibility.evaluatedAt).toLocaleString() : 'N/A'}` :
                    'Not evaluated yet'
                  }
                </CardDescription>
              </CardHeader>
              {application.eligibility ? (
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
                        <li className="flex justify-between"><span>Market Potential</span><span>{application.eligibility.evaluationScores.marketPotentialScore}/10</span></li>
                        <li className="flex justify-between"><span>Innovation</span><span>{application.eligibility.evaluationScores.innovationScore}/10</span></li>
                        <li className="flex justify-between"><span>Climate Adaptation</span><span>{application.eligibility.evaluationScores.climateAdaptationScore}/20</span></li>
                        <li className="flex justify-between"><span>Job Creation</span><span>{application.eligibility.evaluationScores.jobCreationScore}/10</span></li>
                        <li className="flex justify-between"><span>Financial Viability</span><span>{application.eligibility.evaluationScores.viabilityScore}/10</span></li>
                        <li className="flex justify-between"><span>Management Capacity</span><span>{application.eligibility.evaluationScores.managementCapacityScore}/10</span></li>
                        <li className="flex justify-between"><span>Location Bonus</span><span>{application.eligibility.evaluationScores.locationBonus}/5</span></li>
                        <li className="flex justify-between"><span>Gender Bonus</span><span>{application.eligibility.evaluationScores.genderBonus}/5</span></li>
                      </ul>
                    </div>
                    {application.eligibility.evaluationNotes && (
                      <div className="border-t pt-4">
                         <h3 className="text-sm font-medium mb-2">Evaluation Notes</h3>
                         <p className="text-sm text-muted-foreground whitespace-pre-wrap">{application.eligibility.evaluationNotes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              ) : (
                <CardContent>
                  <p className="text-muted-foreground text-sm text-center py-4">This application has not been evaluated yet.</p>
                </CardContent>
              )}
              <CardFooter>
                <Button className="w-full" variant="outline" asChild>
                  <Link href={`/admin/applications/${application.id}/evaluate`}>
                    {application.eligibility ? 'Re-evaluate Application' : 'Evaluate Application'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 