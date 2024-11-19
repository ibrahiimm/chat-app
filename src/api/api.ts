export interface Chat {
    id: string;
    name: string;
    messages: { sender: 'user' | 'ai'; text: string }[];
  }  

  export const fetchChats = async (): Promise<Chat[]> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "Sample Chat",
            messages: [
              { sender: "user", text: "Hello!" },
              { sender: "ai", text: "Hi! How can I help you?" },
              { sender: "user", text: "What's the weather today?" },
            ],
          },
          {
            id: "2",
            name: "Another Chat",
            messages: [
              { sender: "ai", text: "How can I assist you today?" },
            ],
          },
        ]);
      }, 1000)
    );
  };
  
  
  export const sendMessage = async (
    chatId: string,
    message: string
  ): Promise<{ reply: string }> => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ reply: `You said: ${message}` });
      }, 500)
    );
  };

  export const renameChat = async (
    chatId: string,
    newName: string
  ): Promise<Chat> => {
    // Simulating an API call to rename the chat
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id: chatId, name: newName, messages: [] });
      }, 500)
    );
  };
  
  export const deleteChat = async (chatId: string): Promise<void> => {
    // Simulating an API call to delete the chat
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 500)
    );
  };
  
  