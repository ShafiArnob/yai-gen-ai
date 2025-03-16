import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import React, { useState } from "react";

const ChatSessions = () => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      content: "how are you?",
      sender: "user",
      timestamp: "Today, 01:35 PM",
    },
    {
      id: "2",
      content: "Hello! As an AI assistant, I'm ...",
      sender: "ai",
      timestamp: "Today, 01:35 PM",
    },
    {
      id: "3",
      content: "hey!",
      sender: "user",
      timestamp: "Today, 01:35 PM",
    },
    {
      id: "4",
      content: "Hello! How can I help you tod...",
      sender: "ai",
      timestamp: "Today, 01:35 PM",
    },
    {
      id: "5",
      content: "how are you?",
      sender: "user",
      timestamp: "Today, 01:18 PM",
    },
    {
      id: "6",
      content: "hello",
      sender: "user",
      timestamp: "Today, 01:18 PM",
    },
  ]);
  return (
    <div className="w-[300px] border-r p-4 overflow-y-auto">
      <div className="flex items-center mb-4">
        <MessageSquare className="h-4 w-4 mr-2" />
        <h2 className="font-medium">Chat History</h2>
      </div>
      <div className="space-y-2">
        {messages.map(
          (message) =>
            message.sender === "user" && (
              <Card
                key={message.id}
                className="p-3 hover:bg-gray-50  cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-gray-400">
                    {message.timestamp}
                  </span>
                </div>
                {message.id === "3" && (
                  <p className="text-sm text-gray-500 mt-1">
                    Hello! How can I help you tod...
                  </p>
                )}
              </Card>
            )
        )}
      </div>
    </div>
  );
};

export default ChatSessions;
