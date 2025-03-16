import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import React from "react";

const RenderChatBubble = ({ chatMessage }) => {
  switch (chatMessage?.message_bubble_type) {
    case "none":
      return (
        <>
          <div className="flex justify-end mb-4 gap-3">
            <div className="bg-gray-100  rounded-lg px-4 py-2 max-w-[80%]">
              <p>{chatMessage.message}</p>
            </div>
            <Avatar className="flex items-center justify-center h-8 w-8 bg-zinc-300 text-white mt-1.5">
              <User />
            </Avatar>
          </div>
        </>
      );
    case "res-message":
      return (
        <>
          <div className="flex mb-4 gap-3">
            <Avatar className="flex items-center justify-center h-8 w-8 bg-zinc-300 text-white mt-1.5">
              <Bot />
            </Avatar>
            <div className="bg-gray-50  rounded-lg px-4 py-3 max-w-[80%]">
              <p>{chatMessage.message}</p>
            </div>
          </div>
        </>
      );
    default:
      return <div>Def</div>;
  }
};

const ChatMessagesArea = ({ chatMessages }) => {
  return (
    <div className="flex-1 p-6 overflow-y-auto ">
      <div className="max-w-6xl mx-auto">
        {/* User message */}
        <div className="flex justify-end mb-4 gap-3">
          <div className="bg-gray-100  rounded-lg px-4 py-2 max-w-[80%]">
            <p>how are you?</p>
          </div>
          <Avatar className="flex items-center justify-center h-8 w-8 bg-zinc-300 text-white mt-1.5">
            <User />
          </Avatar>
        </div>

        {/* AI response */}
        <div className="flex mb-4 gap-3">
          <Avatar className="flex items-center justify-center h-8 w-8 bg-zinc-300 text-white mt-1.5">
            <Bot />
          </Avatar>
          <div className="bg-gray-50  rounded-lg px-4 py-3 max-w-[80%]">
            <p>Hello! How Can I Help You?</p>
          </div>
        </div>

        {chatMessages.map((chatMessage) => (
          <RenderChatBubble chatMessage={chatMessage} />
        ))}
      </div>
    </div>
  );
};

export default ChatMessagesArea;
