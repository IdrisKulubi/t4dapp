"use server";

import { auth } from "@/auth";
import db from "@/db/drizzle";
import { 
  applications, 
  applicationScores, 
  scoringCriteria, 
  userProfiles,
  businesses,
  applicants
} from "@/db/schema";
import { eq, and, desc, sql, inArray } from "drizzle-orm";

// Get Dragon's Den applications for judges
export async function getDragonsDenApplications() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is a Dragon's Den judge
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'dragons_den_judge') {
      return { success: false, message: "Access denied. Dragons Den judge role required." };
    }

    // Get applications that have reached dragons_den status
    const dragonsDenApplications = await db
      .select({
        applicationId: applications.id,
        applicationStatus: applications.status,
        applicationCreatedAt: applications.createdAt,
        businessName: businesses.name,
        businessDescription: businesses.description,
        businessCity: businesses.city,
        businessCountry: businesses.country,
        businessStartDate: businesses.startDate,
        applicantFirstName: applicants.firstName,
        applicantLastName: applicants.lastName,
        applicantEmail: applicants.email,
        applicantGender: applicants.gender,
        applicantCitizenship: applicants.citizenship,
        applicantEducation: applicants.highestEducation,
        presentationScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category = 'Presentation' THEN as_dd.score ELSE 0 END), 0)`.as('presentationScore'),
        maxPresentationScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category = 'Presentation' THEN sc.maxPoints ELSE 0 END), 0)`.as('maxPresentationScore'),
        previousScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category != 'Presentation' THEN as_prev.score ELSE 0 END), 0)`.as('previousScore'),
        maxPreviousScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category != 'Presentation' THEN sc.maxPoints ELSE 0 END), 0)`.as('maxPreviousScore'),
        isEvaluated: sql<boolean>`EXISTS(
          SELECT 1 FROM ${applicationScores} as_check 
          JOIN ${scoringCriteria} sc_check ON as_check.criteriaId = sc_check.id 
          WHERE as_check.applicationId = ${applications.id} 
          AND sc_check.category = 'Presentation'
          AND as_check.evaluatedBy = ${userProfile.userId}
          AND as_check.score > 0
        )`.as('isEvaluated')
      })
      .from(applications)
      .leftJoin(businesses, eq(applications.businessId, businesses.id))
      .leftJoin(applicants, eq(businesses.applicantId, applicants.id))
      .leftJoin(applicationScores, and(
        eq(applicationScores.applicationId, applications.id),
        eq(applicationScores.evaluatedBy, userProfile.userId)
      ))
      .leftJoin(scoringCriteria, and(
        eq(sql`as_dd.criteriaId`, scoringCriteria.id),
        eq(scoringCriteria.category, 'Presentation')
      ))
      .leftJoin(applicationScores, and(
        eq(applicationScores.applicationId, applications.id),
        eq(applicationScores.evaluatedBy, userProfile.userId)
      ))
      .where(eq(applications.status, 'dragons_den'))
      .groupBy(
        applications.id, applications.status, applications.createdAt,
        businesses.name, businesses.description, businesses.city, businesses.country, businesses.startDate,
        applicants.firstName, applicants.lastName, applicants.email, applicants.gender, applicants.citizenship, applicants.highestEducation
      )
      .orderBy(desc(sql`previousScore + presentationScore`));

    return { 
      success: true, 
      data: dragonsDenApplications.map(app => ({
        application: {
          id: app.applicationId,
          status: app.applicationStatus,
          createdAt: app.applicationCreatedAt,
          business: {
            name: app.businessName,
            description: app.businessDescription,
            city: app.businessCity,
            country: app.businessCountry,
            startDate: app.businessStartDate,
            applicant: {
              firstName: app.applicantFirstName,
              lastName: app.applicantLastName,
              email: app.applicantEmail,
              gender: app.applicantGender,
              citizenship: app.applicantCitizenship,
              highestEducation: app.applicantEducation
            }
          }
        },
        dragonsDenScore: app.presentationScore,
        maxDragonsDenScore: app.maxPresentationScore,
        previousScore: app.previousScore,
        maxPreviousScore: app.maxPreviousScore,
        finalScore: app.previousScore + app.presentationScore,
        maxFinalScore: app.maxPreviousScore + app.maxPresentationScore,
        isEvaluated: app.isEvaluated,
        presentationTime: null // This would come from a presentation schedule table if implemented
      }))
    };
  } catch (error) {
    console.error("Error fetching Dragon's Den applications:", error);
    return { success: false, message: "Failed to fetch applications" };
  }
}

// Get Dragon's Den statistics
export async function getDragonsDenStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is a Dragon's Den judge
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'dragons_den_judge') {
      return { success: false, message: "Access denied" };
    }

    // Get statistics
    const stats = await db
      .select({
        totalFinalists: sql<number>`COUNT(DISTINCT ${applications.id})`.as('totalFinalists'),
        evaluated: sql<number>`COUNT(DISTINCT CASE WHEN EXISTS(
          SELECT 1 FROM ${applicationScores} as_check 
          JOIN ${scoringCriteria} sc_check ON as_check.criteriaId = sc_check.id 
          WHERE as_check.applicationId = ${applications.id} 
          AND sc_check.category = 'Presentation'
          AND as_check.evaluatedBy = ${userProfile.userId}
          AND as_check.score > 0
        ) THEN ${applications.id} END)`.as('evaluated'),
        averageScore: sql<number>`COALESCE(AVG(CASE WHEN sc.category = 'Presentation' THEN as_score.score END), 0)`.as('averageScore'),
        maxScore: sql<number>`COALESCE(MAX(sc.maxPoints), 0)`.as('maxScore'),
        topScore: sql<number>`COALESCE(MAX(CASE WHEN sc.category = 'Presentation' THEN as_score.score END), 0)`.as('topScore')
      })
      .from(applications)
      .leftJoin(applicationScores, and(
        eq(applicationScores.applicationId, applications.id),
        eq(applicationScores.evaluatedBy, userProfile.userId)
      ))
      .leftJoin(scoringCriteria, eq(sql`as_score.criteriaId`, scoringCriteria.id))
      .where(eq(applications.status, 'dragons_den'));

    const result = stats[0];

    return { 
      success: true, 
      data: {
        totalFinalists: result.totalFinalists || 0,
        evaluated: result.evaluated || 0,
        averageScore: result.averageScore || 0,
        maxScore: result.maxScore || 100,
        topScore: result.topScore || 0
      }
    };
  } catch (error) {
    console.error("Error fetching Dragon's Den stats:", error);
    return { success: false, message: "Failed to fetch statistics" };
  }
}

// Get Dragon's Den criteria for scoring
export async function getDragonsDenCriteria(applicationId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is a Dragon's Den judge
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'dragons_den_judge') {
      return { success: false, message: "Access denied" };
    }

    // Get Dragon's Den criteria and existing scores
    const criteriaWithScores = await db
      .select({
        criterion: scoringCriteria,
        score: applicationScores.score,
        comments: applicationScores.notes
      })
      .from(scoringCriteria)
      .leftJoin(applicationScores, and(
        eq(applicationScores.criteriaId, scoringCriteria.id),
        eq(applicationScores.applicationId, parseInt(applicationId)),
        eq(applicationScores.evaluatedBy, userProfile.userId)
      ))
      .where(eq(scoringCriteria.category, 'Presentation'))
      .orderBy(scoringCriteria.sortOrder);

    return { 
      success: true, 
      data: criteriaWithScores.map(item => ({
        criterion: {
          id: item.criterion.id,
          name: item.criterion.name,
          description: item.criterion.description,
          maxPoints: item.criterion.maxPoints,
          category: item.criterion.category
        },
        score: item.score || 0,
        comments: item.comments || ""
      }))
    };
  } catch (error) {
    console.error("Error fetching Dragon's Den criteria:", error);
    return { success: false, message: "Failed to fetch criteria" };
  }
}

// Update Dragon's Den scores
export async function updateDragonsDenScores(
  applicationId: string,
  scores: { criterionId: string; score: number; comments: string }[]
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is a Dragon's Den judge
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'dragons_den_judge') {
      return { success: false, message: "Access denied. Dragons Den judge role required." };
    }

    // Verify application exists and is in dragons_den status
    const application = await db.query.applications.findFirst({
      where: eq(applications.id, parseInt(applicationId))
    });

    if (!application || application.status !== 'dragons_den') {
      return { success: false, message: "Application not found or not in Dragon's Den phase" };
    }

    // Get the active scoring configuration
    const activeScoringConfig = await db.query.scoringConfigurations.findFirst({
      where: eq(sql`is_active`, true)
    });

    if (!activeScoringConfig) {
      return { success: false, message: "No active scoring configuration found" };
    }

    // Update or insert scores
    for (const scoreData of scores) {
      // Check if score already exists
      const existingScore = await db.query.applicationScores.findFirst({
        where: and(
          eq(applicationScores.applicationId, parseInt(applicationId)),
          eq(applicationScores.criteriaId, parseInt(scoreData.criterionId)),
          eq(applicationScores.evaluatedBy, userProfile.userId)
        )
      });

      if (existingScore) {
        // Update existing score
        await db.update(applicationScores)
          .set({
            score: scoreData.score,
            notes: scoreData.comments,
            evaluatedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(applicationScores.id, existingScore.id));
      } else {
        // Insert new score
        await db.insert(applicationScores).values({
          applicationId: parseInt(applicationId),
          criteriaId: parseInt(scoreData.criterionId),
          configId: activeScoringConfig.id,
          score: scoreData.score,
          maxScore: 0, // Will be filled by the scoring criterion's maxPoints
          notes: scoreData.comments,
          evaluatedBy: userProfile.userId,
          evaluatedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    return { success: true, message: "Scores updated successfully" };
  } catch (error) {
    console.error("Error updating Dragon's Den scores:", error);
    return { success: false, message: "Failed to update scores" };
  }
}

// Get Dragon's Den leaderboard
export async function getDragonsDenLeaderboard() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is a Dragon's Den judge or admin
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || !['dragons_den_judge', 'admin'].includes(userProfile.role)) {
      return { success: false, message: "Access denied" };
    }

    // Get comprehensive leaderboard
    const leaderboard = await db
      .select({
        applicationId: applications.id,
        businessName: businesses.name,
        applicantName: sql<string>`CONCAT(${applicants.firstName}, ' ', ${applicants.lastName})`.as('applicantName'),
        country: businesses.country,
        totalScore: sql<number>`COALESCE(SUM(${applicationScores.score}), 0)`.as('totalScore'),
        maxTotalScore: sql<number>`COALESCE(SUM(sc.maxPoints), 0)`.as('maxTotalScore'),
        presentationScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category = 'Presentation' THEN ${applicationScores.score} ELSE 0 END), 0)`.as('presentationScore'),
        maxPresentationScore: sql<number>`COALESCE(SUM(CASE WHEN sc.category = 'Presentation' THEN sc.maxPoints ELSE 0 END), 0)`.as('maxPresentationScore'),
        evaluationCount: sql<number>`COUNT(DISTINCT ${applicationScores.evaluatedBy})`.as('evaluationCount')
      })
      .from(applications)
      .leftJoin(businesses, eq(applications.businessId, businesses.id))
      .leftJoin(applicants, eq(businesses.applicantId, applicants.id))
      .leftJoin(applicationScores, eq(applications.id, applicationScores.applicationId))
      .leftJoin(scoringCriteria, eq(applicationScores.criteriaId, scoringCriteria.id))
      .where(eq(applications.status, 'dragons_den'))
      .groupBy(applications.id, businesses.name, applicants.firstName, applicants.lastName, businesses.country)
      .orderBy(desc(sql`totalScore`));

    return { 
      success: true, 
      data: leaderboard.map((item, index) => ({
        rank: index + 1,
        applicationId: item.applicationId,
        businessName: item.businessName,
        applicantName: item.applicantName,
        country: item.country,
        totalScore: item.totalScore || 0,
        maxTotalScore: item.maxTotalScore || 0,
        presentationScore: item.presentationScore || 0,
        maxPresentationScore: item.maxPresentationScore || 0,
        percentage: item.maxTotalScore > 0 ? Math.round((item.totalScore / item.maxTotalScore) * 100) : 0,
        evaluationCount: item.evaluationCount || 0
      }))
    };
  } catch (error) {
    console.error("Error fetching Dragon's Den leaderboard:", error);
    return { success: false, message: "Failed to fetch leaderboard" };
  }
}

// Select winners from Dragon's Den
export async function selectWinners(applicationIds: string[], categories: string[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Authentication required" };
    }

    // Verify user is admin
    const userProfile = await db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, session.user.id)
    });

    if (!userProfile || userProfile.role !== 'admin') {
      return { success: false, message: "Admin access required" };
    }

    // Update selected applications to approved status
    await db.update(applications)
      .set({ 
        status: 'approved',
        updatedAt: new Date()
      })
      .where(inArray(applications.id, applicationIds.map(id => parseInt(id))));

    // Update non-selected dragons_den applications to rejected
    const allDragonsDenApps = await db.select({ id: applications.id })
      .from(applications)
      .where(eq(applications.status, 'dragons_den'));

    const nonSelectedIds = allDragonsDenApps
      .filter(app => !applicationIds.includes(app.id.toString()))
      .map(app => app.id);

    if (nonSelectedIds.length > 0) {
      await db.update(applications)
        .set({ 
          status: 'rejected',
          updatedAt: new Date()
        })
        .where(inArray(applications.id, nonSelectedIds));
    }

    return { 
      success: true, 
      message: `Selected ${applicationIds.length} winners. ${nonSelectedIds.length} applications moved to rejected.`,
      data: {
        winners: applicationIds.length,
        rejected: nonSelectedIds.length,
        categories
      }
    };
  } catch (error) {
    console.error("Error selecting winners:", error);
    return { success: false, message: "Failed to select winners" };
  }
} 