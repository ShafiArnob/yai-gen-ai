import { useState, useRef, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

export default function Chat() {
  const [isPanelTwoOpen, setIsPanelTwoOpen] = useState(true);
  const panelTwoRef = useRef(null);

  const handleClickOutside = (event) => {
    if (panelTwoRef.current && !panelTwoRef.current.contains(event.target)) {
      setIsPanelTwoOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel className="flex flex-col">
        <div className="p-4">
          One
          <Button onClick={() => setIsPanelTwoOpen((prev) => !prev)}>
            {isPanelTwoOpen ? "Close" : "Open"}
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4" id="panel-1">
          {Array.from({ length: 24 }).map((_, index) => (
            <div
              key={index}
              className="aspect-video h-12 w-full rounded-lg bg-muted/50 mb-4"
            />
          ))}
        </div>
      </ResizablePanel>
      {isPanelTwoOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel
            ref={panelTwoRef}
            maxSize={40}
            minSize={30}
            className="flex flex-col"
          >
            <div className="p-4">
              <button onClick={() => setIsPanelTwoOpen(false)}>Close</button>
            </div>
            <div id="panel-2" className="flex-1 overflow-y-auto p-4">
              {Array.from({ length: 24 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-video h-12 w-full rounded-lg bg-muted/50 mb-4"
                />
              ))}
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
