import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  address: text("address"),
  avatar: text("avatar"),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  phone: true,
  address: true,
  avatar: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  date: text("date").notNull(),
  location: text("location"),
  price: integer("price").default(0),
  capacity: integer("capacity").default(100),
  status: text("status").default("active"),
  image: text("image"),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Orders table
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  eventId: varchar("event_id").notNull(),
  userName: text("user_name").notNull(),
  eventTitle: text("event_title").notNull(),
  amount: integer("amount").notNull(),
  paymentStatus: text("payment_status").default("pending"),
  eventDate: text("event_date").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// Messages table
export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  participantName: text("participant_name").notNull(),
  participantAvatar: text("participant_avatar"),
  lastMessage: text("last_message"),
  lastMessageTime: text("last_message_time"),
  unread: boolean("unread").default(false),
  starred: boolean("starred").default(false),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true });
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  conversationId: varchar("conversation_id").notNull(),
  content: text("content").notNull(),
  senderId: varchar("sender_id").notNull(),
  timestamp: text("timestamp").notNull(),
  isOwn: boolean("is_own").default(false),
});

export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Wallet transactions
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  type: text("type").notNull(), // credit, debit
  amount: integer("amount").notNull(),
  status: text("status").default("completed"),
  description: text("description"),
  date: text("date").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Support tickets
export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("open"), // open, in_progress, closed
  createdAt: text("created_at").notNull(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true });
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

export const ticketResponses = pgTable("ticket_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketId: varchar("ticket_id").notNull(),
  message: text("message").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertTicketResponseSchema = createInsertSchema(ticketResponses).omit({ id: true });
export type InsertTicketResponse = z.infer<typeof insertTicketResponseSchema>;
export type TicketResponse = typeof ticketResponses.$inferSelect;

// Loans
export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: integer("amount").notNull(),
  duration: integer("duration").notNull(), // months
  purpose: text("purpose").notNull(),
  status: text("status").default("pending"), // pending, approved, rejected
  emi: integer("emi"),
  createdAt: text("created_at").notNull(),
});

export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, emi: true });
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  plan: text("plan").notNull(), // basic, pro, enterprise
  price: integer("price").notNull(),
  status: text("status").default("active"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// Activity log
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  userName: text("user_name"),
  userAvatar: text("user_avatar"),
  action: text("action").notNull(),
  description: text("description").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Dashboard stats type
export type DashboardStats = {
  totalEvents: number;
  activeEvents: number;
  registeredUsers: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  categoryBreakdown: { category: string; count: number; fill: string }[];
};

// Wallet type
export type Wallet = {
  balance: number;
  transactions: Transaction[];
};

// Password update schema
export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type UpdatePassword = z.infer<typeof updatePasswordSchema>;

// Profile update schema
export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;

// Subscription plan type
export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
};
