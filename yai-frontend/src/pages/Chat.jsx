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

  const chatMessages = [
    {
      id: 1,
      message_bubble_type: "none",
      role: "user",
      message: "Hello, how are you?",
    },
    {
      id: 2,
      message_bubble_type: "res-message",
      role: "ai",
      message: "I'm good! How can I assist you today?",
    },
    {
      id: 3,
      message_bubble_type: "none",
      role: "user",
      message: "What is the capital of France?",
    },
    {
      id: 4,
      message_bubble_type: "res-message",
      role: "ai",
      message: "The capital of France is Paris.",
    },
    {
      id: 5,
      message_bubble_type: "none",
      role: "user",
      message: "Tell me a joke.",
    },
    {
      id: 6,
      message_bubble_type: "res-message",
      role: "ai",
      message:
        "Sure! Why don’t skeletons fight each other? Because they don’t have the guts!",
    },
    {
      id: 7,
      message_bubble_type: "none",
      role: "user",
      message: "Convert 100 USD to EUR.",
    },
    {
      id: 8,
      message_bubble_type: "res-message",
      role: "ai",
      message:
        "Exchange rates change frequently. Please check a currency converter for real-time rates.",
    },
    {
      id: 9,
      message_bubble_type: "none",
      role: "user",
      message: "Who wrote 'To Kill a Mockingbird'?",
    },
    {
      id: 10,
      message_bubble_type: "res-message",
      role: "ai",
      message: "Harper Lee wrote 'To Kill a Mockingbird'.",
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-white ">
      {/* Header */}
      <ChatHeader />
      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Chat history */}
        <ChatSessions />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col w-8/12 ">
          <ChatMessagesArea chatMessages={chatMessages} />

          {/* Message input */}
          <ChatInput />
        </div>

        {/* Right sidebar - Knowledge Base */}
        <div className="w-3/12 border-l p-4 overflow-y-auto">
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
