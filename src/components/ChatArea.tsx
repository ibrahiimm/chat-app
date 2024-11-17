import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { BsFillSendFill } from "react-icons/bs";

interface ChatAreaProps {
  activeChatId: string | null;
  onFirstMessage: (message: string) => void;
  onCreateChat: (message: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    activeChatId,
    onFirstMessage,
    onCreateChat,
  }) => {
    const [messages, setMessages] = useState<{ [key: string]: string[] }>({});
    const [input, setInput] = useState<string>("");
  
    useEffect(() => {
      if (!activeChatId) setInput("");
    }, [activeChatId]);
  
    const handleSendMessage = () => {
      if (input.trim() === "") return; // Don't send empty messages.
  
      if (!activeChatId) {
        // If no active chat, create a new chat with the message
        const firstWord = input.trim().split(" ")[0]; // Extract the first word
        onCreateChat(firstWord); // Create new chat with first word as the name
      } else {
        // If there's an active chat, send the message
        if (!messages[activeChatId]) {
          onFirstMessage(input.trim()); // Set first message in the active chat
        }
  
        setMessages({
          ...messages,
          [activeChatId]: [...(messages[activeChatId] || []), input.trim()],
        });
      }
      setInput(""); // Clear input field after sending message
    };
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior of the Enter key
        handleSendMessage();
      }
    };
  
    return (
      <div className="flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1 overflow-auto p-4 bg-white">
          {activeChatId && messages[activeChatId]?.length ? (
            messages[activeChatId].map((message, index) => (
              <div key={index} className="mb-3">
                <div
                  style={{
                    background: "#6a11cb",
                    color: "white",
                    padding: "10px",
                    borderRadius: "10px",
                    maxWidth: "70%",
                    minWidth: "50px",
                    wordWrap: "break-word",
                    display: "inline-block",
                    alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
                  }}
                >
                  {message}
                </div>
              </div>
            ))
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "100%",
                fontSize: "2rem",
                color: "#6a11cb",
                textAlign: "center",
                fontWeight: "bold",
                opacity: 0.7,
              }}
            >
              New chat! Let's talk...
            </div>
          )}
        </div>
  
        <div className="border-top p-3 bg-light d-flex align-items-center justify-content-center">
            <InputGroup style={{ width: "80%" }}>
                <Form.Control
                as="textarea"
                rows={1}
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                    resize: "none",
                    width: "calc(100% - 50px)", // Increase width to account for button
                    minHeight: "40px",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    paddingRight: "50px", // Ensure space for the button inside
                }}
                />
                <Button
                variant="primary"
                onClick={handleSendMessage}
                style={{
                    position: "absolute", // Position button inside input
                    right: "10px", // Align to the right
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "40px", // Increase button size
                    height: "40px", // Increase button size
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "40%", // Keep the button circular
                }}
                >
                <BsFillSendFill size={24} />
                </Button>
            </InputGroup>
            </div>
      </div>
    );
  };

export default ChatArea;