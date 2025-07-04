import { 
  pgTable, 
  serial, 
  varchar, 
  timestamp, 
  boolean, 
  integer, 
  text, 
  date, 
  pgEnum, 
  decimal,
  uuid,
  primaryKey,
  index
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

import { relations } from "drizzle-orm";

// Enums
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const educationLevelEnum = pgEnum('education_level', [
  'primary_school_and_below',
  'high_school',
  'technical_college',
  'undergraduate',
  'postgraduate'
]);

export const countryEnum = pgEnum('country', [
  'ghana',
  'kenya',
  'nigeria',
  'rwanda',
  'tanzania'
]);

export const userRoleEnum = pgEnum('user_role', [
  'applicant',
  'admin',
  'technical_reviewer',
  'jury_member',
  'dragons_den_judge'
]);

export const fundingSourceEnum = pgEnum('funding_source', [
  'high_net_worth_individual',
  'financial_institutions',
  'government_agency',
  'local_or_international_ngo',
  'other'
]);

export const fundingInstrumentEnum = pgEnum('funding_instrument', [
  'debt',
  'equity',
  'quasi',
  'other'
]);

export const customerSegmentEnum = pgEnum('customer_segment', [
  'household_individuals',
  'micro_small_medium_enterprises',
  'institutions',
  'corporates',
  'government_and_ngos',
  'other'
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'draft',
  'submitted',
  'under_review',
  'shortlisted',
  'scoring_phase',
  'dragons_den',
  'finalist',
  'approved',
  'rejected'
]);

export const supportCategoryEnum = pgEnum('support_category', [
  'technical_issue',
  'application_help',
  'account_problem',
  'payment_issue',
  'feature_request',
  'bug_report',
  'general_inquiry',
  'other'
]);

export const supportPriorityEnum = pgEnum('support_priority', [
  'low',
  'medium',
  'high',
  'urgent'
]);

export const supportStatusEnum = pgEnum('support_status', [
  'open',
  'in_progress',
  'waiting_for_user',
  'resolved',
  'closed'
]);

// Tables


// First define all tables
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(), 
    name: text("name"),
    email: text("email").notNull().unique(),
    password: text("password"), // For email/password authentication
    role: text("role").$type<"user" | "admin">().default("user"),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    isOnline: boolean("is_online").default(false),
    profilePhoto: text("profile_photo"),
    phoneNumber: text("phone_number"),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    createdAtIdx: index("user_created_at_idx").on(table.createdAt),
    lastActiveIdx: index("user_last_active_idx").on(table.lastActive),
  })
);

// User Profiles table for extended user information
export const userProfiles = pgTable('user_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('applicant').notNull(),
  profileImage: text('profile_image'),
  phoneNumber: varchar('phone_number', { length: 20 }),
  country: varchar('country', { length: 100 }),
  organization: varchar('organization', { length: 200 }),
  bio: text('bio'),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("user_profiles_user_id_idx").on(table.userId),
  emailIdx: index("user_profiles_email_idx").on(table.email),
  roleIdx: index("user_profiles_role_idx").on(table.role),
}));

// Auth.js tables
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Email verification codes table for custom email verification
export const emailVerificationCodes = pgTable(
  "email_verification_codes",
  {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    code: text("code").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    isUsed: boolean("is_used").default(false),
    attempts: integer("attempts").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("email_verification_codes_email_idx").on(table.email),
    codeIdx: index("email_verification_codes_code_idx").on(table.code),
    expiresAtIdx: index("email_verification_codes_expires_at_idx").on(table.expiresAt),
  })
);


export const applicants = pgTable('applicants', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  gender: genderEnum('gender').notNull(),
  genderOther: text('gender_other'),
  dateOfBirth: date('date_of_birth').notNull(),
  citizenship: countryEnum('citizenship').notNull(),
  citizenshipOther: varchar('citizenship_other', { length: 100 }),
  countryOfResidence: countryEnum('country_of_residence').notNull(),
  residenceOther: varchar('residence_other', { length: 100 }),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  email: varchar('email', { length: 100 }).notNull(),
  highestEducation: educationLevelEnum('highest_education').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  applicantId: integer('applicant_id').notNull().references(() => applicants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  startDate: date('start_date').notNull(),
  isRegistered: boolean('is_registered').notNull(),
  registrationCertificateUrl: varchar('registration_certificate_url', { length: 500 }),
  sector: varchar('sector', { length: 100 }),
  sectorOther: text('sector_other'),
  country: countryEnum('country').notNull(),
  countryOther: varchar('country_other', { length: 100 }),
  city: varchar('city', { length: 100 }).notNull(),
  registeredCountries: text('registered_countries').notNull(),
  description: text('description').notNull(),
  problemSolved: text('problem_solved').notNull(),
  revenueLastTwoYears: decimal('revenue_last_two_years', { precision: 12, scale: 2 }).notNull(),
  fullTimeEmployeesTotal: integer('full_time_employees_total').notNull(),
  fullTimeEmployeesMale: integer('full_time_employees_male').notNull(),
  fullTimeEmployeesFemale: integer('full_time_employees_female').notNull(),
  partTimeEmployeesMale: integer('part_time_employees_male').notNull(),
  partTimeEmployeesFemale: integer('part_time_employees_female').notNull(),
  climateAdaptationContribution: text('climate_adaptation_contribution').notNull(),
  productServiceDescription: text('product_service_description').notNull(),
  climateExtremeImpact: text('climate_extreme_impact').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  customerCountLastSixMonths: integer('customer_count_last_six_months').notNull(),
  productionCapacityLastSixMonths: varchar('production_capacity_last_six_months', { length: 200 }).notNull(),
  currentChallenges: text('current_challenges').notNull(),
  supportNeeded: text('support_needed').notNull(),
  additionalInformation: text('additional_information'),
  customerSegmentsOther: text('customer_segments_other'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const businessTargetCustomers = pgTable('business_target_customers', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  customerSegment: customerSegmentEnum('customer_segment').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const businessFunding = pgTable('business_funding', {
  id: serial('id').primaryKey(),
  businessId: integer('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  hasExternalFunding: boolean('has_external_funding').notNull(),
  fundingSource: fundingSourceEnum('funding_source'),
  fundingSourceOther: varchar('funding_source_other', { length: 100 }),
  fundingDate: date('funding_date'),
  funderName: varchar('funder_name', { length: 200 }),
  amountUsd: decimal('amount_usd', { precision: 12, scale: 2 }),
  fundingInstrument: fundingInstrumentEnum('funding_instrument'),
  fundingInstrumentOther: varchar('funding_instrument_other', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  businessId: integer('business_id').notNull().references(() => businesses.id, { onDelete: 'cascade' }),
  status: applicationStatusEnum('status').default('draft').notNull(),
  referralSource: varchar('referral_source', { length: 100 }),
  referralSourceOther: varchar('referral_source_other', { length: 100 }),
  submittedAt: timestamp('submitted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const eligibilityResults = pgTable('eligibility_results', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }).unique(),
  scoringConfigId: integer('scoring_config_id'),  // Link to scoring configuration used
  isEligible: boolean('is_eligible').notNull(),
  ageEligible: boolean('age_eligible').notNull(),
  registrationEligible: boolean('registration_eligible').notNull(),
  revenueEligible: boolean('revenue_eligible').notNull(),
  businessPlanEligible: boolean('business_plan_eligible').notNull(),
  impactEligible: boolean('impact_eligible').notNull(),
  marketPotentialScore: integer('market_potential_score'),
  innovationScore: integer('innovation_score'),
  climateAdaptationScore: integer('climate_adaptation_score'),
  jobCreationScore: integer('job_creation_score'),
  viabilityScore: integer('viability_score'),
  managementCapacityScore: integer('management_capacity_score'),
  locationBonus: integer('location_bonus'),
  genderBonus: integer('gender_bonus'),
  
  // New dynamic scoring fields
  customScores: text('custom_scores'), // JSON field for flexible scoring
  
  totalScore: integer('total_score'),
  evaluationNotes: text('evaluation_notes'),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  evaluatedBy: text('evaluated_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// New tables for configurable scoring system
export const scoringConfigurations = pgTable('scoring_configurations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),
  version: varchar('version', { length: 50 }).notNull().default('1.0'),
  isActive: boolean('is_active').default(false),
  isDefault: boolean('is_default').default(false),
  totalMaxScore: integer('total_max_score').notNull().default(100),
  passThreshold: integer('pass_threshold').notNull().default(60),
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const scoringCriteria = pgTable('scoring_criteria', {
  id: serial('id').primaryKey(),
  configId: integer('config_id').notNull().references(() => scoringConfigurations.id, { onDelete: 'cascade' }),
  category: varchar('category', { length: 100 }).notNull(), // e.g., "Innovation and Climate Adaptation Focus"
  name: varchar('name', { length: 200 }).notNull(), // e.g., "Demonstratable Climate Adaptation Benefits"
  description: text('description'),
  maxPoints: integer('max_points').notNull(),
  weightage: decimal('weightage', { precision: 5, scale: 2 }), // Percentage weight in category
  scoringLevels: text('scoring_levels'), // JSON: [{level: "Limited", points: 0, description: "..."}, ...]
  evaluationType: varchar('evaluation_type', { length: 50 }).default('manual'), // 'manual', 'auto', 'hybrid'
  sortOrder: integer('sort_order').default(0),
  isRequired: boolean('is_required').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const applicationScores = pgTable('application_scores', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  criteriaId: integer('criteria_id').notNull().references(() => scoringCriteria.id, { onDelete: 'cascade' }),
  configId: integer('config_id').notNull().references(() => scoringConfigurations.id, { onDelete: 'cascade' }),
  score: integer('score').notNull(),
  maxScore: integer('max_score').notNull(),
  level: varchar('level', { length: 100 }), // e.g., "Strong Capacity", "Moderate", etc.
  notes: text('notes'),
  evaluatedBy: text('evaluated_by'),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Table to track re-evaluation history
export const evaluationHistory = pgTable('evaluation_history', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id').notNull().references(() => applications.id, { onDelete: 'cascade' }),
  previousConfigId: integer('previous_config_id'),
  newConfigId: integer('new_config_id').notNull().references(() => scoringConfigurations.id),
  previousTotalScore: integer('previous_total_score'),
  newTotalScore: integer('new_total_score'),
  previousIsEligible: boolean('previous_is_eligible'),
  newIsEligible: boolean('new_is_eligible'),
  changeReason: text('change_reason'),
  evaluatedBy: text('evaluated_by').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Support system tables
export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  ticketNumber: varchar('ticket_number', { length: 20 }).notNull().unique(), // e.g., "TKT-2024-001"
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: supportCategoryEnum('category').notNull(),
  priority: supportPriorityEnum('priority').default('medium').notNull(),
  status: supportStatusEnum('status').default('open').notNull(),
  subject: varchar('subject', { length: 200 }).notNull(),
  description: text('description').notNull(),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userName: varchar('user_name', { length: 200 }).notNull(),
  attachmentUrl: varchar('attachment_url', { length: 500 }), // Optional file attachment
  assignedTo: text('assigned_to').references(() => users.id), // Admin user assigned to ticket
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: text('resolved_by').references(() => users.id),
  resolutionNotes: text('resolution_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  ticketNumberIdx: index("support_tickets_ticket_number_idx").on(table.ticketNumber),
  userIdIdx: index("support_tickets_user_id_idx").on(table.userId),
  statusIdx: index("support_tickets_status_idx").on(table.status),
  categoryIdx: index("support_tickets_category_idx").on(table.category),
  priorityIdx: index("support_tickets_priority_idx").on(table.priority),
  createdAtIdx: index("support_tickets_created_at_idx").on(table.createdAt),
}));

export const supportResponses = pgTable('support_responses', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').notNull().references(() => supportTickets.id, { onDelete: 'cascade' }),
  responderId: text('responder_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  responderName: varchar('responder_name', { length: 200 }).notNull(),
  responderRole: varchar('responder_role', { length: 50 }).notNull(), // 'user', 'admin', 'support'
  message: text('message').notNull(),
  attachmentUrl: varchar('attachment_url', { length: 500 }), // Optional file attachment
  isInternal: boolean('is_internal').default(false), // Internal notes not visible to user
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
}, (table) => ({
  ticketIdIdx: index("support_responses_ticket_id_idx").on(table.ticketId),
  responderIdIdx: index("support_responses_responder_id_idx").on(table.responderId),
  createdAtIdx: index("support_responses_created_at_idx").on(table.createdAt),
}));

// Relations
export const applicantRelations = relations(applicants, ({ one, many }) => ({
  user: one(users, {
    fields: [applicants.userId],
    references: [users.id]
  }),
  businesses: many(businesses)
}));

export const businessRelations = relations(businesses, ({ one, many }) => ({
  applicant: one(applicants, {
    fields: [businesses.applicantId],
    references: [applicants.id]
  }),
  targetCustomers: many(businessTargetCustomers),
  funding: many(businessFunding),
  applications: many(applications)
}));

export const businessTargetCustomersRelations = relations(businessTargetCustomers, ({ one }) => ({
  business: one(businesses, {
    fields: [businessTargetCustomers.businessId],
    references: [businesses.id]
  })
}));

export const businessFundingRelations = relations(businessFunding, ({ one }) => ({
  business: one(businesses, {
    fields: [businessFunding.businessId],
    references: [businesses.id]
  })
}));

export const applicationRelations = relations(applications, ({ one, many }) => ({
  business: one(businesses, {
    fields: [applications.businessId],
    references: [businesses.id]
  }),
  eligibilityResults: many(eligibilityResults)
}));

export const eligibilityResultsRelations = relations(eligibilityResults, ({ one }) => ({
  application: one(applications, {
    fields: [eligibilityResults.applicationId],
    references: [applications.id]
  }),
  evaluator: one(users, {
    fields: [eligibilityResults.evaluatedBy],
    references: [users.id]
  })
}));

export const userRelations = relations(users, ({ one, many }) => ({
  userProfile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId]
  }),
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.userId]
  }),
  evaluations: many(eligibilityResults, { relationName: "evaluator" }),
  scoringConfigurations: many(scoringConfigurations),
  applicationScores: many(applicationScores),
  evaluationHistory: many(evaluationHistory)
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id]
  })
}));

// New relations for scoring system
export const scoringConfigurationsRelations = relations(scoringConfigurations, ({ one, many }) => ({
  creator: one(users, {
    fields: [scoringConfigurations.createdBy],
    references: [users.id]
  }),
  criteria: many(scoringCriteria),
  applicationScores: many(applicationScores),
  evaluationHistory: many(evaluationHistory)
}));

export const scoringCriteriaRelations = relations(scoringCriteria, ({ one, many }) => ({
  configuration: one(scoringConfigurations, {
    fields: [scoringCriteria.configId],
    references: [scoringConfigurations.id]
  }),
  applicationScores: many(applicationScores)
}));

export const applicationScoresRelations = relations(applicationScores, ({ one }) => ({
  application: one(applications, {
    fields: [applicationScores.applicationId],
    references: [applications.id]
  }),
  criteria: one(scoringCriteria, {
    fields: [applicationScores.criteriaId],
    references: [scoringCriteria.id]
  }),
  configuration: one(scoringConfigurations, {
    fields: [applicationScores.configId],
    references: [scoringConfigurations.id]
  }),
  evaluator: one(users, {
    fields: [applicationScores.evaluatedBy],
    references: [users.id]
  })
}));

export const evaluationHistoryRelations = relations(evaluationHistory, ({ one }) => ({
  application: one(applications, {
    fields: [evaluationHistory.applicationId],
    references: [applications.id]
  }),
  previousConfig: one(scoringConfigurations, {
    fields: [evaluationHistory.previousConfigId],
    references: [scoringConfigurations.id]
  }),
  newConfig: one(scoringConfigurations, {
    fields: [evaluationHistory.newConfigId],
    references: [scoringConfigurations.id]
  })
}));

// Support system relations
export const supportTicketsRelations = relations(supportTickets, ({ one, many }) => ({
  user: one(users, {
    fields: [supportTickets.userId],
    references: [users.id]
  }),
  assignedToUser: one(users, {
    fields: [supportTickets.assignedTo],
    references: [users.id]
  }),
  resolvedByUser: one(users, {
    fields: [supportTickets.resolvedBy],
    references: [users.id]
  }),
  responses: many(supportResponses)
}));

export const supportResponsesRelations = relations(supportResponses, ({ one }) => ({
  ticket: one(supportTickets, {
    fields: [supportResponses.ticketId],
    references: [supportTickets.id]
  }),
  responder: one(users, {
    fields: [supportResponses.responderId],
    references: [users.id]
  })
}));
