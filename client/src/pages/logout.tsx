import { useState } from "react";
import { useLocation } from "wouter";
import { LogOut, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Logout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirm, setShowConfirm] = useState(true);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout process
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    
    // Redirect to dashboard (in a real app, this would go to login page)
    setLocation("/");
  };

  const handleCancel = () => {
    setLocation("/");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-6">
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm" data-testid="dialog-logout">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
              <AlertTriangle className="h-7 w-7 text-yellow-600 dark:text-yellow-500" />
            </div>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account? You'll need to sign in again to access your dashboard.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="w-full sm:w-auto"
              data-testid="button-cancel-logout"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full sm:w-auto"
              data-testid="button-confirm-logout"
            >
              {isLoggingOut ? (
                "Logging out..."
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fallback card when dialog is closed */}
      {!showConfirm && (
        <Card className="max-w-sm w-full" data-testid="card-logout">
          <CardHeader className="text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-2">
              <LogOut className="h-7 w-7 text-muted-foreground" />
            </div>
            <CardTitle>Session</CardTitle>
            <CardDescription>
              Manage your current session
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => setShowConfirm(true)} data-testid="button-show-logout">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Go back to dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
