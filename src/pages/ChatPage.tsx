import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import { fetchChats, sendMessage, renameChat, deleteChat } from "../api/api";

export interface Chat {
  id: string;
  name: string;
  messages: { sender: 'user' | 'ai'; text: string }[];
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // Add this state
  const toggleCollapse = () => setIsCollapsed(!isCollapsed); // Function to toggle collapse

  // Load initial chats
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchChats()
      .then((data) => setChats(data))
      .catch(() => setError("Failed to load chats."))
      .finally(() => setLoading(false));
  }, []);

  const handleMessageSubmit = async (message: string) => {
    if (!activeChatId) {
      // If activeChatId is null, create a new chat.
      const newChatId = `chat-${Date.now()}`;
      const chatName = message.length > 5 ? message.substring(0, 5) : message; // Use first 5 characters or the entire message
      const newChat: Chat = {
        id: newChatId,
        name: chatName || "New Chat", // Default name if empty
        messages: [{ sender: "user", text: message }],
      };
  
      setChats((prevChats) => [...prevChats, newChat]);
      setActiveChatId(newChatId); // Set the new chat as active
    } else {
      // If activeChatId is not null, update the existing chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: "user", text: message },
                ],
              }
            : chat
        )
      );
    }
  
    try {
      const response = await sendMessage(activeChatId || "", message); // Ensure activeChatId is not null
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { sender: "ai", text: response.reply },
                ],
              }
            : chat
        )
      );
    } catch (error) {
      setError("Failed to send message.");
    }
  };  

  const handleRenameChat = async (chatId: string, newName: string) => {
    try {
      const updatedChat = await renameChat(chatId, newName);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === updatedChat.id ? updatedChat : chat
        )
      );
    } catch (error) {
      setError("Failed to rename chat.");
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      await deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (activeChatId === chatId) setActiveChatId(null);
    } catch (error) {
      setError("Failed to delete chat.");
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        chats={chats}
        onNewChat={() => setActiveChatId(null)}
        onSelectChat={(id) => setActiveChatId(id)}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={isCollapsed} // Pass the missing prop
        toggleCollapse={toggleCollapse} // Pass the missing prop
      />
      <ChatArea
        activeChatId={activeChatId}
        chats={chats}
        onSendMessage={handleMessageSubmit}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default ChatPage;