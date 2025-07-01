/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { z } from "zod";
import { eq, desc, and, or, like, count as drizzleCount, sql } from "drizzle-orm";
import db from "../../../db/drizzle";
import { supportTickets, supportResponses } from "../../../db/schema";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { 
  createSupportTicketSchema,
  addResponseSchema,
  updateTicketStatusSchema,
  type CreateSupportTicketData,
  type AddResponseData,
  type UpdateTicketStatusData,
  type SupportTicketFilters
} from "../types/support";

// Generate unique ticket number
async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.select({ count: drizzleCount() }).from(supportTickets);
  const totalTickets = result[0]?.count ?? 0;
  const ticketNumber = `TKT-${year}-${String(totalTickets + 1).padStart(4, '0')}`;
  return ticketNumber;
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(data: CreateSupportTicketData) {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to create a support ticket.",
      };
    }

    const userId = session.user.id;
    const userEmail = session.user.email!;
    const userName = session.user.name || "Unknown User";

    // Validate input data
    const validatedData = createSupportTicketSchema.parse(data);

    // Generate unique ticket number
    const ticketNumber = await generateTicketNumber();

    // Create the support ticket
    const [ticket] = await db.insert(supportTickets).values({
      ticketNumber,
      userId,
      category: validatedData.category,
      priority: validatedData.priority,
      status: "open",
      subject: validatedData.subject,
      description: validatedData.description,
      userEmail,
      userName,
      attachmentUrl: validatedData.attachmentUrl,
    }).returning();

    revalidatePath("/admin/support");
    
    return {
      success: true,
      message: "Support ticket created successfully!",
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt
      }
    };

  } catch (error) {
    console.error("Error creating support ticket:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: error.flatten().fieldErrors,
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Get support tickets with filtering and pagination
 */
export async function getSupportTickets(filters: SupportTicketFilters = {}) {
  try {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (filters.status && filters.status !== 'all') {
      conditions.push(eq(supportTickets.status, filters.status as any));
    }

    if (filters.category && filters.category !== 'all') {
      conditions.push(eq(supportTickets.category, filters.category as any));
    }

    if (filters.priority && filters.priority !== 'all') {
      conditions.push(eq(supportTickets.priority, filters.priority as any));
    }

    if (filters.assignedTo && filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') {
        conditions.push(sql`${supportTickets.assignedTo} IS NULL`);
      } else {
        conditions.push(eq(supportTickets.assignedTo, filters.assignedTo));
      }
    }

    if (filters.userId) {
      conditions.push(eq(supportTickets.userId, filters.userId));
    }

    if (filters.search) {
      conditions.push(
        or(
          like(supportTickets.subject, `%${filters.search}%`),
          like(supportTickets.description, `%${filters.search}%`),
          like(supportTickets.ticketNumber, `%${filters.search}%`)
        )
      );
    }

    const whereCondition = conditions.length > 0 ? and(...conditions) : undefined;

    // Get tickets with user information
    const tickets = await db
      .select({
        id: supportTickets.id,
        ticketNumber: supportTickets.ticketNumber,
        category: supportTickets.category,
        priority: supportTickets.priority,
        status: supportTickets.status,
        subject: supportTickets.subject,
        description: supportTickets.description,
        userEmail: supportTickets.userEmail,
        userName: supportTickets.userName,
        attachmentUrl: supportTickets.attachmentUrl,
        assignedTo: supportTickets.assignedTo,
        resolvedAt: supportTickets.resolvedAt,
        createdAt: supportTickets.createdAt,
        updatedAt: supportTickets.updatedAt,
      })
      .from(supportTickets)
      .where(whereCondition)
      .orderBy(desc(supportTickets.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: drizzleCount() })
      .from(supportTickets)
      .where(whereCondition);
    
    const total = totalResult[0]?.count ?? 0;
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        tickets,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrevious: page > 1,
        },
      },
    };

  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return {
      success: false,
      message: "Failed to fetch support tickets",
    };
  }
}

/**
 * Get a single support ticket by ID with responses
 */
export async function getSupportTicketById(ticketId: number) {
  try {
    // Get the ticket
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, ticketId),
      with: {
        responses: {
          orderBy: desc(supportResponses.createdAt)
        }
      }
    });

    if (!ticket) {
      return {
        success: false,
        message: "Support ticket not found",
      };
    }

    return {
      success: true,
      data: ticket,
    };

  } catch (error) {
    console.error("Error fetching support ticket:", error);
    return {
      success: false,
      message: "Failed to fetch support ticket",
    };
  }
}

/**
 * Add a response to a support ticket
 */
export async function addSupportResponse(data: AddResponseData) {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to add a response.",
      };
    }

    const userId = session.user.id;
    const userName = session.user.name || "Unknown User";
    const userRole = session.user.role || "user";

    // Validate input data
    const validatedData = addResponseSchema.parse(data);

    // Check if ticket exists and user has access
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, validatedData.ticketId)
    });

    if (!ticket) {
      return {
        success: false,
        message: "Support ticket not found",
      };
    }

    // Check permissions - users can only respond to their own tickets, admins can respond to any
    if (userRole !== "admin" && ticket.userId !== userId) {
      return {
        success: false,
        message: "You don't have permission to respond to this ticket",
      };
    }

    // Add the response
    const [response] = await db.insert(supportResponses).values({
      ticketId: validatedData.ticketId,
      responderId: userId,
      responderName: userName,
      responderRole: userRole,
      message: validatedData.message,
      attachmentUrl: validatedData.attachmentUrl,
      isInternal: validatedData.isInternal && userRole === "admin", // Only admins can create internal notes
    }).returning();

    // Update ticket status if it was resolved and user is responding
    if (ticket.status === "resolved" && userRole === "user") {
      await db.update(supportTickets)
        .set({ 
          status: "open",
          updatedAt: new Date()
        })
        .where(eq(supportTickets.id, validatedData.ticketId));
    } else {
      // Just update the updatedAt timestamp
      await db.update(supportTickets)
        .set({ updatedAt: new Date() })
        .where(eq(supportTickets.id, validatedData.ticketId));
    }

    revalidatePath("/admin/support");
    
    return {
      success: true,
      message: "Response added successfully!",
      response: {
        id: response.id,
        message: response.message,
        createdAt: response.createdAt
      }
    };

  } catch (error) {
    console.error("Error adding support response:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: error.flatten().fieldErrors,
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Update support ticket status (Admin only)
 */
export async function updateSupportTicketStatus(data: UpdateTicketStatusData) {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "admin") {
      return {
        success: false,
        message: "You must be an admin to update ticket status.",
      };
    }

    const userId = session.user.id;
    
    // Validate input data
    const validatedData = updateTicketStatusSchema.parse(data);

    // Check if ticket exists
    const ticket = await db.query.supportTickets.findFirst({
      where: eq(supportTickets.id, validatedData.ticketId)
    });

    if (!ticket) {
      return {
        success: false,
        message: "Support ticket not found",
      };
    }

    // Prepare update data
    const updateData: any = {
      status: validatedData.status,
      updatedAt: new Date()
    };

    if (validatedData.assignedTo !== undefined) {
      updateData.assignedTo = validatedData.assignedTo;
    }

    if (validatedData.status === "resolved" || validatedData.status === "closed") {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = userId;
      if (validatedData.resolutionNotes) {
        updateData.resolutionNotes = validatedData.resolutionNotes;
      }
    }

    // Update the ticket
    await db.update(supportTickets)
      .set(updateData)
      .where(eq(supportTickets.id, validatedData.ticketId));

    revalidatePath("/admin/support");
    
    return {
      success: true,
      message: "Ticket status updated successfully!",
    };

  } catch (error) {
    console.error("Error updating support ticket status:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation failed. Please check your input.",
        errors: error.flatten().fieldErrors,
      };
    }
    
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Get support statistics for admin dashboard
 */
export async function getSupportStats() {
  try {
    // Get total tickets
    const totalResult = await db.select({ count: drizzleCount() }).from(supportTickets);
    const totalTickets = totalResult[0]?.count ?? 0;

    // Get open tickets
    const openResult = await db.select({ count: drizzleCount() })
      .from(supportTickets)
      .where(eq(supportTickets.status, "open"));
    const openTickets = openResult[0]?.count ?? 0;

    // Get tickets in progress
    const inProgressResult = await db.select({ count: drizzleCount() })
      .from(supportTickets)
      .where(eq(supportTickets.status, "in_progress"));
    const inProgressTickets = inProgressResult[0]?.count ?? 0;

    // Get resolved tickets
    const resolvedResult = await db.select({ count: drizzleCount() })
      .from(supportTickets)
      .where(eq(supportTickets.status, "resolved"));
    const resolvedTickets = resolvedResult[0]?.count ?? 0;

    // Get unassigned tickets
    const unassignedResult = await db.select({ count: drizzleCount() })
      .from(supportTickets)
      .where(sql`${supportTickets.assignedTo} IS NULL`);
    const unassignedTickets = unassignedResult[0]?.count ?? 0;

    return {
      success: true,
      data: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        unassignedTickets,
      },
    };

  } catch (error) {
    console.error("Error fetching support statistics:", error);
    return {
      success: false,
      message: "Failed to fetch support statistics",
    };
  }
}

/**
 * Get user's own support tickets
 */
export async function getUserSupportTickets(filters: Omit<SupportTicketFilters, 'userId'> = {}) {
  try {
    // Get current user session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to view your tickets.",
      };
    }

    return await getSupportTickets({
      ...filters,
      userId: session.user.id
    });

  } catch (error) {
    console.error("Error fetching user support tickets:", error);
    return {
      success: false,
      message: "Failed to fetch your support tickets",
    };
  }
} 