import React, { useState } from "react";
import { Button, ListGroup, Collapse, Form } from "react-bootstrap";
import {
  AiOutlinePlus,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";

interface SidebarProps {
  chats: { id: string; name: string; messages: { sender: "user" | "ai"; text: string }[] }[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newName: string) => void;
  onDeleteChat: (id: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  activeChatId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  isCollapsed,
  toggleCollapse,
  activeChatId,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>("");

  const handleRenameSubmit = (id: string) => {
    if (newName.trim()) {
      onRenameChat(id, newName);
      setEditingChatId(null);
      setNewName("");
    }
  };

  return (
    <div
      style={{
        width: isCollapsed ? "60px" : "300px",
        backgroundColor: "#1f1f2e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        transition: "width 0.3s",
        boxShadow: "4px 0 12px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <span style={{ display: isCollapsed ? "none" : "block", fontWeight: "bold", fontSize: "1.2rem" }}>Chats</span>
        <Button
          variant="link"
          onClick={toggleCollapse}
          style={{ color: "white", padding: 0 }}
        >
          {isCollapsed ? <AiOutlineMenuUnfold size={24} /> : <AiOutlineMenuFold size={24} />}
        </Button>
      </div>

      <Collapse in={!isCollapsed} dimension="height">
        <ListGroup
          variant="flush"
          className="flex-grow-1 overflow-auto"
          style={{
            padding: "10px 0",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
          }}
        >
          {chats.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              active={chat.id === activeChatId}
              className="d-flex justify-content-between align-items-center"
              style={{
                cursor: "pointer",
                borderRadius: "20px",
                margin: "5px 15px",
                backgroundColor:
                  chat.id === activeChatId ? "rgba(108, 117, 125, 0.3)" : "rgba(255, 255, 255, 0.05)",
                boxShadow:
                  chat.id === activeChatId ? "0 4px 10px rgba(108, 117, 125, 0.4)" : "none",
                transition: "background-color 0.3s, box-shadow 0.3s",
                border: "none",
              }}
            >
              {editingChatId === chat.id ? (
                <Form.Control
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setEditingChatId(null)}
                  onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit(chat.id)}
                  autoFocus
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: "8px",
                    backdropFilter: "blur(5px)",
                    padding: "5px 10px",
                    outline: "none",
                  }}
                />
              ) : (
                <span
                  style={{
                    padding: "8px 15px",
                    backgroundColor:
                      chat.id === activeChatId ? "#6c757d" : "rgba(255, 255, 255, 0.1)",
                    borderRadius: "20px",
                    fontWeight: chat.id === activeChatId ? "bold" : "normal",
                  }}
                >
                  {chat.name}
                </span>
              )}
              <div className="d-flex align-items-center">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setEditingChatId(chat.id)}
                  style={{ color: "#adb5bd" }}
                >
                  <AiOutlineEdit />
                </Button>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onDeleteChat(chat.id)}
                  style={{ color: "#adb5bd" }}
                >
                  <AiOutlineDelete />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Collapse>

      <div className="p-3 mt-auto">
        <Button
          variant="primary"
          onClick={onNewChat}
          className="w-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#007bff",
            border: "none",
            padding: "0.75rem 1.25rem",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 123, 255, 0.3)",
            fontSize: "1rem",
          }}
        >
          <AiOutlinePlus />
          {!isCollapsed && <span className="ms-2">New Chat</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;