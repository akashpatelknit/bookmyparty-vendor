import {
  type User, type InsertUser,
  type Event, type InsertEvent,
  type Order, type InsertOrder,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Transaction, type InsertTransaction,
  type Ticket, type InsertTicket,
  type TicketResponse, type InsertTicketResponse,
  type Loan, type InsertLoan,
  type Subscription, type InsertSubscription,
  type Activity, type InsertActivity,
  type DashboardStats,
  type Wallet,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;

  // Conversations & Messages
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined>;
  getMessages(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Wallet
  getWallet(userId: string): Promise<Wallet>;
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Tickets
  getTickets(userId: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket | undefined>;
  getTicketResponses(ticketId: string): Promise<TicketResponse[]>;
  createTicketResponse(response: InsertTicketResponse): Promise<TicketResponse>;

  // Loans
  getLoans(userId: string): Promise<Loan[]>;
  getLoan(id: string): Promise<Loan | undefined>;
  createLoan(loan: InsertLoan & { emi?: number }): Promise<Loan>;

  // Subscriptions
  getSubscriptions(userId: string): Promise<Subscription[]>;
  getActiveSubscription(userId: string): Promise<Subscription | undefined>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;

  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private events: Map<string, Event>;
  private orders: Map<string, Order>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private transactions: Map<string, Transaction>;
  private tickets: Map<string, Ticket>;
  private ticketResponses: Map<string, TicketResponse>;
  private loans: Map<string, Loan>;
  private subscriptions: Map<string, Subscription>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.orders = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.transactions = new Map();
    this.tickets = new Map();
    this.ticketResponses = new Map();
    this.loans = new Map();
    this.subscriptions = new Map();
    this.activities = new Map();

    this.seedData();
  }

  private seedData() {
    // Seed admin user
    const adminId = "admin-user-id";
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "admin123",
      email: "admin@eventhub.com",
      name: "Admin User",
      phone: "+1 (555) 123-4567",
      address: "123 Event Street, San Francisco, CA 94102",
      avatar: null,
      role: "admin",
    });

    // Seed events
    const eventCategories = ["music", "sports", "tech", "art", "food"];
    const eventTitles = [
      "Summer Music Festival 2024",
      "Tech Conference 2024",
      "Art Exhibition Opening",
      "Food & Wine Festival",
      "Basketball Championship",
      "Jazz Night Live",
      "Startup Pitch Day",
      "Photography Workshop",
    ];

    eventTitles.forEach((title, i) => {
      const id = randomUUID();
      this.events.set(id, {
        id,
        title,
        description: `Amazing ${title.toLowerCase()} event`,
        category: eventCategories[i % eventCategories.length],
        date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        location: "San Francisco, CA",
        price: [50, 100, 150, 200, 75][i % 5],
        capacity: 100 + i * 50,
        status: i < 5 ? "active" : "upcoming",
        image: null,
      });
    });

    // Seed orders
    const userNames = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Alex Brown", "Emily Davis"];
    const eventIds = Array.from(this.events.keys());
    const statuses = ["paid", "pending", "paid", "paid", "failed", "paid"];

    for (let i = 0; i < 25; i++) {
      const id = randomUUID();
      const eventId = eventIds[i % eventIds.length];
      const event = this.events.get(eventId)!;
      this.orders.set(id, {
        id,
        userId: randomUUID(),
        eventId,
        userName: userNames[i % userNames.length],
        eventTitle: event.title,
        amount: event.price || 100,
        paymentStatus: statuses[i % statuses.length],
        eventDate: event.date,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    }

    // Seed conversations
    const participants = [
      { name: "Sarah Johnson", avatar: null, lastMessage: "Thanks for the quick response!", unread: true },
      { name: "Mike Chen", avatar: null, lastMessage: "When does the event start?", unread: true },
      { name: "Emily Brown", avatar: null, lastMessage: "I'll be there!", unread: false },
      { name: "David Wilson", avatar: null, lastMessage: "Can I get a refund?", unread: false, starred: true },
      { name: "Lisa Anderson", avatar: null, lastMessage: "Great event last week!", unread: false },
    ];

    participants.forEach((p, i) => {
      const id = randomUUID();
      this.conversations.set(id, {
        id,
        participantName: p.name,
        participantAvatar: p.avatar,
        lastMessage: p.lastMessage,
        lastMessageTime: i === 0 ? "Just now" : i === 1 ? "2m ago" : `${i}h ago`,
        unread: p.unread,
        starred: p.starred || false,
      });

      // Add messages for each conversation
      const messageTexts = [
        "Hi, I have a question about the upcoming event.",
        "Of course! How can I help you?",
        "What time does the venue open?",
        "The doors open at 6 PM, and the event starts at 7 PM.",
        p.lastMessage,
      ];

      messageTexts.forEach((content, j) => {
        const msgId = randomUUID();
        this.messages.set(msgId, {
          id: msgId,
          conversationId: id,
          content,
          senderId: j % 2 === 0 ? "user" : "admin",
          timestamp: `${10 + j}:${j < 10 ? "0" : ""}${j * 5} AM`,
          isOwn: j % 2 !== 0,
        });
      });
    });

    // Seed transactions
    const transactionTypes = ["credit", "debit", "credit", "credit", "debit"];
    const transactionAmounts = [500, 150, 1000, 250, 75];
    const transactionDescriptions = ["Wallet top-up", "Event booking", "Refund received", "Prize money", "Service fee"];

    transactionTypes.forEach((type, i) => {
      const id = randomUUID();
      this.transactions.set(id, {
        id,
        userId: adminId,
        type,
        amount: transactionAmounts[i],
        status: "completed",
        description: transactionDescriptions[i],
        date: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    });

    // Seed support tickets
    const ticketSubjects = [
      "Payment not received",
      "Event cancellation request",
      "Technical issue with app",
    ];

    ticketSubjects.forEach((subject, i) => {
      const ticketId = randomUUID();
      const statuses: Array<"open" | "in_progress" | "closed"> = ["open", "in_progress", "closed"];
      this.tickets.set(ticketId, {
        id: ticketId,
        userId: adminId,
        subject,
        message: `I'm experiencing an issue with ${subject.toLowerCase()}. Please help.`,
        status: statuses[i],
        createdAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      // Add responses for closed/in_progress tickets
      if (i > 0) {
        const responseId = randomUUID();
        this.ticketResponses.set(responseId, {
          id: responseId,
          ticketId,
          message: "Thank you for reaching out. We're looking into this issue and will get back to you shortly.",
          isAdmin: true,
          createdAt: new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    });

    // Seed loans
    const loanId = randomUUID();
    this.loans.set(loanId, {
      id: loanId,
      userId: adminId,
      amount: 5000,
      duration: 12,
      purpose: "Event expansion and marketing",
      status: "approved",
      emi: 438,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    });

    // Seed subscriptions
    const subId = randomUUID();
    this.subscriptions.set(subId, {
      id: subId,
      userId: adminId,
      plan: "pro",
      price: 29,
      status: "active",
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      endDate: null,
    });

    // Seed activities
    const activityDescriptions = [
      { action: "Booking", description: "booked tickets for Summer Music Festival", userName: "John Doe" },
      { action: "Payment", description: "completed payment of $150", userName: "Sarah Williams" },
      { action: "Event", description: "created new event: Tech Conference 2024", userName: "Admin User" },
      { action: "Refund", description: "requested refund for cancelled event", userName: "Mike Johnson" },
      { action: "Review", description: "left a 5-star review for Jazz Night", userName: "Emily Brown" },
      { action: "Signup", description: "created a new account", userName: "Alex Turner" },
    ];

    activityDescriptions.forEach((activity, i) => {
      const id = randomUUID();
      this.activities.set(id, {
        id,
        userId: randomUUID(),
        userName: activity.userName,
        userAvatar: null,
        action: activity.action,
        description: activity.description,
        timestamp: i === 0 ? "Just now" : i === 1 ? "5 minutes ago" : `${i} hours ago`,
      });
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, role: "user" };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const newEvent: Event = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updatedEvent = { ...event, ...data };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const newOrder: Order = { ...order, id };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  // Conversations & Messages
  async getConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const newConversation: Conversation = { ...conversation, id };
    this.conversations.set(id, newConversation);
    return newConversation;
  }

  async updateConversation(id: string, data: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    const updated = { ...conversation, ...data };
    this.conversations.set(id, updated);
    return updated;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values()).filter((m) => m.conversationId === conversationId);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const newMessage: Message = { ...message, id };
    this.messages.set(id, newMessage);

    // Update conversation's last message
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      this.conversations.set(message.conversationId, {
        ...conversation,
        lastMessage: message.content,
        lastMessageTime: "Just now",
      });
    }

    return newMessage;
  }

  // Wallet
  async getWallet(userId: string): Promise<Wallet> {
    const transactions = await this.getTransactions(userId);
    const balance = transactions.reduce((acc, t) => {
      return t.type === "credit" ? acc + t.amount : acc - t.amount;
    }, 0);
    return { balance: Math.max(0, balance + 2500), transactions };
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((t) => t.userId === userId || userId === "admin")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = { ...transaction, id };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  // Tickets
  async getTickets(userId: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values())
      .filter((t) => t.userId === userId || userId === "admin")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const newTicket: Ticket = { ...ticket, id };
    this.tickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicket(id: string, data: Partial<Ticket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    const updated = { ...ticket, ...data };
    this.tickets.set(id, updated);
    return updated;
  }

  async getTicketResponses(ticketId: string): Promise<TicketResponse[]> {
    return Array.from(this.ticketResponses.values())
      .filter((r) => r.ticketId === ticketId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createTicketResponse(response: InsertTicketResponse): Promise<TicketResponse> {
    const id = randomUUID();
    const newResponse: TicketResponse = { ...response, id };
    this.ticketResponses.set(id, newResponse);
    return newResponse;
  }

  // Loans
  async getLoans(userId: string): Promise<Loan[]> {
    return Array.from(this.loans.values())
      .filter((l) => l.userId === userId || userId === "admin")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getLoan(id: string): Promise<Loan | undefined> {
    return this.loans.get(id);
  }

  async createLoan(loan: InsertLoan & { emi?: number }): Promise<Loan> {
    const id = randomUUID();
    const newLoan: Loan = { ...loan, id, emi: loan.emi || null };
    this.loans.set(id, newLoan);
    return newLoan;
  }

  // Subscriptions
  async getSubscriptions(userId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values())
      .filter((s) => s.userId === userId || userId === "admin")
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  async getActiveSubscription(userId: string): Promise<Subscription | undefined> {
    return Array.from(this.subscriptions.values()).find(
      (s) => (s.userId === userId || userId === "admin") && s.status === "active"
    );
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    
    // Deactivate current active subscription
    const active = await this.getActiveSubscription(subscription.userId);
    if (active) {
      this.subscriptions.set(active.id, { ...active, status: "inactive", endDate: new Date().toISOString() });
    }

    const newSubscription: Subscription = { ...subscription, id };
    this.subscriptions.set(id, newSubscription);
    return newSubscription;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const events = await this.getEvents();
    const orders = await this.getOrders();
    const users = Array.from(this.users.values());

    const activeEvents = events.filter((e) => e.status === "active").length;
    const totalRevenue = orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((acc, o) => acc + o.amount, 0);

    const monthlyRevenue = [
      { month: "Jan", revenue: 12500 },
      { month: "Feb", revenue: 18200 },
      { month: "Mar", revenue: 15800 },
      { month: "Apr", revenue: 22400 },
      { month: "May", revenue: 19600 },
      { month: "Jun", revenue: totalRevenue || 24800 },
    ];

    const categoryCounts = events.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const colors = ["hsl(217, 91%, 60%)", "hsl(195, 80%, 50%)", "hsl(27, 87%, 55%)", "hsl(340, 82%, 52%)", "hsl(142, 71%, 45%)"];
    const categoryBreakdown = Object.entries(categoryCounts).map(([category, count], i) => ({
      category,
      count,
      fill: colors[i % colors.length],
    }));

    return {
      totalEvents: events.length,
      activeEvents,
      registeredUsers: users.length + 145,
      totalRevenue,
      monthlyRevenue,
      categoryBreakdown,
    };
  }
}

export const storage = new MemStorage();
