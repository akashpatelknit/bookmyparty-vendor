import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  User,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Ticket, TicketResponse } from "@/types/types";
import { cn } from "@/lib/utils";

const ticketFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message too long"),
});

type TicketFormData = z.infer<typeof ticketFormSchema>;

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return <Circle className="h-4 w-4 text-blue-500" />;
    case "in_progress":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "closed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default:
      return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "closed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    default:
      return "";
  }
}

function TicketResponseItem({ response }: { response: TicketResponse }) {
  return (
    <div
      className={cn(
        "flex gap-3 p-3 rounded-lg",
        response.isAdmin ? "bg-primary/5" : "bg-muted/50"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback
          className={cn(
            response.isAdmin
              ? "bg-primary text-primary-foreground"
              : "bg-secondary"
          )}
        >
          {response.isAdmin ? (
            <Shield className="h-4 w-4" />
          ) : (
            <User className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {response.isAdmin ? "Admin" : "You"}
          </span>
          <span className="text-xs text-muted-foreground">
            {response.createdAt}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{response.message}</p>
      </div>
    </div>
  );
}

function TicketItem({ ticket }: { ticket: Ticket }) {
  const [isOpen, setIsOpen] = useState(false);

  // const { data: responses } = useQuery<TicketResponse[]>({
  //   queryKey: ["/api/tickets", ticket.id, "responses"],
  //   enabled: isOpen,
  // });

  const responsesData: Record<string, TicketResponse[]> = {
    tkt_001: [
      {
        id: "res_001",
        ticketId: "tkt_001",
        message: "We’re checking this issue for you. Please hold tight!",
        isAdmin: true,
        createdAt: "Nov 20, 2025, 10:20 AM",
      },
      {
        id: "res_002",
        ticketId: "tkt_001",
        message: "Thank you. I’ll wait for the update.",
        isAdmin: false,
        createdAt: "Nov 20, 2025, 10:25 AM",
      },
    ],

    tkt_002: [
      {
        id: "res_003",
        ticketId: "tkt_002",
        message:
          "Payment confirmation is pending from the gateway. It will update shortly.",
        isAdmin: true,
        createdAt: "Nov 19, 2025, 3:00 PM",
      },
    ],

    tkt_003: [
      {
        id: "res_004",
        ticketId: "tkt_003",
        message: "The issue has been fixed. Please try again.",
        isAdmin: true,
        createdAt: "Nov 18, 2025, 12:00 PM",
      },
      {
        id: "res_005",
        ticketId: "tkt_003",
        message: "Yes, it’s working now. Thanks!",
        isAdmin: false,
        createdAt: "Nov 18, 2025, 12:10 PM",
      },
    ],
  };

  const responses = responsesData[ticket.id] || [];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-3" data-testid={`ticket-item-${ticket.id}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover-elevate rounded-t-lg pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(ticket.status || "open")}
                  <CardTitle className="text-base truncate">
                    {ticket.subject}
                  </CardTitle>
                </div>
                <CardDescription className="line-clamp-1">
                  {ticket.message}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  className={cn(
                    "text-xs",
                    getStatusColor(ticket.status || "open")
                  )}
                >
                  {ticket.status?.replace("_", " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {ticket.createdAt}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 mb-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-secondary text-xs">
                      <User className="h-3 w-3" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">You</span>
                  <span className="text-xs text-muted-foreground">
                    {ticket.createdAt}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground pl-8">
                  {ticket.message}
                </p>
              </div>

              {responses?.map((response) => (
                <TicketResponseItem key={response.id} response={response} />
              ))}

              {(!responses || responses.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No responses yet. Our team will get back to you soon.
                </p>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export default function Support() {
  const { toast } = useToast();

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // const { data: tickets, isLoading } = useQuery<Ticket[]>({
  //   queryKey: ["/api/tickets"],
  // });

  const isLoading = false;

  const tickets: Ticket[] = [
    {
      id: "tkt_001",
      userId: "admin",
      subject: "Unable to access my account",
      message: "Whenever I try to log in, I get an unexpected error message.",
      status: "open",
      createdAt: "Nov 20, 2025, 10:15 AM",
    },
    {
      id: "tkt_002",
      userId: "admin",
      subject: "Payment not reflecting",
      message:
        "I completed the payment but my wallet balance has not updated yet.",
      status: "in_progress",
      createdAt: "Nov 19, 2025, 2:30 PM",
    },
    {
      id: "tkt_003",
      userId: "admin",
      subject: "Issue with event registration",
      message: "The register button does nothing when clicked.",
      status: "closed",
      createdAt: "Nov 18, 2025, 11:05 AM",
    },
  ];

  const createTicketMutation = useMutation({
    mutationFn: async (data: TicketFormData) => {
      return apiRequest("POST", "/api/tickets", {
        userId: "admin",
        subject: data.subject,
        message: data.message,
        status: "open",
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Ticket submitted",
        description: "Your support ticket has been created successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TicketFormData) => {
    createTicketMutation.mutate(data);
  };

  const openTickets = tickets?.filter((t) => t.status === "open").length || 0;
  const inProgressTickets =
    tickets?.filter((t) => t.status === "in_progress").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Admin</h1>
        <p className="text-muted-foreground">Get help from our support team</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Ticket Form */}
        <Card data-testid="card-create-ticket">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Submit a Ticket</CardTitle>
                <CardDescription>
                  Describe your issue and we'll help you
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of your issue"
                          {...field}
                          data-testid="input-subject"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about your issue..."
                          className="min-h-[150px] resize-none"
                          {...field}
                          data-testid="input-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    data-testid="button-attach-file"
                  >
                    <Paperclip className="h-4 w-4 mr-2" />
                    Attach File
                  </Button>
                  <Button
                    type="submit"
                    disabled={createTicketMutation.isPending}
                    data-testid="button-submit-ticket"
                  >
                    {createTicketMutation.isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Ticket Stats */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card data-testid="card-open-tickets">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Circle className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{openTickets}</p>
                    <p className="text-sm text-muted-foreground">
                      Open Tickets
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card data-testid="card-in-progress-tickets">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{inProgressTickets}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-2">Need quick help?</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Check our FAQ section for common questions</li>
                <li>Average response time: 2-4 hours</li>
                <li>Priority support for Enterprise users</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ticket History */}
      <Card data-testid="card-ticket-history">
        <CardHeader>
          <CardTitle>Ticket History</CardTitle>
          <CardDescription>View and track your support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !tickets || tickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tickets yet</p>
              <p className="text-sm text-muted-foreground">
                Submit a ticket above to get help from our team
              </p>
            </div>
          ) : (
            <div>
              {tickets.map((ticket) => (
                <TicketItem key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
