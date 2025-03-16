import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatInput({ handleSendMessage }) {
  const [inputMessage, setInputMessage] = useState("");

  return (
    <div className="border-t p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="pr-24 py-4 resize-none overflow-y-auto"
            rows={1}
            style={{ maxHeight: "9rem" }} // Max 6 lines assuming ~1.5rem per line
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                144
              )}px`; // Max 6 lines (6 * 24px)
            }}
          />
          <div className="absolute right-6 bottom-2 flex items-center">
            <Button
              onClick={() => handleSendMessage(inputMessage)}
              className="rounded-md"
            >
              Send Message
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
