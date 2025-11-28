import { useLocation, Link } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  Wallet,
  Lock,
  ShoppingCart,
  HelpCircle,
  Landmark,
  CreditCard,
  UserCog,
  LogOut,
  Trash2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Orders", url: "/orders", icon: ShoppingCart },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Loans", url: "/loans", icon: Landmark },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  {
    title: "Events",
    icon: Calendar,
    url: "/events",
    children: [
      { title: "All Events", url: "/events" },
      { title: "Create Event", url: "/events/create" },
      { title: "Categories", url: "/events/categories" },
    ],
  },
];

const supportMenuItems = [
  { title: "Contact Admin", url: "/support", icon: HelpCircle },
];

const accountMenuItems = [
  { title: "Edit Profile", url: "/profile", icon: UserCog },
  { title: "Password", url: "/password", icon: Lock },
  {
    title: "Delete Account",
    url: "/delete-account",
    icon: Trash2,
    danger: true,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  const isActive = (url: string) => {
    if (url === "/") return location === "/";
    return location.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">
              BookMyParty
            </span>
            <span className="text-xs text-muted-foreground">
              Vendor Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-2">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full transition-colors",
                            isActive(item.url) &&
                              "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                        >
                          <div className="flex items-center w-full">
                            <item.icon className="h-4 w-4 mr-2" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>

                    <CollapsibleContent>
                      <div className="ml-6 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <SidebarMenuItem key={child.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive(child.url)}
                              className={cn(
                                "w-full text-sm text-muted-foreground hover:text-sidebar-foreground",
                                isActive(child.url) &&
                                  "bg-sidebar-accent text-sidebar-accent-foreground"
                              )}
                            >
                              <Link href={child.url}>{child.title}</Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      className={cn(
                        "w-full",
                        isActive(item.url) &&
                          "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-2">
            Support
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "w-full transition-colors",
                      isActive(item.url) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Link
                      href={item.url}
                      data-testid={`link-${item.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={cn(
                      "w-full transition-colors",
                      isActive(item.url) &&
                        "bg-sidebar-accent text-sidebar-accent-foreground",
                      item.danger && "text-destructive hover:text-destructive"
                    )}
                  >
                    <Link
                      href={item.url}
                      data-testid={`link-${item.title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/api/placeholder/40/40" alt="Admin" />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              Vendor
            </span>
            <span className="text-xs text-muted-foreground truncate">
              vendor@gmail.com
            </span>
          </div>
          <Link href="/logout" data-testid="link-logout">
            <div className="p-2 rounded-md hover-elevate cursor-pointer">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
