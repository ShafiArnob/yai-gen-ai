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
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        One
        <Button onClick={() => setIsPanelTwoOpen((prev) => !prev)}>
          {isPanelTwoOpen ? "Close" : "Open"}
        </Button>
      </ResizablePanel>
      {isPanelTwoOpen && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel ref={panelTwoRef} maxSize={40} minSize={30}>
            <button onClick={() => setIsPanelTwoOpen(false)}>Close</button>
            Two
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
}
