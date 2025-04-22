"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

type ReviewSubmitFormProps = {
  form: any;
  onPrevious: () => void;
};

export function ReviewSubmitForm({ form, onPrevious }: ReviewSubmitFormProps) {
  const handleSubmit = async (data: any) => {
    console.log("Application Submission Data:", data);
    // TODO: Implement server action for form submission
    alert("Application submitted successfully!");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Review & Submit</h2>
        <p className="text-muted-foreground">
          Please review your application before submitting. You cannot edit after submission.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Application Summary</h3>
                  <p className="text-muted-foreground text-sm">
                    Please verify that all the information below is correct.
                  </p>
                </div>
                
                {/* This will be replaced with an actual summary of form data */}
                <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">
                    Application summary will be displayed here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm">
                I confirm that all information provided in this application is accurate, and I understand
                that providing false information may lead to disqualification.
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="updates"
                className="mt-1"
                required
              />
              <label htmlFor="updates" className="text-sm">
                I consent to receive updates about my application status and future opportunities related
                to the YouthAdapt Challenge program.
              </label>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onPrevious}>
              Previous: Support Needs
            </Button>
            <Button type="submit" variant="default">
              Submit Application
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 