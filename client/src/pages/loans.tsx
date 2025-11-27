import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  Calculator,
  Calendar,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Loan } from "@shared/schema";
import { cn } from "@/lib/utils";

const loanFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  duration: z.string().min(1, "Duration is required"),
  purpose: z.string().min(10, "Purpose must be at least 10 characters"),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-destructive" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
    case "pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "";
  }
}

function LoanStatusCard({ loan }: { loan: Loan | null }) {
  if (!loan) {
    return (
      <Card className="border-dashed" data-testid="card-no-active-loan">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Landmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-1">No Active Loan</h3>
            <p className="text-sm text-muted-foreground">
              Apply for a loan to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = loan.status === "approved" ? 35 : 0;

  return (
    <Card data-testid="card-loan-status">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Loan</CardTitle>
          <Badge className={cn("text-xs", getStatusColor(loan.status || "pending"))}>
            {loan.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          {getStatusIcon(loan.status || "pending")}
          <div className="flex-1">
            <p className="text-2xl font-bold">${loan.amount.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">
              {loan.duration} months @ {loan.emi ? `$${loan.emi}/mo` : "Calculating..."}
            </p>
          </div>
        </div>

        {loan.status === "approved" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repayment Progress</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-sm">
            <p className="text-muted-foreground">Purpose</p>
            <p className="font-medium capitalize">{loan.purpose}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Applied</p>
            <p className="font-medium">{loan.createdAt}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [duration, setDuration] = useState(12);
  const interestRate = 8.5;

  const calculateEMI = (principal: number, months: number, rate: number) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI(loanAmount, duration, interestRate);
  const totalPayment = emi * duration;
  const totalInterest = totalPayment - loanAmount;

  return (
    <Card data-testid="card-emi-calculator">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">EMI Calculator</CardTitle>
            <CardDescription>Estimate your monthly payments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Loan Amount</label>
              <span className="font-medium">${loanAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={[loanAmount]}
              onValueChange={([value]) => setLoanAmount(value)}
              min={1000}
              max={100000}
              step={1000}
              className="w-full"
              data-testid="slider-loan-amount"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label>Duration</label>
              <span className="font-medium">{duration} months</span>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([value]) => setDuration(value)}
              min={6}
              max={60}
              step={6}
              className="w-full"
              data-testid="slider-duration"
            />
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Monthly EMI</span>
            <span className="text-xl font-bold text-primary">${emi.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-medium">${totalInterest.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Payment</span>
            <span className="font-medium">${totalPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Interest Rate</span>
            <span className="font-medium">{interestRate}% p.a.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoanHistoryTable({ loans, loading }: { loans: Loan[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <div className="text-center py-8">
        <Landmark className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No loan history</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>EMI</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow key={loan.id} data-testid={`loan-row-${loan.id}`}>
            <TableCell className="font-medium">${loan.amount.toLocaleString()}</TableCell>
            <TableCell>{loan.duration} months</TableCell>
            <TableCell>{loan.emi ? `$${loan.emi}` : "-"}</TableCell>
            <TableCell>
              <Badge className={cn("text-xs", getStatusColor(loan.status || "pending"))}>
                {loan.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{loan.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Loans() {
  const { toast } = useToast();

  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      amount: "",
      duration: "",
      purpose: "",
    },
  });

  const { data: loans, isLoading } = useQuery<Loan[]>({
    queryKey: ["/api/loans"],
  });

  const applyLoanMutation = useMutation({
    mutationFn: async (data: LoanFormData) => {
      const amount = parseInt(data.amount);
      const duration = parseInt(data.duration);
      const monthlyRate = 8.5 / 12 / 100;
      const emi = Math.round(
        (amount * monthlyRate * Math.pow(1 + monthlyRate, duration)) /
        (Math.pow(1 + monthlyRate, duration) - 1)
      );

      return apiRequest("POST", "/api/loans", {
        userId: "admin",
        amount,
        duration,
        purpose: data.purpose,
        status: "pending",
        emi,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Loan application submitted",
        description: "Your loan application is under review.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/loans"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit loan application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoanFormData) => {
    applyLoanMutation.mutate(data);
  };

  const activeLoan = loans?.find((l) => l.status === "approved" || l.status === "pending") || null;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Loans</h1>
        <p className="text-muted-foreground">Apply for loans and manage your applications</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Loan Status */}
        <LoanStatusCard loan={activeLoan} />

        {/* EMI Calculator */}
        <EMICalculator />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Loan Application Form */}
        <Card data-testid="card-loan-application">
          <CardHeader>
            <CardTitle>Apply for a Loan</CardTitle>
            <CardDescription>Fill out the form to submit a loan application</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loan Amount ($)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="Enter amount"
                            className="pl-9"
                            {...field}
                            data-testid="input-loan-amount"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-duration">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                          <SelectItem value="48">48 months</SelectItem>
                          <SelectItem value="60">60 months</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the purpose of this loan..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          data-testid="input-loan-purpose"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={applyLoanMutation.isPending || !!activeLoan}
                  data-testid="button-apply-loan"
                >
                  {applyLoanMutation.isPending ? "Submitting..." : "Apply for Loan"}
                </Button>

                {activeLoan && (
                  <p className="text-sm text-muted-foreground text-center">
                    You already have an active loan application
                  </p>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loan History */}
        <Card data-testid="card-loan-history">
          <CardHeader>
            <CardTitle>Loan History</CardTitle>
            <CardDescription>Your past loan applications</CardDescription>
          </CardHeader>
          <CardContent>
            <LoanHistoryTable loans={loans || []} loading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
