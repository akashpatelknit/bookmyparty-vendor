import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Wallet as WalletIcon,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  TrendingUp,
  Calendar,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Wallet, Transaction } from "@/types/types";
import { cn } from "@/lib/utils";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-1))",
  },
};

function BalanceCard({
  balance,
  loading,
}: {
  balance: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary to-primary/80">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 bg-white/20 mb-2" />
          <Skeleton className="h-10 w-40 bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="bg-gradient-to-br from-primary to-primary/80"
      data-testid="card-balance"
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
            <WalletIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-white/80">Current Balance</p>
            <p className="text-3xl font-bold text-white">
              ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/80">
          <TrendingUp className="h-4 w-4" />
          <span>+12.5% from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AddMoneyDialog({ onSubmit }: { onSubmit: (amount: number) => void }) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      onSubmit(numAmount);
      setAmount("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1" data-testid="button-add-money">
          <Plus className="h-4 w-4 mr-2" />
          Add Money
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Money to Wallet</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add to your wallet balance.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="amount">Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-2"
            data-testid="input-add-amount"
          />
          <div className="flex gap-2 mt-3">
            {[50, 100, 250, 500].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset.toString())}
                data-testid={`button-preset-${preset}`}
              >
                ${preset}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            data-testid="button-confirm-add"
          >
            Add Money
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WithdrawDialog({
  onSubmit,
  maxAmount,
}: {
  onSubmit: (amount: number) => void;
  maxAmount: number;
}) {
  const [amount, setAmount] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && numAmount <= maxAmount) {
      onSubmit(numAmount);
      setAmount("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex-1"
          data-testid="button-withdraw"
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Withdraw Money</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw. Maximum: $
            {maxAmount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="withdraw-amount">Amount ($)</Label>
          <Input
            id="withdraw-amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            max={maxAmount}
            className="mt-2"
            data-testid="input-withdraw-amount"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !amount ||
              parseFloat(amount) <= 0 ||
              parseFloat(amount) > maxAmount
            }
            data-testid="button-confirm-withdraw"
          >
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isCredit = transaction.type === "credit";

  return (
    <TableRow data-testid={`transaction-row-${transaction.id}`}>
      <TableCell className="font-mono text-sm">
        {transaction.id.slice(0, 8)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              isCredit
                ? "bg-emerald-100 dark:bg-emerald-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            )}
          >
            {isCredit ? (
              <ArrowDownLeft className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span className="capitalize">{transaction.type}</span>
        </div>
      </TableCell>
      <TableCell
        className={cn(
          "font-medium",
          isCredit
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-red-600 dark:text-red-400"
        )}
      >
        {isCredit ? "+" : "-"}${transaction.amount.toLocaleString()}
      </TableCell>
      <TableCell>
        <Badge
          variant={transaction.status === "completed" ? "default" : "secondary"}
          className={cn(
            transaction.status === "completed" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          )}
        >
          {transaction.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {transaction.date}
      </TableCell>
    </TableRow>
  );
}

export default function Wallet() {
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // const { data: wallet, isLoading } = useQuery<Wallet>({
  //   queryKey: ["/api/wallet"],
  // });
  const isLoading = false;
  const wallet: Wallet = {
    balance: 4250,
    transactions: [
      {
        id: "txn_001",
        userId: "admin",
        type: "credit",
        amount: 500,
        status: "completed",
        description: "Wallet top-up",
        date: "Nov 12, 2025",
      },
      {
        id: "txn_002",
        userId: "admin",
        type: "debit",
        amount: 300,
        status: "completed",
        description: "Withdrawal",
        date: "Nov 14, 2025",
      },
      {
        id: "txn_003",
        userId: "admin",
        type: "credit",
        amount: 1500,
        status: "completed",
        description: "Event Earnings",
        date: "Nov 15, 2025",
      },
      {
        id: "txn_004",
        userId: "admin",
        type: "debit",
        amount: 200,
        status: "completed",
        description: "Service Fee",
        date: "Nov 18, 2025",
      },
      {
        id: "txn_005",
        userId: "admin",
        type: "credit",
        amount: 2750,
        status: "completed",
        description: "Event Payout",
        date: "Nov 20, 2025",
      },
      {
        id: "txn_006",
        userId: "admin",
        type: "debit",
        amount: 500,
        status: "completed",
        description: "Bank Withdrawal",
        date: "Nov 22, 2025",
      },
      {
        id: "txn_007",
        userId: "admin",
        type: "credit",
        amount: 200,
        status: "completed",
        description: "Cashback",
        date: "Nov 23, 2025",
      },
    ],
  };

  const addMoneyMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/wallet/transactions", {
        userId: "admin",
        type: "credit",
        amount,
        status: "completed",
        description: "Wallet top-up",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("POST", "/api/wallet/transactions", {
        userId: "admin",
        type: "debit",
        amount,
        status: "completed",
        description: "Withdrawal",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
  });

  const filteredTransactions = (wallet?.transactions || []).filter((t) => {
    if (typeFilter === "all") return true;
    return t.type === typeFilter;
  });

  const walletActivityData = [
    { date: "Jan", balance: 2400 },
    { date: "Feb", balance: 3200 },
    { date: "Mar", balance: 2800 },
    { date: "Apr", balance: 4100 },
    { date: "May", balance: 3900 },
    { date: "Jun", balance: wallet?.balance || 4500 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your funds and transactions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-4">
          <BalanceCard balance={wallet?.balance || 0} loading={isLoading} />
          <div className="flex gap-3">
            <AddMoneyDialog
              onSubmit={(amount) => addMoneyMutation.mutate(amount)}
            />
            <WithdrawDialog
              onSubmit={(amount) => withdrawMutation.mutate(amount)}
              maxAmount={wallet?.balance || 0}
            />
          </div>
        </div>

        {/* Activity Chart */}
        <Card className="lg:col-span-2" data-testid="card-activity-chart">
          <CardHeader>
            <CardTitle>Wallet Activity</CardTitle>
            <CardDescription>
              Balance trend over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <AreaChart data={walletActivityData} accessibilityLayer>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--chart-1))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    className="text-xs text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    className="text-xs text-muted-foreground"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card data-testid="card-transactions">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                View and filter your recent transactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger
                  className="w-[150px]"
                  data-testid="select-type-filter"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <WalletIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
