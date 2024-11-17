import React, { useState } from "react";
import { Button, ListGroup, Form } from "react-bootstrap";
import { BsList, BsPlus, BsTrash } from "react-icons/bs";

interface SidebarProps {
  chats: { id: string; name: string }[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onRenameChat: (id: string, newName: string) => void;
  onDeleteChat: (id: string) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
  isCollapsed,
  toggleCollapse,
}) => {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleRename = (chatId: string) => {
    if (editName.trim()) {
      onRenameChat(chatId, editName.trim());
    }
    setEditingChatId(null);
    setEditName("");
  };

  return (
    <div
      className={`d-flex flex-column bg-light border-end ${
        isCollapsed ? "collapsed" : ""
      }`}
      style={{
        width: isCollapsed ? "70px" : "300px",
        overflowY: "auto",
        height: "100%",
        transition: "width 0.3s ease",
        background: "linear-gradient(to bottom, #6a11cb, #2575fc)",
        color: "white",
        padding: isCollapsed ? "2px" : "2px",
      }}
    >
      {/* Collapse Button */}
      <div
        className="p-3 border-bottom d-flex align-items-center justify-content-start"
        style={{
          padding: "10px",
        }}
      >
        <Button
          variant="light"
          onClick={toggleCollapse}
          style={{
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#2575fc",
            fontWeight: "bold",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        >
          <BsList size={20} />
        </Button>
      </div>

      {/* New Chat Button */}
      {!isCollapsed && (
        <Button
          variant="light"
          onClick={onNewChat}
          style={{
            margin: "10px",
            height: "40px",
            color: "#2575fc",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "8px",
          }}
        >
          <BsPlus size={20} />
          <span className="ms-2">New Chat</span>
        </Button>
      )}

      {/* Chat List */}
      {!isCollapsed && (
        <ListGroup variant="flush" className="mt-3">
          {chats.map((chat) => (
            <ListGroup.Item
              key={chat.id}
              className="d-flex justify-content-between align-items-center"
              style={{
                backgroundColor: "transparent",
                color: "white",
                cursor: "pointer",
                border: "none",
                padding: "10px 15px",
                marginBottom: "5px",
                borderRadius: "8px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(255, 255, 255, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {editingChatId === chat.id ? (
                <Form.Control
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleRename(chat.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(chat.id);
                    if (e.key === "Escape") setEditingChatId(null);
                  }}
                  autoFocus
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)", // transparent background with opacity
                    color: "#2575fc",
                    borderRadius: "4px",
                    padding: "5px",
                    fontSize: "14px",
                    borderColor: "#2575fc", // adding border color for visibility
                  }}
                />
              ) : (
                <div
                  onDoubleClick={() => {
                    setEditingChatId(chat.id);
                    setEditName(chat.name);
                  }}
                  onClick={() => onSelectChat(chat.id)}
                  style={{
                    flex: 1,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chat.name}
                </div>
              )}
              <div>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => onDeleteChat(chat.id)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                    borderRadius: "8px",
                  }}
                >
                  <BsTrash />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Sidebar;
