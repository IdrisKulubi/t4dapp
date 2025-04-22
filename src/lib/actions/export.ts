"use server";

import { stringify } from 'csv-stringify/sync';
import db from "../../../db/drizzle";
import { applications, businesses, applicants, eligibilityResults } from "../../../db/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

type ExportFormat = 'csv' | 'json';
type ExportType = 'applications' | 'applicants' | 'eligibility';

interface ExportOptions {
  type: ExportType;
  format: ExportFormat;
  filters?: {
    status?: string[];
    country?: string[];
    isEligible?: boolean;
    submittedAfter?: Date;
    submittedBefore?: Date;
  };
  useApi?: boolean; // Use the API endpoint for large datasets
}

export async function exportData({
  type,
  format = 'csv',
  filters = {},
  useApi = false
}: ExportOptions): Promise<{ 
  success: boolean; 
  data?: string; 
  fileName?: string; 
  error?: string;
  apiUrl?: string; // For redirecting to the API for large datasets
}> {
  try {
    // For large datasets or when explicitly requested, use the API endpoint
    if (useApi) {
      const apiUrl = `/api/export?timestamp=${Date.now()}`;
      return {
        success: true,
        apiUrl,
      };
    }

    let data: any[] = [];
    let fileName = `${type}_export_${new Date().toISOString().split('T')[0]}`;

    // Get the data based on export type
    switch (type) {
      case 'applications':
        data = await getApplicationsExportData(filters);
        break;
      case 'applicants':
        data = await getApplicantsExportData(filters);
        break;
      case 'eligibility':
        data = await getEligibilityExportData(filters);
        break;
      default:
        return {
          success: false,
          error: `Unsupported export type: ${type}`,
        };
    }

    // Check if dataset is too large (>1000 records) and suggest API endpoint
    if (data.length > 1000) {
      return {
        success: true,
        apiUrl: `/api/export?timestamp=${Date.now()}`,
      };
    }

    // Convert data to requested format
    let formattedData: string;
    if (format === 'csv') {
      // For CSV, we need to convert the data to a flat structure
      const flattenedData = data.map(item => flattenObject(item));
      formattedData = stringify(flattenedData, { header: true });
      fileName += '.csv';
    } else {
      // JSON format
      formattedData = JSON.stringify(data, null, 2);
      fileName += '.json';
    }

    return {
      success: true,
      data: formattedData,
      fileName,
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    return {
      success: false,
      error: 'Failed to export data. Please try again.',
    };
  }
}

// Helper function to flatten nested objects for CSV export
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const propName = prefix ? `${prefix}_${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], propName));
    } else if (Array.isArray(obj[key])) {
      // For arrays, join values with commas
      acc[propName] = obj[key].join(', ');
    } else if (obj[key] instanceof Date) {
      // Format dates
      acc[propName] = obj[key].toISOString();
    } else {
      acc[propName] = obj[key];
    }
    
    return acc;
  }, {});
}

async function getApplicationsExportData(filters: ExportOptions['filters'] = {}) {
  // Build query filters
  const queryFilters = [];
  
  if (filters.status && filters.status.length > 0) {
    queryFilters.push(inArray(applications.status, filters.status as any[]));
  }
  
  if (filters.submittedAfter) {
    queryFilters.push(applications.submittedAt >= filters.submittedAfter);
  }
  
  if (filters.submittedBefore) {
    queryFilters.push(applications.submittedAt <= filters.submittedBefore);
  }
  
  // Fetch applications with business and applicant data
  const applicationData = await db.query.applications.findMany({
    where: queryFilters.length ? and(...queryFilters) : undefined,
    orderBy: [desc(applications.updatedAt)],
    with: {
      business: {
        with: {
          applicant: true,
        },
      },
      eligibilityResults: true,
    },
  });
  
  // Apply country filters if any
  let filteredData = applicationData;
  if (filters.country && filters.country.length > 0) {
    filteredData = applicationData.filter(app => 
      filters.country!.includes(app.business.country)
    );
  }
  
  // Apply eligibility filters if any
  if (filters.isEligible !== undefined) {
    filteredData = filteredData.filter(app => {
      const eligibility = app.eligibilityResults[0];
      return eligibility ? eligibility.isEligible === filters.isEligible : false;
    });
  }
  
  return filteredData;
}

async function getApplicantsExportData(filters: ExportOptions['filters'] = {}) {
  // For applicants, we'll fetch the data with their businesses
  const applicantData = await db.query.applicants.findMany({
    with: {
      businesses: true,
    },
    orderBy: [desc(applicants.updatedAt)],
  });
  
  // Apply country filters if any
  let filteredData = applicantData;
  if (filters.country && filters.country.length > 0) {
    filteredData = applicantData.filter(applicant => 
      filters.country!.includes(applicant.countryOfResidence)
    );
  }
  
  return filteredData;
}

async function getEligibilityExportData(filters: ExportOptions['filters'] = {}) {
  // Build query filters
  const queryFilters = [];
  
  if (filters.isEligible !== undefined) {
    queryFilters.push(eq(eligibilityResults.isEligible, filters.isEligible));
  }
  
  // Fetch eligibility results with application data
  const eligibilityData = await db.query.eligibilityResults.findMany({
    where: queryFilters.length ? and(...queryFilters) : undefined,
    orderBy: [desc(eligibilityResults.updatedAt)],
    with: {
      application: {
        with: {
          business: {
            with: {
              applicant: true,
            },
          },
        },
      },
    },
  });
  
  // Apply status filters if any
  let filteredData = eligibilityData;
  if (filters.status && filters.status.length > 0) {
    filteredData = eligibilityData.filter(result => 
      filters.status!.includes(result.application.status)
    );
  }
  
  // Apply country filters if any
  if (filters.country && filters.country.length > 0) {
    filteredData = filteredData.filter(result => 
      filters.country!.includes(result.application.business.country)
    );
  }
  
  return filteredData;
} 