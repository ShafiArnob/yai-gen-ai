import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:8000");

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Connect to socket on component mount
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    socket.on("error", (data) => {
      console.error("Error from server:", data.message);
      setMessages((prev) => [
        ...prev,
        {
          content: `Error: ${data.message}`,
          isUser: false,
          error: true,
        },
      ]);
      setIsTyping(false);
    });

    // Handle incoming message chunks
    socket.on("messageChunk", (data) => {
      if (data.isComplete) {
        // Complete message received
        setMessages((prev) => [
          ...prev,
          {
            content: currentResponse + data.chunk,
            isUser: false,
          },
        ]);
        setCurrentResponse("");
        setIsTyping(false);
      } else {
        // Accumulate streaming response
        setCurrentResponse((prev) => prev + data.chunk);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
      socket.off("messageChunk");
    };
  }, [currentResponse]);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !connected) return;

    // Add user message to chat
    const userMessage = {
      content: inputMessage,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setCurrentResponse("");

    // Send message to server
    socket.emit("sendMessage", {
      message: inputMessage,
      conversationHistory: messages,
    });

    setInputMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
      <header className="flex justify-between items-center py-4 mb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">
          Azure OpenAI Chatbot
        </h1>
        <div
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            connected
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </div>
      </header>

      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="text-center mt-16 text-gray-500">
              <h2 className="text-xl font-semibold mb-4">
                Welcome to the Azure OpenAI Chatbot
              </h2>
              <p>Send a message to start chatting with the AI!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col mb-6 ${
                  msg.isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-4/5 p-4 rounded-2xl break-words ${
                    msg.isUser
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : msg.error
                      ? "bg-red-100 text-red-800 rounded-bl-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  <div className="leading-relaxed">{msg.content}</div>
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {msg.isUser ? "You" : "AI"}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex flex-col mb-6 items-start">
              <div className="max-w-4/5 p-4 rounded-2xl rounded-bl-sm bg-gray-100 text-gray-800 break-words">
                <div className="min-h-6">
                  {currentResponse || (
                    <span className="inline-block relative after:content-['...'] after:animate-pulse"></span>
                  )}
                </div>
              </div>
              <div className="text-xs mt-1 text-gray-500">AI</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex p-4 border-t border-gray-200"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={!connected || isTyping}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-base focus:outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!connected || isTyping || !inputMessage.trim()}
            className="ml-2 px-6 py-3 bg-blue-500 text-white border-none rounded-full text-base cursor-pointer transition-colors hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
