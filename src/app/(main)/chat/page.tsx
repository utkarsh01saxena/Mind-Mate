
"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { chatWithAi } from "@/ai/flows/ai-chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

type ChatInput = z.infer<typeof chatSchema>;
type Message = {
  role: "user" | "bot";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatInput>({
    resolver: zodResolver(chatSchema),
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const onSubmit: SubmitHandler<ChatInput> = async (data) => {
    const userMessage: Message = { role: "user", content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    reset();

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const response = await chatWithAi({ message: data.message, chatHistory });
      const botMessage: Message = { role: "bot", content: response.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with AI chat:", error);
      const errorMessage: Message = {
        role: "bot",
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col m-4 md:m-6 lg:m-8">
        <CardHeader>
          <CardTitle>AI Chatbot</CardTitle>
          <CardDescription>
            Chat anonymously about your feelings. This is a safe, non-clinical space for support.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" viewportRef={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-4",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "bot" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xl p-3 rounded-lg shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === "user" && (
                     <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={20} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                 <div className="flex items-start gap-4 justify-start">
                    <Avatar className="w-8 h-8">
                       <AvatarFallback className="bg-primary/20 text-primary">
                        <Bot size={20} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-md p-3 rounded-lg bg-gray-200">
                      <div className="flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0s]"></span>
                         <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></span>
                         <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-start pt-4 border-t">
            <div className="flex-1">
              <Input
                {...register("message")}
                placeholder="Type your message..."
                disabled={isLoading}
                autoComplete="off"
                className="bg-background"
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} size="icon">
              <Send size={20} />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
