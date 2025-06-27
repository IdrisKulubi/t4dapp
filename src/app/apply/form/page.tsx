import { auth } from "@/auth";
import { ApplicationForm } from "@/components/apply/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

export default async function ApplicationFormPage() {
  // Check if user is authenticated
  const session = await auth();
  
  if (!session?.user) {
    // User is not logged in - show login prompt
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
                You must be logged in to access the application form
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Link href="/login" className="w-full">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Continue
                </Button>
              </Link>
              
              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account? The login page will help you create one with Google.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // User is authenticated - show application form
  return <ApplicationForm />;
} 