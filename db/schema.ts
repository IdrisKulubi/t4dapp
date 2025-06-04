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
  'government_and_ngos'
]);

export const applicationStatusEnum = pgEnum('application_status', [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected'
]);

// Tables


// First define all tables
export const users = pgTable(
  "user",
  {
    id: text("id").primaryKey(), 
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    role: text("role").$type<"user" | "admin">().default("user"),
    emailVerified: timestamp("emailVerified"),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    isOnline: boolean("is_online").default(false),
    profilePhoto: text("profile_photo"),
    phoneNumber: text("phone_number").notNull(),
  },
  (table) => ({
    emailIdx: index("user_email_idx").on(table.email),
    createdAtIdx: index("user_created_at_idx").on(table.createdAt),
    lastActiveIdx: index("user_last_active_idx").on(table.lastActive),
  })
);

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


export const applicants = pgTable('applicants', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().unique(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  gender: genderEnum('gender').notNull(),
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
  totalScore: integer('total_score'),
  evaluationNotes: text('evaluation_notes'),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  evaluatedBy: uuid('evaluated_by'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});



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
  applicant: one(applicants, {
    fields: [users.id],
    references: [applicants.userId]
  }),
  evaluations: many(eligibilityResults, { relationName: "evaluator" })
}));
