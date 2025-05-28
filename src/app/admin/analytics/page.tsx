"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  FileText,
  Award,
  Globe
} from "lucide-react";
import { getAnalyticsData, exportAnalyticsData, type AnalyticsFilters, type AnalyticsData } from "@/lib/actions/actions";

// Custom color palette for better visual appeal
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  warning: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6'
};

const PIE_COLORS = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.accent, CHART_COLORS.warning, CHART_COLORS.purple];

// Custom tooltip components for better data display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{data.gender || data.education || data.country || data.status}</p>
        <p className="text-sm text-gray-600">Count: {data.count}</p>
        <p className="text-sm text-gray-600">Percentage: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateFrom: "",
    dateTo: "",
    country: "all",
    gender: "all",
    status: "all",
    isEligible: "all",
    ageRange: "all",
    educationLevel: "all",
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getAnalyticsData(filters);
      if (result.success && result.data) {
        setAnalyticsData(result.data);
      } else {
        setError(result.error || "Failed to load analytics data");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = async () => {
    await loadAnalyticsData();
  };

  const exportData = async () => {
    try {
      const result = await exportAnalyticsData(filters);
      if (result.success && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename || 'analytics_export.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Export failed:", result.error);
      }
    } catch (err) {
      console.error("Error exporting data:", err);
    }
  };

  // Updated quick report functions to show modal first
  const handleReportClick = (reportConfig: {
    title: string;
    description: string;
    action: () => Promise<void>;
  }) => {
    setSelectedReport(reportConfig);
    setShowExportModal(true);
  };

  const handleConfirmExport = async () => {
    if (selectedReport) {
      setShowExportModal(false);
      await selectedReport.action();
      setSelectedReport(null);
    }
  };

  const handleCancelExport = () => {
    setShowExportModal(false);
    setSelectedReport(null);
  };

  // Quick report functions
  const generateFemaleApplicantsReport = async () => {
    const femaleFilters = { ...filters, gender: "female" };
    const result = await exportAnalyticsData(femaleFilters);
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `female_applicants_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const generateCountryAnalysisReport = async () => {
    // Generate a report for each focus country
    const countries = ['ghana', 'kenya', 'nigeria', 'rwanda', 'tanzania'];
    for (const country of countries) {
      const countryFilters = { ...filters, country };
      const result = await exportAnalyticsData(countryFilters);
      if (result.success && result.data) {
        const blob = new Blob([result.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${country}_analysis_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    }
  };

  const generateTopPerformersReport = async () => {
    const eligibleFilters = { ...filters, isEligible: "true" };
    const result = await exportAnalyticsData(eligibleFilters);
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `top_performers_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const generateRevenueAnalysisReport = async () => {
    // Export all data for revenue analysis
    const result = await exportAnalyticsData(filters);
    if (result.success && result.data) {
      const blob = new Blob([result.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue_analysis_report_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-lg font-medium text-gray-700">Loading analytics data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-lg text-red-600 font-medium">Error: {error}</div>
              <Button onClick={loadAnalyticsData} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg font-medium text-gray-700">No data available</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into YouthAdapt Challenge applications
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={exportData}
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Report Generation
            </CardTitle>
            <CardDescription className="text-blue-100">
              Apply filters to generate specific reports and insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm font-medium text-gray-700">Date From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm font-medium text-gray-700">Date To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Country</Label>
                <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="rwanda">Rwanda</SelectItem>
                    <SelectItem value="tanzania">Tanzania</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Gender</Label>
                <Select value={filters.gender} onValueChange={(value) => handleFilterChange('gender', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Application Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Eligibility</Label>
                <Select value={filters.isEligible} onValueChange={(value) => handleFilterChange('isEligible', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select eligibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="true">Eligible Only</SelectItem>
                    <SelectItem value="false">Ineligible Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Age Range</Label>
                <Select value={filters.ageRange} onValueChange={(value) => handleFilterChange('ageRange', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="18-24">18-24 years</SelectItem>
                    <SelectItem value="25-29">25-29 years</SelectItem>
                    <SelectItem value="30-34">30-34 years</SelectItem>
                    <SelectItem value="35+">35+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Education Level</Label>
                <Select value={filters.educationLevel} onValueChange={(value) => handleFilterChange('educationLevel', value)}>
                  <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="technical_college">Technical College</SelectItem>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={applyFilters} 
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? "Applying..." : "Apply Filters"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setFilters({
                  dateFrom: "",
                  dateTo: "",
                  country: "all",
                  gender: "all",
                  status: "all",
                  isEligible: "all",
                  ageRange: "all",
                  educationLevel: "all",
                })}
                className="border-gray-300 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalApplications}</div>
              <p className="text-xs text-blue-100">
                {analyticsData.overview.eligibleApplications} eligible ({analyticsData.overview.totalApplications > 0 ? Math.round((analyticsData.overview.eligibleApplications / analyticsData.overview.totalApplications) * 100) : 0}%)
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Female Applicants</CardTitle>
              <Users className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.femaleApplicants}</div>
              <p className="text-xs text-purple-100">
                {analyticsData.overview.totalApplications > 0 ? Math.round((analyticsData.overview.femaleApplicants / analyticsData.overview.totalApplications) * 100) : 0}% of total applicants
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
              <p className="text-xs text-green-100">
                Combined revenue from all businesses
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Age</CardTitle>
              <Calendar className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.averageAge} years</div>
              <p className="text-xs text-orange-100">
                {analyticsData.overview.totalEmployees} total employees across all businesses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demographics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.demographics.genderDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ gender, percentage }) => `${gender} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.demographics.genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Age Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.demographics.ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="ageRange" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.secondary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <MapPin className="h-5 w-5 text-purple-600" />
                Country Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.demographics.countryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="country" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.purple} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Award className="h-5 w-5 text-orange-600" />
                Education Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.demographics.educationDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ education, percentage }) => `${education} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analyticsData.demographics.educationDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Business Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <DollarSign className="h-5 w-5 text-green-600" />
                Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.business.revenueDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.accent} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="h-5 w-5 text-indigo-600" />
                Employment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.business.employmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill={CHART_COLORS.indigo} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Evaluation Scores */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Average Evaluation Scores
            </CardTitle>
            <CardDescription>
              Average scores across all evaluated applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {Object.entries(analyticsData.evaluation.averageScores).map(([key, value], index) => (
                <div key={key} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600">{value}</div>
                  <div className="text-xs text-gray-600 capitalize mt-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <LineChartIcon className="h-5 w-5 text-purple-600" />
              Application Timeline
            </CardTitle>
            <CardDescription>
              Monthly application trends over the last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analyticsData.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={3} 
                  name="Total Applications"
                  dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="eligible" 
                  stroke={CHART_COLORS.secondary} 
                  strokeWidth={3} 
                  name="Eligible Applications"
                  dot={{ fill: CHART_COLORS.secondary, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="femaleApplicants" 
                  stroke={CHART_COLORS.pink} 
                  strokeWidth={3} 
                  name="Female Applicants"
                  dot={{ fill: CHART_COLORS.pink, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Reports */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 border-2 border-transparent rounded-xl bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 opacity-10 blur-xl"></div>
          <div className="absolute inset-0 border border-transparent rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-20 blur-md"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-green-600" />
              Quick Reports
            </CardTitle>
            <CardDescription>
              Generate specific reports with one click
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3 border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 relative overflow-hidden"
                onClick={() => handleReportClick({
                  title: "Female Applicants Report",
                  description: "This report will export data for all female-led enterprises including personal information, business details, evaluation scores, and eligibility status. The export will include applicant names, contact information, business metrics, and performance data.",
                  action: generateFemaleApplicantsReport
                })}
              >
                <div className="absolute inset-0 border-2 border-transparent rounded-md bg-gradient-to-r from-purple-400 to-indigo-400 opacity-10 blur-md"></div>
                <Users className="h-8 w-8 text-purple-600 relative z-10" />
                <span className="font-medium text-gray-800 relative z-10">Female Applicants Report</span>
                <span className="text-xs text-gray-600 text-center relative z-10">Export all female-led enterprises data</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 relative overflow-hidden"
                onClick={() => handleReportClick({
                  title: "Country Analysis Report",
                  description: "This will generate separate CSV files for each focus country (Ghana, Kenya, Nigeria, Rwanda, Tanzania). Each file will contain comprehensive data for applicants from that specific country including demographics, business information, and evaluation results.",
                  action: generateCountryAnalysisReport
                })}
              >
                <div className="absolute inset-0 border-2 border-transparent rounded-md bg-gradient-to-r from-blue-400 to-teal-400 opacity-10 blur-md"></div>
                <Globe className="h-8 w-8 text-blue-600 relative z-10" />
                <span className="font-medium text-gray-800 relative z-10">Country Analysis</span>
                <span className="text-xs text-gray-600 text-center relative z-10">Applications breakdown by country</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 relative overflow-hidden"
                onClick={() => handleReportClick({
                  title: "Top Performers Report",
                  description: "This report exports data for all eligible applications that passed the evaluation criteria. It includes detailed evaluation scores, business performance metrics, and applicant information for the highest-scoring candidates.",
                  action: generateTopPerformersReport
                })}
              >
                <div className="absolute inset-0 border-2 border-transparent rounded-md bg-gradient-to-r from-green-400 to-emerald-400 opacity-10 blur-md"></div>
                <Award className="h-8 w-8 text-green-600 relative z-10" />
                <span className="font-medium text-gray-800 relative z-10">Top Performers</span>
                <span className="text-xs text-gray-600 text-center relative z-10">Highest scoring eligible applications</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-6 flex flex-col items-center gap-3 border-orange-200 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 relative overflow-hidden"
                onClick={() => handleReportClick({
                  title: "Revenue Analysis Report",
                  description: "This comprehensive report includes detailed financial data for all businesses including revenue figures, employee counts, funding history, unit pricing, customer metrics, and business registration information.",
                  action: generateRevenueAnalysisReport
                })}
              >
                <div className="absolute inset-0 border-2 border-transparent rounded-md bg-gradient-to-r from-orange-400 to-amber-400 opacity-10 blur-md"></div>
                <DollarSign className="h-8 w-8 text-orange-600 relative z-10" />
                <span className="font-medium text-gray-800 relative z-10">Revenue Analysis</span>
                <span className="text-xs text-gray-600 text-center relative z-10">Business revenue breakdown report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Confirmation Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-600" />
              Confirm Export
            </DialogTitle>
            <DialogDescription className="text-left">
              {selectedReport?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">What will be exported:</h4>
              <p className="text-sm text-blue-800">
                {selectedReport?.description}
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> This export may contain sensitive personal and business information. 
                Please ensure you have proper authorization and follow data protection guidelines.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelExport}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmExport}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Continue Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 