import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Building,
  DollarSign,
  Lightbulb,
  Users,
  Target,
  LogIn
} from "lucide-react";
import Link from "next/link";
import { ContactSupportButton } from "@/components/apply/contact-support-button";

export default async function ApplicationPreparationPage() {
  const session = await auth();
  
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Login Required</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Please login to access the application preparation guide
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                <LogIn className="w-4 h-4 mr-2" />
                Login to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Preparation Guide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Before you begin your In-Country YouthADAPT Challenge application, let&apos;s ensure you have 
            everything you need for a smooth and successful submission process.
          </p>
        </div>

        {/* Key Requirements Alert */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Important:</strong> We are looking for <strong>real, implementable solutions</strong> to climate adaptation challenges with concrete business innovations that address actual climate-related problems with measurable impact potential.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Required Documents Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Building className="w-6 h-6" />
                  Required Business Documents
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Prepare these documents before starting your application
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentRequirement
                    title="Business Overview"
                    description="Comprehensive overview of your business operations, mission, and vision"
                    format="PDF or DOCX"
                    required={true}
                  />
                  <DocumentRequirement
                    title="CR12 Certificate"
                    description="Certificate of Registration or equivalent business registration document"
                    format="PDF"
                    required={true}
                  />
                  <DocumentRequirement
                    title="Audited Accounts"
                    description="Financial statements for the last 2 years (audited by certified accountant)"
                    format="PDF"
                    required={true}
                  />
                  <DocumentRequirement
                    title="Tax Compliance Certificate"
                    description="Current certificate showing tax obligations are up to date"
                    format="PDF"
                    required={true}
                  />
                </div>
                
                <Alert className="border-blue-200 bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Upload Options:</strong> You can either upload files directly (max 10MB each) or 
                    provide secure links from Google Drive, Dropbox, or other cloud storage services.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Application Sections */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Application Sections Overview
                </CardTitle>
                <CardDescription>
                  Your application consists of 6 comprehensive sections
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <ApplicationSection
                  step={1}
                  title="Personal Information"
                  description="Basic details, contact information, and educational background"
                  estimatedTime="5 minutes"
                  icon={<Users className="w-5 h-5" />}
                />
                <ApplicationSection
                  step={2}
                  title="Business Information"
                  description="Business details, registration status, and operational information"
                  estimatedTime="15 minutes"
                  icon={<Building className="w-5 h-5" />}
                />
                <ApplicationSection
                  step={3}
                  title="Climate Adaptation Solution"
                  description="Your solution to climate challenges, innovation details, and impact strategy"
                  estimatedTime="20 minutes"
                  icon={<Lightbulb className="w-5 h-5" />}
                />
                <ApplicationSection
                  step={4}
                  title="Financial Information"
                  description="Revenue details, funding history, and financial projections"
                  estimatedTime="10 minutes"
                  icon={<DollarSign className="w-5 h-5" />}
                />
                <ApplicationSection
                  step={5}
                  title="Support Needs"
                  description="Mentorship, training, and networking requirements"
                  estimatedTime="10 minutes"
                  icon={<Target className="w-5 h-5" />}
                />
                <ApplicationSection
                  step={6}
                  title="Review & Submit"
                  description="Final review of all information before submission"
                  estimatedTime="5 minutes"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                />
              </CardContent>
            </Card>

            {/* Solution Quality Expectations */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Target className="w-6 h-6" />
                  What We&apos;re Looking For
                </CardTitle>
                <CardDescription className="text-green-100">
                  Real solutions with measurable climate adaptation impact
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SolutionCriteria
                    title="Real Implementation"
                    description="Your solution should be beyond the idea stage with evidence of implementation or strong implementation plan"
                    icon="🚀"
                  />
                  <SolutionCriteria
                    title="Climate Adaptation Focus"
                    description="Clear connection to climate change adaptation, resilience building, or climate risk reduction"
                    icon="🌍"
                  />
                  <SolutionCriteria
                    title="Measurable Impact"
                    description="Quantifiable benefits to communities, environment, or climate resilience"
                    icon="📊"
                  />
                  <SolutionCriteria
                    title="Scalability Potential"
                    description="Ability to expand impact across regions, communities, or market segments"
                    icon="📈"
                  />
                  <SolutionCriteria
                    title="Innovation & Technology"
                    description="Novel approaches, creative use of technology, or innovative business models"
                    icon="💡"
                  />
                  <SolutionCriteria
                    title="Sustainability"
                    description="Financial viability and long-term sustainability of the solution"
                    icon="♻️"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-green-600 text-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Application Overview</h3>
                <div className="space-y-3">
                
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Sections:</span>
                    <span className="font-semibold">6 sections</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Documents:</span>
                    <span className="font-semibold">4 required</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100">Save Progress:</span>
                    <span className="font-semibold">Auto-save</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">💡 Pro Tips</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• <strong>Save time:</strong> Prepare all documents before starting</p>
                  <p>• <strong>Be specific:</strong> Provide concrete examples and metrics</p>
                  <p>• <strong>Show impact:</strong> Quantify your climate adaptation benefits</p>
                  <p>• <strong>Stay focused:</strong> Keep responses relevant to climate adaptation</p>
                  <p>• <strong>Proofread:</strong> Review all sections before final submission</p>
                </div>
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  If you have questions about the application process or technical issues, 
                  our support team is here to help.
                </p>
                <ContactSupportButton />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/apply/form" className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg text-lg">
                  Start Application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function DocumentRequirement({ 
  title, 
  description, 
  format, 
  required 
}: { 
  title: string; 
  description: string; 
  format: string; 
  required: boolean; 
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {required && (
          <Badge variant="destructive" className="text-xs">Required</Badge>
        )}
      </div>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-xs text-gray-500">Format: {format}</p>
    </div>
  );
}

function ApplicationSection({ 
  step, 
  title, 
  description, 
  estimatedTime, 
  icon 
}: { 
  step: number; 
  title: string; 
  description: string; 
  estimatedTime: string; 
  icon: React.ReactNode; 
}) {
  return (
    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {step}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>~{estimatedTime}</span>
        </div>
      </div>
    </div>
  );
}

function SolutionCriteria({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: string; 
}) {
  return (
    <div className="p-4 border border-green-200 rounded-lg bg-green-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <h4 className="font-semibold text-gray-900">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
} 