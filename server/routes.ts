import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTicketSchema, insertLoanSchema, insertSubscriptionSchema, insertTransactionSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // Activities
  app.get("/api/activities", async (req, res) => {
    try {
      const activities = await storage.getActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  // Events
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to get events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to get event" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to get orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to get order" });
    }
  });

  // Conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  // Messages
  app.get("/api/messages/:conversationId", async (req, res) => {
    try {
      const messages = await storage.getMessages(req.params.conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid message data" });
      }
      const message = await storage.createMessage(result.data);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Wallet
  app.get("/api/wallet", async (req, res) => {
    try {
      const wallet = await storage.getWallet("admin");
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: "Failed to get wallet" });
    }
  });

  app.post("/api/wallet/transactions", async (req, res) => {
    try {
      const result = insertTransactionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid transaction data" });
      }
      const transaction = await storage.createTransaction(result.data);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // User Profile
  app.get("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("admin");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  app.patch("/api/user/profile", async (req, res) => {
    try {
      const user = await storage.getUserByUsername("admin");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await storage.updateUser(user.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.post("/api/user/password", async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await storage.getUserByUsername("admin");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (user.password !== oldPassword) {
        return res.status(400).json({ error: "Invalid old password" });
      }
      await storage.updateUser(user.id, { password: newPassword });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Support Tickets
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets("admin");
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tickets" });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const result = insertTicketSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid ticket data" });
      }
      const ticket = await storage.createTicket(result.data);
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.get("/api/tickets/:ticketId/responses", async (req, res) => {
    try {
      const responses = await storage.getTicketResponses(req.params.ticketId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to get ticket responses" });
    }
  });

  // Loans
  app.get("/api/loans", async (req, res) => {
    try {
      const loans = await storage.getLoans("admin");
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to get loans" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const loan = await storage.createLoan(req.body);
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: "Failed to create loan" });
    }
  });

  // Subscriptions
  app.get("/api/subscriptions", async (req, res) => {
    try {
      const subscriptions = await storage.getSubscriptions("admin");
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to get subscriptions" });
    }
  });

  app.post("/api/subscriptions", async (req, res) => {
    try {
      const result = insertSubscriptionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid subscription data" });
      }
      const subscription = await storage.createSubscription(result.data);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  return httpServer;
}
