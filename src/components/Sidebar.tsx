import React, { useState, useEffect, useRef } from "react";
import { Button, ListGroup, Form, Dropdown } from "react-bootstrap";
import { BsList, BsPlus, BsCheck, BsPencil, BsThreeDots } from "react-icons/bs";

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
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Ref for the input field to detect outside clicks
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRename = (chatId: string) => {
    if (editName.trim()) {
      onRenameChat(chatId, editName.trim());
    }
    setEditingChatId(null);
    setEditName("");
  };

  const handleNewChat = () => {
    setSelectedChatId(null); // Deselect the current chat
    onNewChat();
  };

  // Close the renaming input if user clicks outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setEditingChatId(null); // Close the rename input
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  // Modified handler to select a new chat after deletion
  const handleDeleteChat = (chatId: string) => {
    onDeleteChat(chatId);

    // After deletion, select a new chat if available, otherwise create a new one
    if (chats.length > 1) {
      const nextChat = chats[0].id !== chatId ? chats[0] : chats[1];
      setSelectedChatId(nextChat.id);
      onSelectChat(nextChat.id);
    } else {
      handleNewChat(); // Create a new chat if no chats remain
    }
  };

  return (
    <div
      className={`d-flex flex-column bg-light border-end ${isCollapsed ? "collapsed" : ""}`}
      style={{
        width: isCollapsed ? "70px" : "300px",
        overflowY: "auto",
        height: "100%",
        transition: "width 0.3s ease",
        background: "linear-gradient(to bottom, #6a11cb, #2575fc)", // Gradient background color
        color: "black", // All text will be black
        padding: "2px",
      }}
    >
      {/* Collapse Button */}
      <div
        className="p-3 border-bottom d-flex align-items-center justify-content-start"
        style={{
          height: "60px",
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
            color: "#2575fc", // Button color (Primary button color)
            fontWeight: "bold",
            padding: "0.5rem",
            borderRadius: "8px",
          }}
        >
          <BsList size={20} />
        </Button>
      </div>

      {/* New Chat Button */}
      <Button
        variant="light"
        onClick={handleNewChat}
        style={{
          margin: "10px",
          height: "40px",
          color: "#2575fc", // Button color (Primary button color)
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "8px",
        }}
      >
        {isCollapsed ? (
          <BsPencil size={20} />
        ) : (
          <>
            <BsPlus size={20} />
            <span className="ms-2">New Chat</span>
          </>
        )}
      </Button>

      {/* Chat List */}
      <div style={{ overflowY: "auto", flexGrow: 1 }}>
        {!isCollapsed && (
          <ListGroup variant="flush" className="mt-3">
            {chats.map((chat) => (
              <ListGroup.Item
                key={chat.id}
                className={`d-flex justify-content-between align-items-center ${
                  selectedChatId === chat.id ? "bg-primary text-white" : ""
                }`}
                style={{
                  padding: "10px 20px", // Padding for x and y axes
                  marginBottom: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  backgroundColor: selectedChatId === chat.id ? "#4e8df7" : "transparent", // Selected background color (Light blue when selected)
                  position: "relative", // To position delete button correctly
                }}
                onClick={() => {
                  setSelectedChatId(chat.id);
                  onSelectChat(chat.id);
                }}
                onDoubleClick={() => {
                  setEditingChatId(chat.id);
                  setEditName(chat.name); // Preload the name in the input field
                }}
              >
                {editingChatId === chat.id ? (
                  <>
                    <Form.Control
                      ref={inputRef} // Attach the input field ref
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      style={{
                        color: "black", // Input text color (Black)
                        backgroundColor: "transparent", // Transparent background
                        borderColor: "#2575fc", // Border color (Primary blue)
                      }}
                    />
                    <Button
                      variant="link"
                      onClick={() => handleRename(chat.id)}
                      style={{
                        color: "#2575fc", // Button color for check icon (Primary blue)
                        fontWeight: "bold",
                        paddingLeft: "10px",
                      }}
                    >
                      <BsCheck size={20} />
                    </Button>
                  </>
                ) : (
                  <>
                    {chat.name}
                    {selectedChatId === chat.id && (
                      <div
                        className="d-flex justify-content-end"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)", // Vertically center the dots with the text
                          zIndex: 999, // Ensure the three dots are on top (Top layer)
                        }}
                      >
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="link"
                            id="dropdown-basic"
                            style={{
                              color: "#555", // Dark grey color for the three dots
                              padding: "0", // No extra padding
                              fontSize: "20px", // Ensure the icon is the right size
                            }}
                          >
                            <BsThreeDots />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => setEditingChatId(chat.id)}
                              style={{ color: "black" }}
                            >
                              Rename
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleDeleteChat(chat.id)} // Use the modified delete handler
                              style={{ color: "black" }}
                            >
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    )}
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
};

export default Sidebar;