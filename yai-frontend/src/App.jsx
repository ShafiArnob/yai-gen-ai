// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./App.css";

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
    <div className="app-container">
      <header className="app-header">
        <h1>Azure OpenAI Chatbot</h1>
        <div
          className={`connection-status ${
            connected ? "connected" : "disconnected"
          }`}
        >
          {connected ? "Connected" : "Disconnected"}
        </div>
      </header>

      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to the Azure OpenAI Chatbot</h2>
              <p>Send a message to start chatting with the AI!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.isUser ? "user-message" : "ai-message"
                } ${msg.error ? "error-message" : ""}`}
              >
                <div className="message-bubble">
                  <div className="message-content">{msg.content}</div>
                </div>
                <div className="message-sender">
                  {msg.isUser ? "You" : "AI"}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="message ai-message">
              <div className="message-bubble">
                <div className="message-content">
                  <div className="typing-indicator">
                    {currentResponse || <span className="typing-dots"></span>}
                  </div>
                </div>
              </div>
              <div className="message-sender">AI</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={!connected || isTyping}
          />
          <button
            type="submit"
            disabled={!connected || isTyping || !inputMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
