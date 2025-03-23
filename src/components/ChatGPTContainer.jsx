import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatGPTHeader from "./ChatGPTHeader";
import ChatGPTInput from "./ChatGPTInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import toast from "react-hot-toast";

const ChatGPTContainer = () => {
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const messageEndRef = useRef(null);

  // ✅ استرجاع المحادثة من LocalStorage عند فتح الصفحة
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // ✅ حفظ المحادثة تلقائيًا عند تحديث الرسائل
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessage = { role: "user", text, createdAt: new Date() };
    setMessages((prev) => [...prev, newMessage]);
    setIsMessagesLoading(true);

    try {
      const { data } = await axios.post("/api/chatai/chat", { message: text });

      const botMessage = {
        role: "bot",
        text: data.reply,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error(error.response?.data?.error || "حدث خطأ");
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // ✅ التمرير التلقائي بعد تحديث الرسائل
  useEffect(() => {
    setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatGPTHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${message.role === "user" ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img src={message.role === "user" ? "/avatar.png" : "/chatro.png"} alt="profile pic" />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">{formatMessageTime(message.createdAt)}</time>
            </div>
            <div className="chat-bubble flex flex-col">
              <p>{message.text}</p>
            </div>
          </div>
        ))}

        {isMessagesLoading && <MessageSkeleton />}
      </div>

      <ChatGPTInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatGPTContainer;
