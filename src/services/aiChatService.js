import api from "./api";

const sendChatMessage = async (message, history) => {
  const response = await api.post("/ai/chat", {
    message,
    conversationHistory: history,
  });

  return response.data;
};

export default { sendChatMessage };