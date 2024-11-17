import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

interface Chat {
  id: string;
  name: string;
  messages: string[];
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle new chat creation (only after first message)
  const handleNewChat = () => {
    // Don't create duplicate 'New Chat' if already exists
    if (chats.some((chat) => chat.name === "New Chat")) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      name: "New Chat",  // Temporary name, will be updated after the first message
      messages: [],
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  // Select the active chat from the sidebar
  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  // Rename a chat in the sidebar
  const handleRenameChat = (id: string, newName: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, name: newName || "Untitled Chat" } : chat
      )
    );
  };

  // Delete a chat from the sidebar
  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  // Submit message for an active chat
  const handleMessageSubmit = (message: string) => {
    if (!activeChatId) return;

    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          const isFirstMessage = chat.messages.length === 0;
          if (isFirstMessage) {
            // Set chat name based on first message
            return { ...chat, name: message.slice(0, 20), messages: [message] };
          } else {
            return { ...chat, messages: [...chat.messages, message] };
          }
        }
        return chat;
      });
    });
  };

  // Handle creating a new chat with a first message
  const handleCreateChatWithMessage = (message: string) => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: message.slice(0, 20),  // Set chat name from message
      messages: [message],
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChat.id);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />
      <ChatArea
        activeChatId={activeChatId}
        onFirstMessage={handleMessageSubmit}
        onCreateChat={handleCreateChatWithMessage}
      />
    </div>
  );
};

export default ChatPage;