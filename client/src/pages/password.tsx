import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, Shield, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { updatePasswordSchema, type UpdatePassword } from "@shared/schema";
import { cn } from "@/lib/utils";

function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 15;
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;

    if (score < 40) return { score, label: "Weak", color: "bg-destructive" };
    if (score < 70) return { score, label: "Fair", color: "bg-yellow-500" };
    if (score < 90) return { score, label: "Good", color: "bg-emerald-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-600" };
  };

  const strength = getStrength(password);

  const requirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[a-z]/.test(password), text: "Lowercase letter" },
    { met: /[A-Z]/.test(password), text: "Uppercase letter" },
    { met: /[0-9]/.test(password), text: "Number" },
    { met: /[^a-zA-Z0-9]/.test(password), text: "Special character" },
  ];

  if (!password) return null;

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium",
            strength.score < 40 && "text-destructive",
            strength.score >= 40 && strength.score < 70 && "text-yellow-600 dark:text-yellow-500",
            strength.score >= 70 && "text-emerald-600 dark:text-emerald-500"
          )}>
            {strength.label}
          </span>
        </div>
        <Progress value={strength.score} className="h-2" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PasswordInput({
  field,
  placeholder,
  testId,
}: {
  field: any;
  placeholder: string;
  testId: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        {...field}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="pl-9 pr-10"
        data-testid={testId}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        data-testid={`${testId}-toggle`}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function Password() {
  const { toast } = useToast();

  const form = useForm<UpdatePassword>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: UpdatePassword) => {
      return apiRequest("POST", "/api/user/password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update password. Please check your old password and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdatePassword) => {
    updatePasswordMutation.mutate(data);
  };

  const newPassword = form.watch("newPassword");

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Update Password</h1>
        <p className="text-muted-foreground">Keep your account secure with a strong password</p>
      </div>

      <Card data-testid="card-password-update">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Enter your current password and choose a new secure password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Enter your current password"
                        testId="input-old-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Enter your new password"
                        testId="input-new-password"
                      />
                    </FormControl>
                    <PasswordStrengthIndicator password={newPassword} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        field={field}
                        placeholder="Confirm your new password"
                        testId="input-confirm-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={updatePasswordMutation.isPending}
                data-testid="button-save-password"
              >
                {updatePasswordMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Security Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>Never share your password with anyone</li>
          <li>Use a unique password for this account</li>
          <li>Consider using a password manager</li>
          <li>Enable two-factor authentication for extra security</li>
        </ul>
      </div>
    </div>
  );
}
