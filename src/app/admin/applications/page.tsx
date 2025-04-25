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
import { getApplications } from "@/lib/actions/actions";
import { Eye } from "lucide-react";

// Map status to badge color
const statusColors: Record<string, string> = {
  draft: "bg-gray-200 text-gray-800",
  submitted: "bg-blue-200 text-blue-800",
  under_review: "bg-yellow-200 text-yellow-800",
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
};

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  // Wait for searchParams to be available
  const params = await searchParams;
  
  // Parse search parameters
  const status = params.status || "all";
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const limit = 10; // Items per page
  
  // Fetch applications with filters
  const result = await getApplications({
    status,
    search,
    page,
    limit,
  });
  
  // Get applications or empty array if fetch failed
  const applications = result.success ? result.data : [];
  const pagination = result.success ? result.pagination : { total: 0, page: 1, limit: 10, pages: 1 };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/export">Export Data</Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Applications</CardTitle>
          <CardDescription>
            Use the filters below to find specific applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/admin/applications" method="GET">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select defaultValue={status} name="status">
                  <SelectTrigger>
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
                <label className="text-sm font-medium mb-2 block">Search</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, business, or location"
                    defaultValue={search}
                    name="search"
                  />
                  <Button type="submit">Search</Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            Showing {applications?.length || 0} of {pagination?.total || 0} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Eligibility</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications?.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>
                        {`${app.business.applicant.firstName} ${app.business.applicant.lastName}`}
                      </TableCell>
                      <TableCell>{app.business.name}</TableCell>
                      <TableCell>{app.business.country}</TableCell>
                      <TableCell>
                        {app.submittedAt ? format(new Date(app.submittedAt), 'PPP') : 'Not submitted'}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[app.status] || "bg-gray-200 text-gray-800"}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.eligibilityResults.length > 0 ? (
                          <Badge className={app.eligibilityResults[0].isEligible ? 
                            "bg-green-200 text-green-800" : 
                            "bg-red-200 text-red-800"}>
                            {app.eligibilityResults[0].isEligible ? "Eligible" : "Ineligible"}
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-200 text-gray-800">
                            Not evaluated
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/applications/${app.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              {(pagination?.pages || 0) > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href={`/admin/applications?status=${status}&search=${search}&page=${page > 1 ? page - 1 : 1}`} 
                          aria-disabled={page <= 1}
                          className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: pagination?.pages || 0 }, (_, i) => i + 1)
                        .filter(p => Math.abs(p - page) < 2 || p === 1 || p === pagination?.pages)
                        .map((p, i, arr) => {
                          // Add ellipsis
                          if (i > 0 && p > arr[i - 1] + 1) {
                            return (
                              <PaginationItem key={`ellipsis-${p}`}>
                                <span className="px-4 py-2">...</span>
                              </PaginationItem>
                            );
                          }
                          
                          return (
                            <PaginationItem key={p}>
                              <PaginationLink
                                href={`/admin/applications?status=${status}&search=${search}&page=${p}`}
                                isActive={page === p}
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
                          className={page >= (pagination?.pages || 1) ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No applications found</p>
              <p className="text-sm text-muted-foreground">
                Applications will appear here once they are submitted.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 