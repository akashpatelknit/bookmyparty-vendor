import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Check,
  X,
  Crown,
  Zap,
  Building2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Subscription, SubscriptionPlan } from "@shared/schema";
import { cn } from "@/lib/utils";

const plans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9,
    features: [
      "Up to 5 events/month",
      "Basic analytics",
      "Email support",
      "Standard templates",
      "1 team member",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    recommended: true,
    features: [
      "Up to 50 events/month",
      "Advanced analytics",
      "Priority support",
      "Custom templates",
      "5 team members",
      "API access",
      "Custom branding",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99,
    features: [
      "Unlimited events",
      "Enterprise analytics",
      "24/7 dedicated support",
      "White-label solution",
      "Unlimited team members",
      "Full API access",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
];

const allFeatures = [
  { name: "Events per month", basic: "5", pro: "50", enterprise: "Unlimited" },
  { name: "Team members", basic: "1", pro: "5", enterprise: "Unlimited" },
  { name: "Analytics", basic: "Basic", pro: "Advanced", enterprise: "Enterprise" },
  { name: "API access", basic: false, pro: true, enterprise: true },
  { name: "Custom branding", basic: false, pro: true, enterprise: true },
  { name: "White-label", basic: false, pro: false, enterprise: true },
  { name: "Custom integrations", basic: false, pro: false, enterprise: true },
  { name: "SLA guarantee", basic: false, pro: false, enterprise: true },
  { name: "Priority support", basic: false, pro: true, enterprise: true },
  { name: "24/7 support", basic: false, pro: false, enterprise: true },
];

function getPlanIcon(planName: string) {
  switch (planName.toLowerCase()) {
    case "basic":
      return <Zap className="h-6 w-6" />;
    case "pro":
      return <Crown className="h-6 w-6" />;
    case "enterprise":
      return <Building2 className="h-6 w-6" />;
    default:
      return <Zap className="h-6 w-6" />;
  }
}

function CurrentPlanCard({ subscription, loading }: { subscription: Subscription | null; loading: boolean }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card className="border-dashed" data-testid="card-no-subscription">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium mb-1">No Active Subscription</h3>
            <p className="text-sm text-muted-foreground">
              Choose a plan below to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const plan = plans.find((p) => p.id === subscription.plan);

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20" data-testid="card-current-plan">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              {getPlanIcon(subscription.plan)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg capitalize">{subscription.plan} Plan</h3>
                <Badge className="bg-primary/20 text-primary">Active</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                ${plan?.price}/month
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Started</p>
            <p className="font-medium">{subscription.startDate}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-primary/10">
          <p className="text-sm text-muted-foreground mb-2">Included features:</p>
          <div className="grid grid-cols-2 gap-2">
            {plan?.features.slice(0, 4).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PricingCard({
  plan,
  currentPlan,
  onSelect,
  loading,
}: {
  plan: SubscriptionPlan;
  currentPlan: string | null;
  onSelect: () => void;
  loading: boolean;
}) {
  const isCurrent = currentPlan === plan.id;
  const isUpgrade = currentPlan && plans.findIndex((p) => p.id === currentPlan) < plans.findIndex((p) => p.id === plan.id);

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        plan.recommended && "border-primary shadow-md"
      )}
      data-testid={`card-plan-${plan.id}`}
    >
      {plan.recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-2">
        <div className={cn(
          "mx-auto h-12 w-12 rounded-lg flex items-center justify-center mb-2",
          plan.recommended ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {getPlanIcon(plan.name)}
        </div>
        <CardTitle>{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={plan.recommended ? "default" : "outline"}
          disabled={isCurrent || loading}
          onClick={onSelect}
          data-testid={`button-select-${plan.id}`}
        >
          {isCurrent ? (
            "Current Plan"
          ) : isUpgrade ? (
            <>
              Upgrade
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            "Select Plan"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function FeatureComparisonTable() {
  return (
    <Card data-testid="card-feature-comparison">
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
        <CardDescription>Compare all features across plans</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Feature</TableHead>
              <TableHead className="text-center">Basic</TableHead>
              <TableHead className="text-center">Pro</TableHead>
              <TableHead className="text-center">Enterprise</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allFeatures.map((feature) => (
              <TableRow key={feature.name}>
                <TableCell className="font-medium">{feature.name}</TableCell>
                <TableCell className="text-center">
                  {typeof feature.basic === "boolean" ? (
                    feature.basic ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    feature.basic
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.pro === "boolean" ? (
                    feature.pro ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    feature.pro
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {typeof feature.enterprise === "boolean" ? (
                    feature.enterprise ? (
                      <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    feature.enterprise
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Subscriptions() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const { data: subscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const currentSubscription = subscriptions?.find((s) => s.status === "active") || null;

  const updateSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const plan = plans.find((p) => p.id === planId);
      return apiRequest("POST", "/api/subscriptions", {
        userId: "admin",
        plan: planId,
        price: plan?.price || 0,
        status: "active",
        startDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Subscription updated",
        description: `You are now subscribed to the ${selectedPlan?.name} plan.`,
      });
      setConfirmDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSubscription = () => {
    if (selectedPlan) {
      updateSubscriptionMutation.mutate(selectedPlan.id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground">Manage your subscription plan</p>
      </div>

      {/* Current Plan */}
      <CurrentPlanCard subscription={currentSubscription} loading={isLoading} />

      {/* Pricing Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentPlan={currentSubscription?.plan || null}
              onSelect={() => handleSelectPlan(plan)}
              loading={updateSubscriptionMutation.isPending}
            />
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <FeatureComparisonTable />

      {/* Subscription History */}
      <Card data-testid="card-subscription-history">
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
          <CardDescription>Your past subscription changes</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !subscriptions || subscriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No subscription history
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium capitalize">{sub.plan}</TableCell>
                    <TableCell>${sub.price}/mo</TableCell>
                    <TableCell>
                      <Badge
                        variant={sub.status === "active" ? "default" : "secondary"}
                        className={cn(
                          sub.status === "active" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        )}
                      >
                        {sub.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{sub.startDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent data-testid="dialog-confirm-subscription">
          <DialogHeader>
            <DialogTitle>Confirm Subscription Change</DialogTitle>
            <DialogDescription>
              You are about to subscribe to the {selectedPlan?.name} plan at ${selectedPlan?.price}/month.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {selectedPlan && getPlanIcon(selectedPlan.name)}
              </div>
              <div>
                <p className="font-medium">{selectedPlan?.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  ${selectedPlan?.price}/month
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSubscription}
              disabled={updateSubscriptionMutation.isPending}
              data-testid="button-confirm-subscription"
            >
              {updateSubscriptionMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
