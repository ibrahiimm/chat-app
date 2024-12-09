import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";

export interface Chat {
  id: string;
  name: string;
  messages: { sender: "user" | "ai"; text: string }[];
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    const fetchChats = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:3003/api/chats", {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in headers
          },
        });
        const data = await response.json();
        setChats(data.message || []); // Adjust as per the backend response structure
      } catch {
        setError("Failed to load chats.");
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate]);

  const handleMessageSubmit = async (message: string) => {
    if (!message.trim()) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    if (!activeChatId) {
      const chatName = message.slice(0, 5) || "New Chat";
      try {
        const response = await fetch("http://localhost:3003/api/send_prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token here
          },
          body: JSON.stringify({ query: message, newChat: 1, newChatName: chatName }),
        });
        const { message: aiResponse, chatId } = await response.json();
        const newChat: Chat = {
          id: chatId,
          name: chatName,
          messages: [
            { sender: "user", text: message },
            { sender: "ai", text: aiResponse },
          ],
        };
        setChats((prevChats) => [newChat, ...prevChats]);
        setActiveChatId(chatId);
      } catch {
        setError("Failed to create new chat.");
      }
    } else {
      try {
        const response = await fetch("http://localhost:3003/api/send_prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Include the token here
          },
          body: JSON.stringify({ query: message, chatID: activeChatId }),
        });
        const { message: aiResponse } = await response.json();
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { sender: "user", text: message },
                    { sender: "ai", text: aiResponse },
                  ],
                }
              : chat
          )
        );
      } catch {
        setError("Failed to send message.");
      }
    }
  };

  const handleRenameChat = (id: string, newName: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, name: newName } : chat
      )
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const onLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        chats={chats}
        onNewChat={() => setActiveChatId(null)}
        onSelectChat={(id) => setActiveChatId(id)}
        onRenameChat={handleRenameChat}
        onDeleteChat={handleDeleteChat}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        activeChatId={activeChatId}
      />
      <ChatArea
        activeChatId={activeChatId}
        chats={chats}
        onSendMessage={handleMessageSubmit}
        loading={loading}
        error={error}
        onLogout={onLogout}
      />
    </div>
  );
};

export default ChatPage;
