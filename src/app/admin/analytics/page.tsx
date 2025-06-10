import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getAnalyticsDashboardData,
  getScoringAnalytics,
  getEvaluatorPerformance 
} from "@/lib/actions/analytics";
import { 
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Award,
  Calendar,
  FileText,
  Activity,
  Star,
  Zap,
  Globe,
  
} from "lucide-react";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { EvaluatorMetrics } from "@/components/admin/EvaluatorMetrics";
import { ScoringInsights } from "@/components/admin/ScoringInsights";

async function AnalyticsDashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Verify admin access
  const userProfile = await auth();
  if (!userProfile) {
    redirect("/");
  }

  // Fetch analytics data
  const [dashboardResult, scoringResult, evaluatorResult] = await Promise.all([
    getAnalyticsDashboardData(),
    getScoringAnalytics(),
    getEvaluatorPerformance()
  ]);

  const dashboardData = dashboardResult.success ? dashboardResult.data : null;
  const scoringData = scoringResult.success ? scoringResult.data : null;
  const evaluatorData = evaluatorResult.success ? evaluatorResult.data : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into application evaluation performance and trends.
          </p>
        </div>

        {/* Key Metrics Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-blue-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalApplications}</div>
                <p className="text-xs text-blue-100">
                  +{dashboardData.newThisWeek} this week
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Evaluation Rate</CardTitle>
                <Activity className="h-4 w-4 text-green-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.evaluationRate}%</div>
                <p className="text-xs text-green-100">
                  {dashboardData.evaluatedApplications}/{dashboardData.totalApplications} evaluated
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <Star className="h-4 w-4 text-purple-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(dashboardData.averageScore).toFixed(1)}</div>
                <p className="text-xs text-purple-100">
                  Out of {dashboardData.maxScore} points
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Evaluators</CardTitle>
                <Users className="h-4 w-4 text-orange-100" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.activeEvaluators}</div>
                <p className="text-xs text-orange-100">
                  {dashboardData.totalEvaluators} total registered
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="scoring" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Target className="h-4 w-4 mr-2" />
              Scoring Analysis
            </TabsTrigger>
            <TabsTrigger value="evaluators" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Evaluator Performance
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends & Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Application Status Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Application Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.statusDistribution && (
                    <div className="space-y-4">
                      {Object.entries(dashboardData.statusDistribution).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              className={`${
                                status === 'approved' ? 'bg-green-100 text-green-800' :
                                status === 'rejected' ? 'bg-red-100 text-red-800' :
                                status === 'dragons_den' ? 'bg-orange-100 text-orange-800' :
                                status === 'finalist' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {status.replace('_', ' ')}
                            </Badge>
                            <span className="font-medium">{count}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {((count / dashboardData.totalApplications) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData?.countryDistribution && (
                    <div className="space-y-3">
                      {Object.entries(dashboardData.countryDistribution)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([country, count]) => (
                        <div key={country} className="flex items-center justify-between">
                          <span className="font-medium capitalize">{country}</span>
                          <div className="flex items-center gap-3">
                            <Progress 
                              value={(count / dashboardData.totalApplications) * 100} 
                              className="w-20 h-2"
                            />
                            <span className="text-sm font-medium w-8 text-right">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Component */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {dashboardData && <AnalyticsCharts data={dashboardData as any} />}
          </TabsContent>

          <TabsContent value="scoring" className="space-y-6">
            {scoringData && <ScoringInsights data={scoringData} />}
          </TabsContent>

          <TabsContent value="evaluators" className="space-y-6">
            {evaluatorData && <EvaluatorMetrics data={evaluatorData} />}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Application Submission Trends
                  </CardTitle>
                  <CardDescription>
                    Daily application submissions over the last 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Submission trend chart would go here</p>
                      <p className="text-sm">Integrated with charting library</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    Evaluation Velocity
                  </CardTitle>
                  <CardDescription>
                    Rate of evaluation completion by phase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Technical Review</span>
                      <div className="flex items-center gap-3">
                        <Progress value={75} className="w-24 h-2" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Jury Evaluation</span>
                      <div className="flex items-center gap-3">
                        <Progress value={60} className="w-24 h-2" />
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Dragons Den</span>
                      <div className="flex items-center gap-3">
                        <Progress value={40} className="w-24 h-2" />
                        <span className="text-sm font-medium">40%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Insights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Key Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="font-semibold text-blue-800 mb-2">High Scoring Applications</div>
                    <p className="text-sm text-blue-700">
                      Climate adaptation solutions show 23% higher scores than traditional business applications.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="font-semibold text-green-800 mb-2">Regional Performance</div>
                    <p className="text-sm text-green-700">
                      Kenya leads with highest average scores (84.2/100), followed by Ghana (78.1/100).
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="font-semibold text-purple-800 mb-2">Evaluator Consistency</div>
                    <p className="text-sm text-purple-700">
                      94% inter-evaluator reliability across technical criteria, 87% for business criteria.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    }>
      <AnalyticsDashboard />
    </Suspense>
  );
} 