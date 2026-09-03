import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { IconButton, Paper, TextField } from "@mui/material";

import aiChatService from "../../services/aiChatService";
import "./ChatAssistant.css";

const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Ask me about your ERP data." },
  ]);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput("");
    setMessages((previous) => [...previous, { role: "user", content: question }]);
    setLoading(true);

    try {
      const result = await aiChatService.sendChatMessage(question, conversationHistory);
      setMessages((previous) => [...previous, { role: "assistant", content: result.reply }]);
      setConversationHistory(result.updatedHistory || conversationHistory);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        { role: "error", content: error.response?.data?.message || "I could not reach the assistant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <Paper className="ai-chat-panel" elevation={8}>
          <div className="ai-chat-header">
            <div className="ai-chat-title"><Bot size={19} /><strong>ERP Assistant</strong></div>
            <IconButton size="small" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></IconButton>
          </div>
          <div className="ai-chat-messages" ref={listRef}>
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`ai-chat-message ${item.role}`}>
                {item.content}
              </div>
            ))}
            {loading && <div className="ai-chat-message assistant">Checking your ERP data...</div>}
          </div>
          <form className="ai-chat-form" onSubmit={handleSubmit}>
            <TextField
              size="small"
              fullWidth
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your data"
              disabled={loading}
              inputProps={{ "aria-label": "Ask the ERP assistant" }}
            />
            <IconButton color="primary" type="submit" disabled={loading || !input.trim()} aria-label="Send message"><Send size={19} /></IconButton>
          </form>
        </Paper>
      )}
      <button className="ai-chat-fab" type="button" onClick={() => setOpen((previous) => !previous)} aria-label={open ? "Close ERP assistant" : "Open ERP assistant"}>
        {open ? <X size={23} /> : <Bot size={23} />}
      </button>
    </>
  );
};

export default ChatAssistant;