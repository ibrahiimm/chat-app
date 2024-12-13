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
  const [newChatName, setNewChatName] = useState<string>("");
  const [showNewChatModal, setShowNewChatModal] = useState<boolean>(false); // Control modal visibility
  const [isNewChat, setIsNewChat] = useState<boolean>(false); // Track if it's a new chat
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000";

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
        const response = await fetch(`${baseUrl}/chats`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) navigate("/login");
          throw new Error("Failed to fetch chats.");
        }

        const data = await response.json();

        setChats(
          data.message.map((chat: any) => ({
            id: chat.chat_id.toString(),
            name: chat.chat_name,
            messages: [], // Assuming no messages are preloaded
          }))
        );
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [navigate, baseUrl]);

  const handleMessageSubmit = async (message: string) => {
    if (!message.trim()) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { sender: "user", text: message.trim() },
              ],
            }
          : chat
      )
    );

    setLoading(true);
    setError(null);

    try {
      const chatName = isNewChat ? newChatName : undefined; // Use new chat name if creating a new chat
      const chatID = activeChatId ? parseInt(activeChatId) : 0;

      const payload = {
        query: message,
        chatID,
        newChat: isNewChat,
        newChatName: chatName || "",
      };

      const response = await fetch(`${baseUrl}/send_prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to send message.");

      const { message: aiResponse, chatId } = await response.json();

      if (isNewChat) {
        const newChat: Chat = {
          id: chatId.toString(),
          name: chatName || "New Chat",
          messages: [
            { sender: "user", text: message },
            { sender: "ai", text: aiResponse },
          ],
        };
        setChats((prevChats) => [newChat, ...prevChats]);
        setActiveChatId(chatId.toString());
        setIsNewChat(false); // Reset new chat state after creation
      } else {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === activeChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    { sender: "ai", text: aiResponse },
                  ],
                }
              : chat
          )
        );
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameChat = (id: string, newName: string) => {
    setChats((prevChats) =>
      prevChats.map((chat) => (chat.id === id ? { ...chat, name: newName } : chat))
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));
    if (activeChatId === id) setActiveChatId(null);
  };

  const fetchChatHistory = async (chatId: string) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/chathistory?chatID=${chatId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) navigate("/login");
        throw new Error("Failed to fetch chat history.");
      }

      const data = await response.json();
      return data.message || [];
    } catch (err) {
      setError((err as Error).message);
      return [];
    }
  };

  const handleSelectChat = async (id: string) => {
    setActiveChatId(id);
    const chatHistory = await fetchChatHistory(id);

    const formattedMessages = chatHistory
      .sort((a: any, b: any) => a.messageID - b.messageID)
      .map((msg: any) => ({
        sender: msg.A_U === "user" ? "user" : "ai",
        text: msg.content,
      }));

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id ? { ...chat, messages: formattedMessages } : chat
      )
    );
  };

  const onLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const handleNewChatClick = () => {
    setIsNewChat(true);
    setShowNewChatModal(true);
    setActiveChatId(null); // Clear active chat
  };
  

  const handleCreateNewChat = () => {
    if (newChatName.trim()) {
      const newChat: Chat = {
        id: Date.now().toString(), // Generate a unique ID
        name: newChatName.trim(),
        messages: [],
      };
  
      setChats((prevChats) => [newChat, ...prevChats]);
      setActiveChatId(newChat.id); // Set the new chat as active
      setShowNewChatModal(false);
      setNewChatName(""); // Reset chat name input
    } else {
      alert("Please enter a valid chat name.");
    }
  };
  

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <Sidebar
        chats={chats}
        onNewChat={handleNewChatClick}
        onSelectChat={handleSelectChat}
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

      {/* New Chat Modal */}
      {showNewChatModal && (
  <div className="modal show d-block" tabIndex={-1} role="dialog">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content shadow-lg rounded">
        <div className="modal-header bg-primary text-white">
          <h5 className="modal-title">Create a New Chat</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setShowNewChatModal(false)}
          ></button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            className="form-control form-control-lg"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="Enter chat name..."
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowNewChatModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCreateNewChat}
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ChatPage;
