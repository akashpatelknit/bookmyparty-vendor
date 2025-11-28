import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Search,
  Star,
  Paperclip,
  Send,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Conversation, Message } from "@/types/types";

type FilterType = "all" | "unread" | "starred";

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-md hover-elevate",
        isActive && "bg-sidebar-accent"
      )}
      onClick={onClick}
      data-testid={`conversation-item-${conversation.id}`}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.participantAvatar || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
            {conversation.participantName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {conversation.unread && (
          <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-sm truncate",
              conversation.unread && "font-semibold"
            )}
          >
            {conversation.participantName}
          </span>
          <span className="text-xs text-muted-foreground shrink-0">
            {conversation.lastMessageTime}
          </span>
        </div>
        <p
          className={cn(
            "text-sm truncate mt-0.5",
            conversation.unread ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {conversation.lastMessage}
        </p>
      </div>
      {conversation.starred && (
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  return (
    <div
      className={cn(
        "flex mb-4",
        message.isOwn ? "justify-end" : "justify-start"
      )}
      data-testid={`message-bubble-${message.id}`}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2.5",
          message.isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted rounded-bl-sm"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <div
          className={cn(
            "flex items-center gap-1 mt-1",
            message.isOwn ? "justify-end" : "justify-start"
          )}
        >
          <span
            className={cn(
              "text-xs",
              message.isOwn
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            )}
          >
            {message.timestamp}
          </span>
          {message.isOwn && (
            <CheckCheck
              className={cn(
                "h-3.5 w-3.5",
                message.isOwn
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Send className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold mb-1">Select a conversation</h3>
      <p className="text-sm text-muted-foreground">
        Choose a conversation from the list to start messaging
      </p>
    </div>
  );
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // const { data: conversations, isLoading: conversationsLoading } = useQuery<
  //   Conversation[]
  // >({
  //   queryKey: ["/api/conversations"],
  // });

  // const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
  //   queryKey: ["/api/messages", selectedConversation?.id],
  //   enabled: !!selectedConversation?.id,
  // });

  const conversationsLoading = false;
  const messagesLoading = false;

  const conversations: Conversation[] = [
    {
      id: "c1",
      participantName: "John Doe",
      participantAvatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Got it, thanks!",
      lastMessageTime: "10:24 AM",
      unread: true,
      starred: false,
    },
    {
      id: "c2",
      participantName: "Sarah Johnson",
      participantAvatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "When is the delivery?",
      lastMessageTime: "Yesterday",
      unread: false,
      starred: true,
    },
    {
      id: "c3",
      participantName: "Michael Smith",
      participantAvatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Let me check and update you.",
      lastMessageTime: "Mon",
      unread: false,
      starred: false,
    },
    {
      id: "c4",
      participantName: "Emily Davis",
      participantAvatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Thank you!",
      lastMessageTime: "2 weeks ago",
      unread: true,
      starred: false,
    },
  ];

  const messages: Message[] = [
    {
      id: "m1",
      conversationId: "c1",
      content: "Hi! I need help with my order.",
      senderId: "user1",
      timestamp: "10:00 AM",
      isOwn: false,
    },
    {
      id: "m2",
      conversationId: "c1",
      content: "Sure, can you share your order ID?",
      senderId: "admin",
      timestamp: "10:02 AM",
      isOwn: true,
    },
    {
      id: "m3",
      conversationId: "c1",
      content: "It's #ORD12345",
      senderId: "user1",
      timestamp: "10:10 AM",
      isOwn: false,
    },
    {
      id: "m4",
      conversationId: "c1",
      content: "Got it, checking now.",
      senderId: "admin",
      timestamp: "10:24 AM",
      isOwn: true,
    },
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/messages", {
        conversationId: selectedConversation?.id,
        content,
        senderId: "admin",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/messages", selectedConversation?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setNewMessage("");
    },
  });

  const filteredConversations = (conversations || []).filter((conv) => {
    const matchesSearch = conv.participantName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conv.unread) ||
      (filter === "starred" && conv.starred);
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-card flex flex-col shrink-0">
        <div className="p-4 border-b space-y-3">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-conversations"
            />
          </div>
          <Tabs
            value={filter}
            onValueChange={(v) => setFilter(v as FilterType)}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all" data-testid="tab-all">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" data-testid="tab-unread">
                Unread
                {(conversations?.filter((c) => c.unread).length || 0) > 0 && (
                  <Badge variant="secondary" className="ml-1.5 h-5 px-1.5">
                    {conversations?.filter((c) => c.unread).length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="starred" data-testid="tab-starred">
                Starred
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversationsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredConversations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No conversations found
              </p>
            ) : (
              filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={selectedConversation?.id === conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedConversation.participantAvatar || undefined}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedConversation.participantName
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {selectedConversation.participantName}
                  </h3>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" data-testid="button-call">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-video">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-info">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" data-testid="button-more">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex",
                        i % 2 === 0 ? "justify-end" : "justify-start"
                      )}
                    >
                      <Skeleton className="h-16 w-48 rounded-2xl" />
                    </div>
                  ))}
                </div>
              ) : (
                (messages || []).map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" data-testid="button-attach">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  data-testid="button-send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
