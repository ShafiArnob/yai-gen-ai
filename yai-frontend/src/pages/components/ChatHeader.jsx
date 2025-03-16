import { Button } from "@/components/ui/button";
import { MessageSquare, Sun } from "lucide-react";
import React from "react";

const ChatHeader = () => {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <h1 className="text-xl font-bold">Ant Equipment Co</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="rounded-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Sun className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="sm">
          Deploy your own
        </Button>
      </div>
    </header>
  );
};

export default ChatHeader;
