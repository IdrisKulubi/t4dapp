import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplicationStats } from "@/lib/actions/actions";

export default async function AdminDashboard() {
  // Fetch real stats from the database
  const statsResult = await getApplicationStats();
  
  // Set default stats if fetch fails
  const stats = statsResult.success ? statsResult.data : {
    totalApplications: 0,
    eligibleApplications: 0,
    pendingReview: 0,
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/admin/applications">View All Applications</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <CardDescription>
              All submitted applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Eligible Applications
            </CardTitle>
            <CardDescription>
              Meeting all mandatory criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.eligibleApplications}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <CardDescription>
              Applications awaiting evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingReview}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/applications">Review Applications</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/applications?status=eligible">View Eligible Candidates</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/export">Export Data</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Program Statistics</CardTitle>
            <CardDescription>
              Overview of application distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.totalApplications && stats.totalApplications > 0 ? (
              <div className="h-60 flex flex-col gap-4">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        Eligible Applications
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {stats?.eligibleApplications != null && stats?.totalApplications ? Math.round((stats.eligibleApplications / stats.totalApplications) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="flex flex-col justify-center bg-green-500 rounded-full"
                      style={{ width: `${stats?.eligibleApplications != null && stats?.totalApplications ? (stats.eligibleApplications / stats.totalApplications) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        Pending Review
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        {stats?.pendingReview != null && stats?.totalApplications ? Math.round((stats.pendingReview / stats.totalApplications) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="flex h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="flex flex-col justify-center bg-amber-500 rounded-full"
                      style={{ width: `${stats?.pendingReview != null && stats?.totalApplications ? (stats.pendingReview / stats.totalApplications) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Statistics will be displayed here once applications are received.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 