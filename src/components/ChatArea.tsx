import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup, Dropdown } from "react-bootstrap";
import { BsFillSendFill, BsPersonCircle } from "react-icons/bs";

interface ChatAreaProps {
  activeChatId: string | null;
  chats: { id: string; name: string; messages: { sender: "user" | "ai"; text: string }[] }[];
  onSendMessage: (message: string) => void;
  loading: boolean;
  error: string | null;
  onLogout: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  activeChatId,
  chats,
  onSendMessage,
  loading,
  error,
  onLogout,
}) => {
  const [input, setInput] = useState<string>("");
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChat?.messages]);

  return (
    <div
      className="d-flex flex-column"
      style={{
        flex: 1, // Ensures this component takes up all available vertical space in its parent.
        minWidth: "0", // Prevents horizontal overflow.
        overflow: "hidden", // Keeps the layout clean by hiding any overflow.
      }}
    >
      {/* Chat header */}
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          height: "60px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "16px" }}>Chat</div>
        <div style={{ fontSize: "14px", color: "#6c757d" }}>
          {activeChat ? activeChat.name : "Select a chat"}
        </div>
        <Dropdown>
          <Dropdown.Toggle variant="link" style={{ background: "transparent", border: "none" }}>
            <BsPersonCircle size={30} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={onLogout}>Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Chat messages */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{
          padding: "20px", // Padding to prevent message bubbles from touching the edges.
          backgroundColor: "#f8f9fa",
          maxHeight: "calc(100vh - 120px)", // Limits the height to the viewport minus header/footer.
        }}
      >
        {loading ? (
          <div>Loading chats...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : activeChat ? (
          activeChat.messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px", // Spacing between messages.
              }}
            >
              <div
                style={{
                  backgroundColor: message.sender === "user" ? "#d1e7dd" : "#e2e3e5",
                  color: message.sender === "user" ? "#0f5132" : "#495057",
                  padding: "10px 15px", // Padding inside each message bubble.
                  borderRadius: "15px", // Rounded corners for message bubbles.
                  maxWidth: "70%", // Prevents messages from stretching too wide.
                  fontSize: "14px", // Adjust font size for readability.
                  lineHeight: "1.5",
                  wordBreak: "break-word", // Ensures long words wrap correctly.
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Subtle shadow for better aesthetics.
                }}
              >
                {message.text}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted">Select or create a chat.</div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message input */}
      <div
        className="p-3 bg-light"
        style={{
          position: "sticky", // Keeps input fixed at the bottom.
          bottom: 0,
          borderTop: "1px solid #ddd",
        }}
      >
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              resize: "none", // Prevent resizing.
              padding: "10px", // Padding for input text.
              fontSize: "14px",
            }}
            ref={inputRef}
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            style={{
              marginLeft: "10px", // Space between input and send button.
              borderRadius: "50%",
              padding: "10px 15px", // Circular button for the send icon.
            }}
          >
            <BsFillSendFill />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default ChatArea;