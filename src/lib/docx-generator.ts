import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { ApplicationFormValues } from '@/components/apply/application-form';

interface DocumentGeneratorOptions {
  formData: ApplicationFormValues;
  applicantName: string;
  submissionDate: Date;
}

// Helper function to format values for display
const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return format(value, "PPP");
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "None selected";
  if (typeof value === "string" && value.trim() === "") return "Not provided";
  return String(value);
};

// Helper function to format country names
const formatCountryName = (country: string): string => {
  const countryMap: Record<string, string> = {
    'ghana': 'Ghana',
    'kenya': 'Kenya',
    'nigeria': 'Nigeria',
    'rwanda': 'Rwanda',
    'tanzania': 'Tanzania'
  };
  return countryMap[country] || country;
};

// Helper function to format education levels
const formatEducation = (education: string): string => {
  const educationMap: Record<string, string> = {
    'primary_school_and_below': 'Primary School and Below',
    'high_school': 'High School',
    'technical_college': 'Technical College',
    'undergraduate': 'Undergraduate',
    'postgraduate': 'Postgraduate'
  };
  return educationMap[education] || education;
};

// Helper function to create a section header
const createSectionHeader = (title: string, icon: string) => {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${icon} ${title}`,
        bold: true,
        size: 32,
        color: "2563EB"
      })
    ],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    alignment: AlignmentType.LEFT
  });
};

// Helper function to create a question-answer pair
const createQuestionAnswer = (question: string, answer: string) => {
  return [
    new Paragraph({
      children: [
        new TextRun({
          text: question,
          bold: true,
          size: 22,
          color: "374151"
        })
      ],
      spacing: { before: 200, after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: answer,
          size: 20,
          color: "1F2937"
        })
      ],
      spacing: { after: 200 },
      indent: { left: 360 }
    })
  ];
};

export async function generateApplicationDocx({ formData, applicantName, submissionDate }: DocumentGeneratorOptions) {
  // Create document sections
  const sections = [];

  // Document Header
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "YouthADAPT Challenge 2025",
          bold: true,
          size: 48,
          color: "1D4ED8"
        })
      ],
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Application Form",
          size: 32,
          color: "059669"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Applicant: ${applicantName}`,
          bold: true,
          size: 24
        })
      ],
      spacing: { after: 100 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Submission Date: ${format(submissionDate, "PPP")}`,
          size: 22,
          color: "6B7280"
        })
      ],
      spacing: { after: 600 }
    })
  );

  // Personal Information Section
  sections.push(createSectionHeader("Personal Information", "👤"));
  
  sections.push(...createQuestionAnswer("First Name", formatValue(formData.personal?.firstName)));
  sections.push(...createQuestionAnswer("Last Name", formatValue(formData.personal?.lastName)));
  sections.push(...createQuestionAnswer("Gender", formatValue(formData.personal?.gender)));
  sections.push(...createQuestionAnswer("Date of Birth", formatValue(formData.personal?.dateOfBirth)));
  sections.push(...createQuestionAnswer("Email Address", formatValue(formData.personal?.email)));
  sections.push(...createQuestionAnswer("Phone Number", formatValue(formData.personal?.phoneNumber)));
  sections.push(...createQuestionAnswer("Country of Citizenship", formatCountryName(formData.personal?.citizenship || "")));
  sections.push(...createQuestionAnswer("Country of Residence", formatCountryName(formData.personal?.countryOfResidence || "")));
  sections.push(...createQuestionAnswer("Highest Education Level", formatEducation(formData.personal?.highestEducation || "")));

  // Business Information Section
  sections.push(createSectionHeader("Business Information", "🏢"));
  
  sections.push(...createQuestionAnswer("Business Name", formatValue(formData.business?.name)));
  sections.push(...createQuestionAnswer("Business Start Date", formatValue(formData.business?.startDate)));
  sections.push(...createQuestionAnswer("Is Business Registered?", formatValue(formData.business?.isRegistered)));
  sections.push(...createQuestionAnswer("Business Country", formatCountryName(formData.business?.country || "")));
  sections.push(...createQuestionAnswer("Business City", formatValue(formData.business?.city)));
  sections.push(...createQuestionAnswer("Business Description", formatValue(formData.business?.description)));
  sections.push(...createQuestionAnswer("Problem Your Business Solves", formatValue(formData.business?.problemSolved)));
  sections.push(...createQuestionAnswer("Climate Adaptation Contribution", formatValue(formData.business?.climateAdaptationContribution)));
  sections.push(...createQuestionAnswer("Product/Service Description", formatValue(formData.business?.productServiceDescription)));
  sections.push(...createQuestionAnswer("Climate Extreme Impact", formatValue(formData.business?.climateExtremeImpact)));
  sections.push(...createQuestionAnswer("Current Challenges", formatValue(formData.business?.currentChallenges)));
  sections.push(...createQuestionAnswer("Support Needed", formatValue(formData.business?.supportNeeded)));

  // Employee Information
  if (formData.business?.fullTimeEmployeesTotal || formData.business?.partTimeEmployeesMale || formData.business?.partTimeEmployeesFemale) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Employee Information",
            bold: true,
            size: 26,
            color: "374151"
          })
        ],
        spacing: { before: 400, after: 200 }
      })
    );
    
    sections.push(...createQuestionAnswer("Full-time Employees (Total)", formatValue(formData.business?.fullTimeEmployeesTotal)));
    sections.push(...createQuestionAnswer("Full-time Employees (Male)", formatValue(formData.business?.fullTimeEmployeesMale)));
    sections.push(...createQuestionAnswer("Full-time Employees (Female)", formatValue(formData.business?.fullTimeEmployeesFemale)));
    sections.push(...createQuestionAnswer("Part-time Employees (Male)", formatValue(formData.business?.partTimeEmployeesMale)));
    sections.push(...createQuestionAnswer("Part-time Employees (Female)", formatValue(formData.business?.partTimeEmployeesFemale)));
  }

  // Funding Information
  if (formData.business?.funding?.hasExternalFunding) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Funding Information",
            bold: true,
            size: 26,
            color: "374151"
          })
        ],
        spacing: { before: 400, after: 200 }
      })
    );
    
    sections.push(...createQuestionAnswer("Has External Funding", formatValue(formData.business?.funding?.hasExternalFunding)));
    sections.push(...createQuestionAnswer("Funding Source", formatValue(formData.business?.funding?.fundingSource)));
    sections.push(...createQuestionAnswer("Funder Name", formatValue(formData.business?.funding?.funderName)));
    sections.push(...createQuestionAnswer("Funding Amount (USD)", formatValue(formData.business?.funding?.amountUsd)));
    sections.push(...createQuestionAnswer("Funding Date", formatValue(formData.business?.funding?.fundingDate)));
    sections.push(...createQuestionAnswer("Funding Instrument", formatValue(formData.business?.funding?.fundingInstrument)));
  }

  // Climate Adaptation Solution Section
  if (formData.adaptation) {
    sections.push(createSectionHeader("Climate Adaptation Solution", "🌍"));
    
    sections.push(...createQuestionAnswer("Solution Title", formatValue(formData.adaptation?.solutionTitle)));
    sections.push(...createQuestionAnswer("Solution Description", formatValue(formData.adaptation?.solutionDescription)));
    sections.push(...createQuestionAnswer("Primary Climate Challenge", formatValue(formData.adaptation?.primaryChallenge)));
    sections.push(...createQuestionAnswer("Target Beneficiaries", formatValue(formData.adaptation?.targetBeneficiaries)));
    sections.push(...createQuestionAnswer("Technology Description", formatValue(formData.adaptation?.technologyDescription)));
    sections.push(...createQuestionAnswer("Innovation Approach", formatValue(formData.adaptation?.innovationDescription)));
  }

  // Financial Information Section
  if (formData.financial) {
    sections.push(createSectionHeader("Financial Information", "💰"));
    
    sections.push(...createQuestionAnswer("Annual Revenue (USD)", formatValue(formData.financial?.annualRevenue)));
    sections.push(...createQuestionAnswer("Revenue Growth Rate (%)", formatValue(formData.financial?.revenueGrowthRate)));
    sections.push(...createQuestionAnswer("Profit Margin (%)", formatValue(formData.financial?.profitMargin)));
    sections.push(...createQuestionAnswer("Previously Received Funding", formatValue(formData.financial?.previousFunding)));
    sections.push(...createQuestionAnswer("Previous Funding Amount (USD)", formatValue(formData.financial?.previousFundingAmount)));
    sections.push(...createQuestionAnswer("Requested Funding Amount (USD)", formatValue(formData.financial?.requestedFundingAmount)));
    sections.push(...createQuestionAnswer("Use of Funds", formatValue(formData.financial?.fundingUse)));
    sections.push(...createQuestionAnswer("Revenue Model", formatValue(formData.financial?.revenueModel)));
    sections.push(...createQuestionAnswer("Cost Structure", formatValue(formData.financial?.costStructure)));
    sections.push(...createQuestionAnswer("Path to Sustainability", formatValue(formData.financial?.pathToSustainability)));
    sections.push(...createQuestionAnswer("Financial Challenges", formatValue(formData.financial?.financialChallenges)));
  }

  // Support Needs Section
  if (formData.support) {
    sections.push(createSectionHeader("Support Needs", "🤝"));
    
    sections.push(...createQuestionAnswer("Support Types Needed", formatValue(formData.support?.supportTypes)));
    sections.push(...createQuestionAnswer("Mentorship Needs", formatValue(formData.support?.mentorshipNeeds)));
    sections.push(...createQuestionAnswer("Training Needs", formatValue(formData.support?.trainingNeeds)));
    sections.push(...createQuestionAnswer("Networking Needs", formatValue(formData.support?.networkingNeeds)));
    sections.push(...createQuestionAnswer("Expected Business Impact", formatValue(formData.support?.expectedBusinessImpact)));
    sections.push(...createQuestionAnswer("Expected Environmental Impact", formatValue(formData.support?.expectedEnvironmentalImpact)));
  }

  // Footer
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "End of Application",
          size: 20,
          italics: true,
          color: "6B7280"
        })
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 800, after: 200 }
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on ${format(new Date(), "PPP 'at' p")}`,
          italics: true,
          size: 18,
          color: "9CA3AF"
        })
      ],
      alignment: AlignmentType.CENTER
    })
  );

  // Create the document
  const doc = new Document({
    sections: [{
      properties: {},
      children: sections
    }]
  });

  // Generate and download the document
  const blob = await Packer.toBlob(doc);
  const fileName = `YouthADAPT-Application-${applicantName.replace(/\s+/g, '-')}-${format(submissionDate, 'yyyy-MM-dd')}.docx`;
  
  saveAs(blob, fileName);
} 