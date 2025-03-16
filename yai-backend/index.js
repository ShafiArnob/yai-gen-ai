import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { AzureOpenAI } from "openai";

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// Configure CORS to allow your frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize Azure OpenAI client
// const openaiClient = new OpenAIClient(
//   process.env.AZURE_OPENAI_ENDPOINT,
//   new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY)
// );

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const apiKey = process.env["AZURE_OPENAI_API_KEY"];
const apiVersion = "2024-05-01-preview";
const deployment = "gpt-4o-mini"; // This must match your deployment name

const openaiClient = new AzureOpenAI({
  endpoint,
  apiKey,
  apiVersion,
  deployment,
});

const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

// Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle chat messages
  socket.on("sendMessage", async (messageData) => {
    try {
      const { message, conversationHistory } = messageData;

      console.log(`Received message from ${socket.id}:`, message);

      // Format conversation history for Azure OpenAI
      const formattedHistory = conversationHistory.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      }));

      // Add the current message
      formattedHistory.push({
        role: "user",
        content: message,
      });

      // Stream the Azure OpenAI response
      // const response = await openaiClient.getChatCompletions(
      //   deploymentName,
      //   formattedHistory,
      //   { stream: true }
      // );

      const response = await openaiClient.chat.completions.create({
        messages: formattedHistory,
        max_tokens: 800,
        temperature: 0.7,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      });

      let fullResponse = "";

      // Process each chunk as it arrives
      for await (const chunk of response) {
        if (chunk.choices && chunk.choices[0]?.delta?.content) {
          const content = chunk.choices[0].delta.content;
          fullResponse += content;

          // Emit each chunk to the client
          socket.emit("messageChunk", {
            chunk: content,
            isComplete: false,
          });
        }
      }

      // Signal completion
      socket.emit("messageChunk", {
        chunk: "",
        isComplete: true,
        fullResponse,
      });

      console.log("Response complete:", fullResponse);
    } catch (error) {
      console.error("Error processing message:", error);
      socket.emit("error", { message: "Error processing your request" });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
