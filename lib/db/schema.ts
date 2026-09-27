import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
export const profile = pgTable("profile", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: text("userId")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),

  university: text("university"),
  degree: text("degree"),
  fieldOfStudy: text("fieldOfStudy"),
  studyLevel: text("studyLevel"),
  graduationYear: integer("graduationYear"),

  location: text("location"),

  skills: text("skills"),
  experience: text("experience"),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const analyses = pgTable('analyses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),
  type: text('type').notNull(),

  organization: text('organization'),

  match: integer('match').notNull(),
  status: text('status').notNull(),

  deadline: timestamp('deadline'),

  summary: text('summary'),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const eligibility = pgTable('eligibility', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  analysisId: integer('analysisId')
    .notNull()
    .references(() => analyses.id, { onDelete: 'cascade' }),

  requirement: text('requirement').notNull(),
  explanation: text('explanation').notNull(),
  status: text('status').notNull(),
})



export const actionItems = pgTable('action_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  analysisId: integer('analysisId')
    .notNull()
    .references(() => analyses.id, { onDelete: 'cascade' }),

  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  position: integer('position').notNull(),
})
