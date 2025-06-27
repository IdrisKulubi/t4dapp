"use server";

import { eq, and, gte, sql, lt } from "drizzle-orm";
import db from "@/db/drizzle";
import { emailVerificationCodes, users } from "@/db/schema";
import { sendVerificationCode, generateVerificationCode } from "@/lib/email";
import { z } from "zod";
import bcrypt from "bcryptjs";

const sendCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const verifyCodeSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().length(6, "Verification code must be 6 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export async function sendVerificationCodeAction(email: string) {
  try {
    const validatedEmail = sendCodeSchema.parse({ email });
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedEmail.email))
      .limit(1);
    
    if (existingUser.length > 0 && existingUser[0].emailVerified) {
      return {
        success: false,
        error: "An account with this email already exists and is verified. Please sign in instead.",
      };
    }

    // Clean up expired codes for this email
    await db
      .delete(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.email, validatedEmail.email),
          lt(emailVerificationCodes.expiresAt, new Date())
        )
      );

    // Check if there's a recent valid code (within last 2 minutes to prevent spam)
    const recentCode = await db
      .select()
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.email, validatedEmail.email),
          eq(emailVerificationCodes.isUsed, false),
          gte(emailVerificationCodes.expiresAt, new Date())
        )
      )
      .limit(1);

    if (recentCode.length > 0) {
      const timeLeft = Math.ceil((recentCode[0].expiresAt.getTime() - Date.now()) / 1000 / 60);
      if (timeLeft > 8) { // If more than 8 minutes left, don't send new code
        return {
          success: false,
          error: `A verification code was already sent. Please check your email or wait ${timeLeft} minutes before requesting a new code.`,
        };
      }
    }

    // Generate new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Save verification code to database
    await db.insert(emailVerificationCodes).values({
      email: validatedEmail.email,
      code,
      expiresAt,
      isUsed: false,
      attempts: 0,
    });

    // Send verification email
    await sendVerificationCode({
      to: validatedEmail.email,
      verificationCode: code,
    });

    return {
      success: true,
      message: "Verification code sent successfully. Please check your email.",
    };
  } catch (error) {
    console.error("Error sending verification code:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    
    return {
      success: false,
      error: "Failed to send verification code. Please try again.",
    };
  }
}

export async function verifyCodeAndCreateAccount({
  email,
  code,
  password,
  name,
}: {
  email: string;
  code: string;
  password: string;
  name: string;
}) {
  try {
    const validatedData = verifyCodeSchema.parse({ email, code, password, name });
    
    // Find the verification code
    const verificationRecord = await db
      .select()
      .from(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.email, validatedData.email),
          eq(emailVerificationCodes.code, validatedData.code),
          eq(emailVerificationCodes.isUsed, false),
          gte(emailVerificationCodes.expiresAt, new Date())
        )
      )
      .limit(1);

    if (verificationRecord.length === 0) {
      // Increment attempts for any existing codes
      await db
        .update(emailVerificationCodes)
        .set({ 
          attempts: sql`${emailVerificationCodes.attempts} + 1`
        })
        .where(
          and(
            eq(emailVerificationCodes.email, validatedData.email),
            eq(emailVerificationCodes.code, validatedData.code)
          )
        );
      
      return {
        success: false,
        error: "Invalid or expired verification code. Please request a new one.",
      };
    }

    // Check if too many attempts
    if (verificationRecord[0]?.attempts && verificationRecord[0].attempts >= 3) {
      return {
        success: false,
        error: "Too many failed attempts. Please request a new verification code.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    let userId: string;

    if (existingUser.length > 0) {
      // Update existing user
      userId = existingUser[0].id;
      await db
        .update(users)
        .set({
          name: validatedData.name,
          password: hashedPassword,
          emailVerified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      // Create new user
      userId = crypto.randomUUID();
      await db.insert(users).values({
        id: userId,
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastActive: new Date(),
        isOnline: false,
      });
    }

    // Mark verification code as used
    await db
      .update(emailVerificationCodes)
      .set({ isUsed: true })
      .where(eq(emailVerificationCodes.id, verificationRecord[0].id));

    // Clean up old codes for this email
    await db
      .delete(emailVerificationCodes)
      .where(
        and(
          eq(emailVerificationCodes.email, validatedData.email),
          eq(emailVerificationCodes.isUsed, true)
        )
      );

    return {
      success: true,
      message: "Account created successfully! You can now sign in.",
      userId,
    };
  } catch (error) {
    console.error("Error verifying code and creating account:", error);
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    
    return {
      success: false,
      error: "Failed to verify code and create account. Please try again.",
    };
  }
}

export async function resendVerificationCode(email: string) {
  try {
    // Clean up old codes first
    await db
      .delete(emailVerificationCodes)
      .where(eq(emailVerificationCodes.email, email));
    
    // Send new code
    return await sendVerificationCodeAction(email);
  } catch (error) {
    console.error("Error resending verification code:", error);
    return {
      success: false,
      error: "Failed to resend verification code. Please try again.",
    };
  }
} 