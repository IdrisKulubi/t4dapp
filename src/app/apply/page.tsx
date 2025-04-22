import { ApplicationForm } from "@/components/apply/application-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Start Your Application</CardTitle>
        <CardDescription>
          Follow the steps below to complete your application for the YouthAdapt Challenge.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicationForm />
      </CardContent>
    </Card>
  );
} 