import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apply | YouthAdapt Challenge",
  description: "Application form for the In-country YouthAdapt Challenge program",
};

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Application Form</h1>
        <p className="text-muted-foreground">
          Complete all sections of the application form to submit your business for consideration in the 
          YouthAdapt Challenge program.
        </p>
      </div>
      
      {children}
    </div>
  );
} 