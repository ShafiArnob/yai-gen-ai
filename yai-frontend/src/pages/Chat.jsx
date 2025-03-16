import React, { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import { MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatSessions from "./components/ChatSessions";
import ChatInput from "./components/ChatInput";
import ChatMessagesArea from "./components/ChatMessagesArea";

const Chat = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [currentMessage, setCurrentMessage] = useState({
    id: "current",
    content:
      "Hello! As an AI assistant, I'm doing well. How can I assist you today?",
    sender: "ai",
    timestamp: "Now",
  });

  const suggestedQuestions = [
    "What products or services does Anthropic offer?",
    "How can I get started with Anthropic's products?",
    "Do you have any tips for using Anthropic's tools effectively?",
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
        timestamp: "Now",
      };
      setMessages([...messages, newUserMessage]);
      setInputMessage("");
    }
  };
  return (
    <div className="flex flex-col h-screen bg-white ">
      {/* Header */}
      <ChatHeader />
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Chat history */}
        <ChatSessions />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          <ChatMessagesArea />

          {/* Message input */}
          <ChatInput />
        </div>

        {/* Right sidebar - Knowledge Base */}
        <div className="w-[360px] border-l p-4 overflow-y-auto">
          <h2 className="font-medium mb-4">Knowledge Base History</h2>
          <p className="text-sm text-gray-500">
            The assistant will display sources here once finding them
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
