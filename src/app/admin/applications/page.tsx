import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getApplications } from "@/lib/actions/actions";
import { getApplicationsByStatus, getApplicationStatusStats } from "@/lib/actions/application-status";
import { ApplicationStatusManager } from "@/components/admin/ApplicationStatusManager";
import { EvaluatorAssignmentManager } from "@/components/admin/EvaluatorAssignmentManager";
import { Eye, FileText, Users, TrendingUp, CheckCircle, XCircle, Clock, Search, Filter, Settings, UserCheck } from "lucide-react";
import { use } from 'react';

// Map status to badge color with modern styling
const statusColors: Record<string, string> = {
  draft: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300",
  submitted: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300",
  under_review: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300",
  approved: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300",
  rejected: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300",
};

export default function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string; tab?: string }>;
}) {
  // Wait for searchParams to be available
  const params = use(searchParams);
  
  // Parse search parameters
  const status = params.status || "all";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const tab = params.tab || "list";
  const limit = 10; // Items per page
  
  // Fetch applications with filters
  const result = use(getApplications({
    status,
    search,
    page,
    limit,
  }));
  
  // Fetch status statistics for the new status management view
  const statusStatsResult = use(getApplicationStatusStats());
  const statusStats = statusStatsResult.success ? statusStatsResult.data : null;
  
  // Fetch applications for status management (all applications without pagination for bulk operations)
  const allApplicationsResult = use(getApplicationsByStatus(undefined, 1, 100));
  const allApplications = allApplicationsResult.success ? allApplicationsResult.data?.applications : [];
  
  // Get applications or empty array if fetch failed
  const applications = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : { total: 0, page: 1, limit: 10, pages: 1 };

  // Calculate statistics
  const stats = {
    total: statusStats?.totalApplications || pagination?.total || 0,
    submitted: statusStats?.submitted || applications?.filter(app => app.status === 'submitted').length || 0,
    eligible: applications?.filter(app => app.eligibilityResults.length > 0 && app.eligibilityResults[0].isEligible).length || 0,
    underReview: statusStats?.under_review || applications?.filter(app => app.status === 'under_review').length || 0,
    shortlisted: statusStats?.shortlisted || 0,
    scoring_phase: statusStats?.scoring_phase || 0,
    dragons_den: statusStats?.dragons_den || 0,
    finalist: statusStats?.finalist || 0,
    approved: statusStats?.approved || 0,
    rejected: statusStats?.rejected || 0,
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Applications Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and review YouthAdapt Challenge applications
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              asChild
              className="border-blue-200 hover:bg-blue-50 hover:border-blue-300"
            >
              <Link href="/admin/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-300"
            >
              <Link href="/admin/export">
                <FileText className="h-4 w-4 mr-2" />
                Export Data
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <FileText className="h-4 w-4 text-blue-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-blue-100">Applications</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.submitted}</div>
              <p className="text-xs text-green-100">Ready for review</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Under Review</CardTitle>
              <Clock className="h-4 w-4 text-yellow-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.underReview}</div>
              <p className="text-xs text-yellow-100">Being evaluated</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <Users className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.shortlisted}</div>
              <p className="text-xs text-purple-100">Selected for scoring</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scoring</CardTitle>
              <Settings className="h-4 w-4 text-indigo-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scoring_phase}</div>
              <p className="text-xs text-indigo-100">Being scored</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dragons Den</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.dragons_den}</div>
              <p className="text-xs text-orange-100">Final pitch</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue={tab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Application List
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Status Management
            </TabsTrigger>
            <TabsTrigger value="assign" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Evaluator Assignment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Filters Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Applications
            </CardTitle>
            <CardDescription className="text-blue-100">
              Use the filters below to find specific applications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form action="/admin/applications" method="GET">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3">
                  <label className="text-sm font-medium mb-2 block text-gray-700">Status</label>
                  <Select defaultValue={status} name="status">
                    <SelectTrigger className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Applications</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="eligible">Eligible</SelectItem>
                      <SelectItem value="ineligible">Ineligible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full sm:w-2/3">
                  <label className="text-sm font-medium mb-2 block text-gray-700">Search</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by name, business, or location"
                      defaultValue={search}
                      name="search"
                      className="border-gray-200 text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <FileText className="h-5 w-5 text-blue-600" />
              Applications
            </CardTitle>
            <CardDescription>
              Showing {applications?.length || 0} of {pagination?.total || 0} applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-150">
                        <TableHead className="font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applicant</TableHead>
                        <TableHead className="font-semibold text-gray-700">Business</TableHead>
                        <TableHead className="font-semibold text-gray-700">Country</TableHead>
                        <TableHead className="font-semibold text-gray-700">Submitted</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Eligibility</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications?.map((app, index) => (
                        <TableRow 
                          key={app.id} 
                          className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                          }`}
                        >
                          <TableCell className="font-medium text-blue-600">#{app.id}</TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {`${app.business.applicant.firstName} ${app.business.applicant.lastName}`}
                          </TableCell>
                          <TableCell className="text-gray-700">{app.business.name}</TableCell>
                          <TableCell className="text-gray-700 capitalize">{app.business.country}</TableCell>
                          <TableCell className="text-gray-700">
                            {app.submittedAt ? format(new Date(app.submittedAt), 'PPP') : 'Not submitted'}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[app.status] || "bg-gray-200 text-gray-800"} font-medium`}>
                              {app.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.eligibilityResults.length > 0 ? (
                              <Badge className={`font-medium ${app.eligibilityResults[0].isEligible ? 
                                "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300" : 
                                "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300"}`}>
                                {app.eligibilityResults[0].isEligible ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Eligible
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Ineligible
                                  </>
                                )}
                              </Badge>
                            ) : (
                              <Badge className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300 font-medium">
                                <Clock className="h-3 w-3 mr-1" />
                                Not evaluated
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              asChild
                              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200"
                            >
                              <Link href={`/admin/applications/${app.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                              <span className="text-sm text-gray-700">  View</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Pagination */}
                {(pagination?.pages || 0) > 1 && (
                  <div className="mt-6 flex justify-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-2">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href={`/admin/applications?status=${status}&search=${search}&page=${page > 1 ? page - 1 : 1}`} 
                              aria-disabled={page <= 1}
                              className={`${page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"} transition-all duration-200`}
                            />
                          </PaginationItem>
                          
                          {Array.from({ length: pagination?.pages || 0 }, (_, i) => i + 1)
                            .filter(p => Math.abs(p - page) < 2 || p === 1 || p === pagination?.pages)
                            .map((p, i, arr) => {
                              // Add ellipsis
                              if (i > 0 && p > arr[i - 1] + 1) {
                                return (
                                  <PaginationItem key={`ellipsis-${p}`}>
                                    <span className="px-4 py-2 text-gray-500">...</span>
                                  </PaginationItem>
                                );
                              }
                              
                              return (
                                <PaginationItem key={p}>
                                  <PaginationLink
                                    href={`/admin/applications?status=${status}&search=${search}&page=${p}`}
                                    isActive={page === p}
                                    className={`transition-all duration-200 ${
                                      page === p 
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent" 
                                        : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                                    }`}
                                  >
                                    {p}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                          
                          <PaginationItem>
                            <PaginationNext 
                              href={`/admin/applications?status=${status}&search=${search}&page=${page < (pagination?.pages || 1) ? page + 1 : (pagination?.pages || 1)}`}
                              aria-disabled={Boolean(page >= (pagination?.pages || 1))}
                              className={`${page >= (pagination?.pages || 1) ? "pointer-events-none opacity-50" : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"} transition-all duration-200`}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 mb-6">
                  <FileText className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No applications found</h3>
                <p className="text-gray-500 text-center max-w-md">
                  {search || status !== "all" 
                    ? "Try adjusting your filters or search terms to find applications."
                    : "Applications will appear here once they are submitted by applicants."
                  }
                </p>
                {(search || status !== "all") && (
                  <Button 
                    variant="outline" 
                    asChild 
                    className="mt-4 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Link href="/admin/applications">
                      Clear Filters
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <ApplicationStatusManager 
              applications={allApplications || []}
            />
          </TabsContent>

          <TabsContent value="assign" className="space-y-6">
            <EvaluatorAssignmentManager 
              applications={allApplications || []}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 