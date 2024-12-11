import React, { useState, useEffect, useRef } from "react";
import { Form, Button, InputGroup, Dropdown } from "react-bootstrap";
import { BsFillSendFill, BsPersonCircle } from "react-icons/bs";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

interface ChatAreaProps {
  activeChatId: string | null;
  chats: Chat[];
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
    if (activeChatId) {
      onSendMessage(input.trim());
      setInput("");
      setNewMessageReceived(true);
    }
  };  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [newMessageReceived, setNewMessageReceived] = useState(false);

  useEffect(() => {
    if (newMessageReceived && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      setNewMessageReceived(false); // Reset the state
    }
  }, [activeChat?.messages, newMessageReceived]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeChat]);

  return (
    <div className="d-flex flex-column" style={{ flex: 1, minWidth: "0", overflow: "hidden" }}>
      {/* Chat header */}
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
          height: "60px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
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

      {/* Chat content container */}
      <div
        className="flex-grow-1 overflow-auto"
        style={{
          display: "flex",
          justifyContent: "center", // Centers the message area horizontally
          backgroundColor: "transparent",
          padding: "20px 0 20px", // Adds padding above and below
        }}
      >
        <div
          style={{
            maxWidth: "60%",
            width: "100%",
            flex: "1",
          }}
        >
          {/* Chat messages */}
          <div style={{ padding: "0 20px", maxHeight: "calc(100vh - 120px)" }}>
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
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: message.sender === "user" ? "#d1e7dd" : "#e2e3e5",
                      color: message.sender === "user" ? "#0f5132" : "#495057",
                      padding: "10px 15px",
                      borderRadius: "15px",
                      maxWidth: "100%",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      wordBreak: "break-word",
                      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
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
        </div>
      </div>

      {/* Message input */}
      <div
        className="p-3 bg-light"
        style={{
          position: "sticky",
          bottom: 0,
          borderTop: "1px solid #ddd",
          display: "flex",
          justifyContent: "center", // Centers the input field
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          style={{
            maxWidth: "60%",
            width: "100%",
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
                resize: "none",
                padding: "10px",
                fontSize: "14px",
              }}
              ref={inputRef}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              style={{
                marginLeft: "10px",
                borderRadius: "50%",
                padding: "10px 15px",
              }}
            >
              <BsFillSendFill />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>

  );
};

export default ChatArea;