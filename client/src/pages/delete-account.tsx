import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertTriangle,
  Trash2,
  Shield,
  X,
  Check,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to confirm deletion"),
  confirmDelete: z.boolean().refine((val) => val === true, {
    message: "You must confirm that you understand the consequences",
  }),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

const consequences = [
  "All your events and event data will be permanently deleted",
  "Your order history and transaction records will be removed",
  "Any active subscriptions will be cancelled immediately",
  "Your wallet balance will be forfeited",
  "All messages and support tickets will be deleted",
  "This action cannot be undone",
];

export default function DeleteAccount() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmDelete: false,
    },
  });

  const handleDeleteAccount = async (data: DeleteAccountForm) => {
    setIsDeleting(true);
    
    // Simulate deletion process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast({
      title: "Account deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
    
    // Redirect to home
    setLocation("/");
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-destructive">Delete Account</h1>
        <p className="text-muted-foreground">Permanently delete your account and all associated data</p>
      </div>

      {/* Warning Alert */}
      <Alert variant="destructive" className="border-2" data-testid="alert-warning">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-lg font-semibold">Danger Zone</AlertTitle>
        <AlertDescription>
          This is a permanent action. Once you delete your account, there is no way to recover your data.
          Please read the consequences below carefully before proceeding.
        </AlertDescription>
      </Alert>

      {/* Consequences Card */}
      <Card className="border-destructive/50" data-testid="card-consequences">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            What happens when you delete your account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {consequences.map((consequence, index) => (
              <li key={index} className="flex items-start gap-3">
                <X className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <span className="text-sm">{consequence}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Delete Form */}
      <Card className="border-destructive/30" data-testid="card-delete-form">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            Confirm Account Deletion
          </CardTitle>
          <CardDescription>
            Enter your password to verify it's really you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleDeleteAccount)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password to confirm"
                        {...field}
                        data-testid="input-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="confirmDelete"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-destructive/30 p-4 bg-destructive/5">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-confirm"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium">
                        I understand that deleting my account is permanent and irreversible
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you acknowledge that all your data will be permanently deleted
                      </p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full sm:w-auto"
                  data-testid="button-cancel-delete"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isDeleting || !form.formState.isValid}
                  className="w-full sm:flex-1"
                  data-testid="button-delete-account"
                >
                  {isDeleting ? (
                    "Deleting Account..."
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Permanently Delete Account
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Alternative */}
      <Card className="bg-muted/30" data-testid="card-alternatives">
        <CardContent className="pt-6">
          <h4 className="font-medium mb-2">Not ready to delete?</h4>
          <p className="text-sm text-muted-foreground mb-4">
            If you're having issues with your account, our support team is here to help.
            Consider reaching out before making a permanent decision.
          </p>
          <Button variant="outline" onClick={() => setLocation("/support")} data-testid="button-contact-support">
            Contact Support Instead
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
