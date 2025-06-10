/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/db/drizzle";
import { 
  applications, 
  applicationScores, 
  scoringCriteria, 
  userProfiles,
  businesses,
  applicants
} from "../../../db/schema";
import { eq,  desc, sql, count, avg, sum, gte } from "drizzle-orm";
import { auth } from "@/auth";

// Get comprehensive dashboard analytics
export async function getAnalyticsDashboardData() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify admin access
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: "Admin access required" };
    }

    // Get basic statistics
    const [totalStats, statusStats, countryStats, weeklyStats, scoreStats] = await Promise.all([
      // Total applications and basic counts
      db.select({
        totalApplications: count(),
        evaluatedApplications: sql<number>`COUNT(CASE WHEN EXISTS(
          SELECT 1 FROM ${applicationScores} 
          WHERE ${applicationScores.applicationId} = ${applications.id}
        ) THEN 1 END)`.as('evaluatedApplications')
      }).from(applications),

      // Status distribution
      db.select({
        status: applications.status,
        count: count()
      })
      .from(applications)
      .groupBy(applications.status),

      // Country distribution - get from businesses table
      db.select({
        country: businesses.country,
        count: count()
      })
      .from(applications)
      .leftJoin(businesses, eq(applications.businessId, businesses.id))
      .where(sql`${businesses.country} IS NOT NULL`)
      .groupBy(businesses.country)
      .orderBy(desc(count())),

      // Applications from this week
      db.select({
        newThisWeek: count()
      })
      .from(applications)
      .where(gte(applications.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))),

      // Score statistics
      db.select({
        averageScore: avg(applicationScores.score),
        maxScore: sql<number>`MAX(sc.maxPoints)`.as('maxScore')
      })
      .from(applicationScores)
      .leftJoin(scoringCriteria, eq(applicationScores.criteriaId, scoringCriteria.id))
    ]);

    // Get evaluator statistics
    const evaluatorStats = await db.select({
      totalEvaluators: sql<number>`COUNT(DISTINCT ${userProfiles.id})`.as('totalEvaluators'),
      activeEvaluators: sql<number>`COUNT(DISTINCT CASE WHEN EXISTS(
        SELECT 1 FROM ${applicationScores} 
        WHERE ${applicationScores.evaluatedBy} = ${userProfiles.userId} 
        AND ${applicationScores.evaluatedAt} >= NOW() - INTERVAL '7 days'
      ) THEN ${userProfiles.id} END)`.as('activeEvaluators')
    })
    .from(userProfiles)
    .where(sql`${userProfiles.role} IN ('technical_reviewer', 'jury_member', 'dragons_den_judge')`);

    const basic = totalStats[0];
    const evaluators = evaluatorStats[0];
    const scores = scoreStats[0];
    const weekly = weeklyStats[0];

    // Convert status distribution to object
    const statusDistribution: Record<string, number> = {};
    statusStats.forEach((stat: any) => {
      statusDistribution[stat.status] = stat.count;
    });

    // Convert country distribution to object
    const countryDistribution: Record<string, number> = {};
    countryStats.forEach((stat: any) => {
      if (stat.country) {
        countryDistribution[stat.country] = stat.count;
      }
    });

    return {
      success: true,
      data: {
        totalApplications: basic.totalApplications,
        evaluatedApplications: basic.evaluatedApplications,
        evaluationRate: basic.totalApplications > 0 
          ? Math.round((basic.evaluatedApplications / basic.totalApplications) * 100) 
          : 0,
        newThisWeek: weekly.newThisWeek,
        averageScore: scores.averageScore || 0,
        maxScore: scores.maxScore || 100,
        totalEvaluators: evaluators.totalEvaluators,
        activeEvaluators: evaluators.activeEvaluators,
        statusDistribution,
        countryDistribution
      }
    };
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return { success: false, message: "Failed to fetch analytics" };
  }
}

// Get detailed scoring analytics
export async function getScoringAnalytics() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify admin access
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: "Admin access required" };
    }

    // Get scoring analytics by criteria
    const criteriaAnalytics = await db.select({
      criterionId: scoringCriteria.id,
      title: scoringCriteria.name,
      category: scoringCriteria.category,
      phase: sql<string>`'scoring'`.as('phase'), // Since phase doesn't exist in schema
      maxPoints: scoringCriteria.maxPoints,
      averageScore: avg(applicationScores.score),
      totalScores: count(applicationScores.score),
      minScore: sql<number>`MIN(${applicationScores.score})`.as('minScore'),
      maxScoreActual: sql<number>`MAX(${applicationScores.score})`.as('maxScoreActual')
    })
    .from(scoringCriteria)
    .leftJoin(applicationScores, eq(scoringCriteria.id, applicationScores.criteriaId))
    .groupBy(scoringCriteria.id, scoringCriteria.name, scoringCriteria.category, scoringCriteria.maxPoints)
    .orderBy(scoringCriteria.sortOrder);

    // Get score distribution by ranges
    const scoreDistribution = await db.select({
      phase: sql<string>`'scoring'`.as('phase'),
      scoreRange: sql<string>`
        CASE 
          WHEN ${applicationScores.score} < 20 THEN '0-19'
          WHEN ${applicationScores.score} < 40 THEN '20-39'
          WHEN ${applicationScores.score} < 60 THEN '40-59'
          WHEN ${applicationScores.score} < 80 THEN '60-79'
          ELSE '80-100'
        END
      `.as('scoreRange'),
      count: count()
    })
    .from(applicationScores)
    .leftJoin(scoringCriteria, eq(applicationScores.criteriaId, scoringCriteria.id))
    .groupBy(sql`scoreRange`)
    .orderBy(sql`scoreRange`);

    // Get top performing applications
    const topApplications = await db.select({
      applicationId: applications.id,
      businessName: businesses.name,
      applicantName: sql<string>`CONCAT(${applicants.firstName}, ' ', ${applicants.lastName})`.as('applicantName'),
      totalScore: sum(applicationScores.score),
      maxPossibleScore: sum(scoringCriteria.maxPoints),
      scoreCount: count(applicationScores.score)
    })
    .from(applications)
    .leftJoin(businesses, eq(applications.businessId, businesses.id))
    .leftJoin(applicants, eq(businesses.applicantId, applicants.id))
    .leftJoin(applicationScores, eq(applications.id, applicationScores.applicationId))
    .leftJoin(scoringCriteria, eq(applicationScores.criteriaId, scoringCriteria.id))
    .groupBy(applications.id, businesses.name, applicants.firstName, applicants.lastName)
    .having(sql`COUNT(${applicationScores.score}) > 0`)
    .orderBy(desc(sum(applicationScores.score)))
    .limit(10);

    return {
      success: true,
      data: {
        criteriaAnalytics: criteriaAnalytics.map((item: any) => ({
          ...item,
          averageScore: item.averageScore || 0,
          utilizationRate: item.maxPoints > 0 ? Math.round(((item.averageScore || 0) / item.maxPoints) * 100) : 0
        })),
        scoreDistribution,
        topApplications: topApplications.map((app: any) => ({
          ...app,
          totalScore: app.totalScore || 0,
          maxPossibleScore: app.maxPossibleScore || 0,
          percentage: app.maxPossibleScore > 0 ? Math.round(((app.totalScore || 0) / app.maxPossibleScore) * 100) : 0
        }))
      }
    };
  } catch (error) {
    console.error("Error fetching scoring analytics:", error);
    return { success: false, message: "Failed to fetch scoring analytics" };
  }
}

// Get evaluator performance metrics - simplified version based on actual schema
export async function getEvaluatorPerformance() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify admin access
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: "Admin access required" };
    }

    // Get evaluator performance statistics based on applicationScores
    const evaluatorPerformance = await db.select({
      evaluatorId: userProfiles.id,
      name: sql<string>`CONCAT(${userProfiles.firstName}, ' ', ${userProfiles.lastName})`.as('name'),
      email: userProfiles.email,
      role: userProfiles.role,
      totalAssignments: sql<number>`COUNT(DISTINCT ${applicationScores.applicationId})`.as('totalAssignments'),
      completedEvaluations: sql<number>`COUNT(DISTINCT CASE WHEN ${applicationScores.score} > 0 THEN ${applicationScores.applicationId} END)`.as('completedEvaluations'),
      averageScore: avg(applicationScores.score),
      totalScores: count(applicationScores.score),
      lastActivity: sql<Date>`MAX(${applicationScores.evaluatedAt})`.as('lastActivity')
    })
    .from(userProfiles)
    .leftJoin(applicationScores, eq(userProfiles.userId, applicationScores.evaluatedBy))
    .where(sql`${userProfiles.role} IN ('technical_reviewer', 'jury_member', 'dragons_den_judge')`)
    .groupBy(userProfiles.id, userProfiles.firstName, userProfiles.lastName, userProfiles.email, userProfiles.role)
    .orderBy(desc(sql`completedEvaluations`));

    return {
      success: true,
      data: {
        evaluators: evaluatorPerformance.map((evaluator: any) => ({
          ...evaluator,
          completionRate: evaluator.totalAssignments > 0 
            ? Math.round((evaluator.completedEvaluations / evaluator.totalAssignments) * 100) 
            : 0,
          averageScore: evaluator.averageScore || 0,
          averageDaysToComplete: 1, // Placeholder since we don't have assignment tracking
          consistency: { variance: 0, stdDev: 0 }, // Placeholder
          isActive: evaluator.lastActivity && 
            new Date(evaluator.lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        })),
        summary: {
          totalEvaluators: evaluatorPerformance.length,
          averageCompletionRate: evaluatorPerformance.length > 0 
            ? Math.round(evaluatorPerformance.reduce((sum: number, e: any) => 
                sum + (e.totalAssignments > 0 ? (e.completedEvaluations / e.totalAssignments) * 100 : 0), 0
              ) / evaluatorPerformance.length) 
            : 0,
          activeEvaluators: evaluatorPerformance.filter((e: any) => 
            e.lastActivity && new Date(e.lastActivity) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length
        }
      }
    };
  } catch (error) {
    console.error("Error fetching evaluator performance:", error);
    return { success: false, message: "Failed to fetch evaluator performance" };
  }
}

// Get time-series data for trends
export async function getTrendsData(days = 30) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify admin access
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, error: "Admin access required" };
    }

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Daily application submissions
    const dailySubmissions = await db.select({
      date: sql<string>`DATE(${applications.createdAt})`.as('date'),
      count: count()
    })
    .from(applications)
    .where(gte(applications.createdAt, startDate))
    .groupBy(sql`DATE(${applications.createdAt})`)
    .orderBy(sql`DATE(${applications.createdAt})`);

    // Daily evaluations completed
    const dailyEvaluations = await db.select({
      date: sql<string>`DATE(${applicationScores.evaluatedAt})`.as('date'),
      count: count()
    })
    .from(applicationScores)
    .where(gte(applicationScores.evaluatedAt, startDate))
    .groupBy(sql`DATE(${applicationScores.evaluatedAt})`)
    .orderBy(sql`DATE(${applicationScores.evaluatedAt})`);

    return {
      success: true,
      data: {
        dailySubmissions,
        dailyEvaluations,
        period: { days, startDate, endDate: new Date() }
      }
    };
  } catch (error) {
    console.error("Error fetching trends data:", error);
    return { success: false, message: "Failed to fetch trends data" };
  }
} 