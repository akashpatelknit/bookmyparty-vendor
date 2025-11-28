export type UserType = {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  role: string;
};

export type InsertUser = {
  username: string;
  password: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  date: string;
  location: string | null;
  price: number;
  capacity: number;
  status: string;
  image: string | null;
};

export type InsertEvent = {
  title: string;
  description?: string;
  category: string;
  date: string;
  location?: string;
  price?: number;
  capacity?: number;
  status?: string;
  image?: string;
};

// =========================
// ORDERS
// =========================
export type Order = {
  id: string;
  userId: string;
  eventId: string;
  userName: string;
  eventTitle: string;
  amount: number;
  paymentStatus: string;
  eventDate: string;
  createdAt: string;
};

export type InsertOrder = Omit<Order, "id">;

// =========================
// CONVERSATIONS
// =========================
export type Conversation = {
  id: string;
  participantName: string;
  participantAvatar: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unread: boolean;
  starred: boolean;
};

export type InsertConversation = Omit<Conversation, "id">;

// =========================
// MESSAGES
// =========================
export type Message = {
  id: string;
  conversationId: string;
  content: string;
  senderId: string;
  timestamp: string;
  isOwn: boolean;
};

export type InsertMessage = Omit<Message, "id">;

// =========================
// WALLET TRANSACTIONS
// =========================
export type Transaction = {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  status: string;
  description: string | null;
  date: string;
};

export type InsertTransaction = Omit<Transaction, "id">;

// =========================
// SUPPORT TICKETS
// =========================
export type Ticket = {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

export type InsertTicket = Omit<Ticket, "id">;

export type TicketResponse = {
  id: string;
  ticketId: string;
  message: string;
  isAdmin: boolean;
  createdAt: string;
};

export type InsertTicketResponse = Omit<TicketResponse, "id">;

// =========================
// LOANS
// =========================
export type Loan = {
  id: string;
  userId: string;
  amount: number;
  duration: number;
  purpose: string;
  status: string;
  emi: number | null;
  createdAt: string;
};

export type InsertLoan = {
  userId: string;
  amount: number;
  duration: number;
  purpose: string;
  status?: string;
  createdAt: string;
};

// =========================
// SUBSCRIPTIONS
// =========================
export type Subscription = {
  id: string;
  userId: string;
  plan: string;
  price: number;
  status: string;
  startDate: string;
  endDate: string | null;
};

export type InsertSubscription = Omit<Subscription, "id">;

// =========================
// ACTIVITIES
// =========================
export type Activity = {
  id: string;
  userId: string | null;
  userName: string | null;
  userAvatar: string | null;
  action: string;
  description: string;
  timestamp: string;
};

export type InsertActivity = Omit<Activity, "id">;

// =========================
// DASHBOARD STATS
// =========================
export type DashboardStats = {
  totalEvents: number;
  activeEvents: number;
  registeredUsers: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  categoryBreakdown: { category: string; count: number; fill: string }[];
};

// =========================
// WALLET
// =========================
export type Wallet = {
  balance: number;
  transactions: Transaction[];
};

// =========================
// PROFILE UPDATE
// =========================
export type UpdateProfile = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

// =========================
// PASSWORD UPDATE
// =========================
export type UpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// =========================
// SUBSCRIPTION PLAN
// =========================
export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
};
