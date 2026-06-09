import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";



export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ALL CHAT MESSAGES
  const [messages, setMessages] = useState([]);

  // CHAT HISTORY TITLES
  const [chatHistory, setChatHistory] = useState([]);

  const [currentChatTitle, setCurrentChatTitle] = useState("");

  const latestMessageRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploadedDocument, setUploadedDocument] = useState(null);

  const [showFileName, setShowFileName] = useState(false);

 useEffect(() => {
  latestMessageRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}, [messages]);


  // SEND MESSAGE
  const sendMessage = async () => {
  if (!message.trim()) return;

  const currentMessage = message;

  const userMessage = {
    type: "user",
    text: currentMessage,
  };

  if (!currentChatTitle) {
    setCurrentChatTitle(currentMessage);
    setChatHistory((prev) => [currentMessage, ...prev]);
  }

  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);

  try {
    const history = messages.map((msg) => ({
      role: msg.type === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const formData = new FormData();

    formData.append("message", currentMessage);
    formData.append("history", JSON.stringify(history));

    if (uploadedDocument) {
  formData.append("file", uploadedDocument);
}

    setMessage("");
    setSelectedFile(null);

    const res = await axios.post(
      "http://127.0.0.1:8000/chat",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const aiMessage = {
      type: "ai",
      text: res.data.response,
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    console.log(error);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: "Error connecting to backend.",
      },
    ]);
  }

  setLoading(false);
  setShowFileName(false);
  setSelectedFile(null);
};

  // NEW CHAT
const newChat = () => {
  setMessages([]);
  setMessage("");
  setCurrentChatTitle("");

  setSelectedFile(null);
  setUploadedDocument(null);
};

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#1A102B] via-[#24143A] to-[#2D1B47] text-white overflow-hidden">

      {/* SIDEBAR */}
      <div className="hidden md:flex md:w-[270px] bg-gradient-to-b from-[#24143A] to-[#2D1B47] border-r border-[#7B61FF]/20 flex-col">
        {/* TOP */}
        <div className="p-5 border-b border-[#7B337E]/20">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-5">

           

           
          </div>

          <div className="px-5 py-4 border-b border-white/10">

  <h2 className="font-bold text-xl">

    <span className="text-white">
      Analy
    </span>
&nbsp;
    <span className="bg-gradient-to-r from-[#7B61FF] to-[#C084FC] bg-clip-text text-transparent">
      AI
    </span>

  </h2>

</div>
<br/>

          {/* NEW CHAT */}
          <button
            onClick={newChat}
            className="w-full bg-gradient-to-r from-[#6667AB] to-[#7B337E] hover:opacity-90 rounded-xl py-3 text-sm font-medium text-white shadow-lg">
            + New Chat
          </button>
        </div>

        {/* CHAT HISTORY */}
        <div className="flex-1 overflow-y-auto p-4">

          <p className="text-xs uppercase tracking-wider text-[#C9B4D4] mb-4">
            Recent Chats
          </p>

          <div className="space-y-2">

            {chatHistory.map((chat, index) => (

              <button
                key={index}
                className="w-full text-left px-4 py-3 rounded-xl transition text-sm truncate bg-white/5 hover:bg-white/10 text-[#F5D5E0]">
               
              
                {chat}
              </button>

            ))}

          </div>
        </div>

        {/* BOTTOM */}
        <div className="p-4 border-t border-[#7B337E]/20">

          <div className="bg-[#3B1657] rounded-xl p-4">

            <p className="text-sm text-[#F5D5E0] leading-6">
              Find scholarships, universities, and career paths using AI.
            </p>

          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
<div className="flex-1 flex flex-col bg-[#210635]">
  <div className="md:hidden flex items-center justify-center py-4 border-b border-[#7B61FF]/20">
  <h2 className="font-bold text-xl">
    <span className="text-white">Analy</span>
    <span className="ml-1 bg-gradient-to-r from-[#7B61FF] to-[#C084FC] bg-clip-text text-transparent">
      AI
    </span>
  </h2>
</div>
  {/* CHAT AREA */}
{/* CHAT AREA */}
<div className="flex-1 overflow-y-auto px-4 md:px-10 py-4">

  {/* EMPTY STATE */}
  {messages.length === 0 && !loading && (
    <div className="h-full flex flex-col items-center justify-center text-center">

     <img
  src={`${import.meta.env.BASE_URL}logo.png`}
  alt="Analy AI"
  className="w-[220px] md:w-[320px] max-w-full object-contain mb-[-10px]"
/>

     <h1 className="text-2xl md:text-4xl font-bold mt-0 text-center">

  <span className="text-white">
    Welcome to
  </span>

  <span className="ml-3 bg-gradient-to-r from-[#7B61FF] via-[#C084FC] to-[#F5D5E0] bg-clip-text text-transparent">
    Analy AI
  </span>

</h1>

      <p className="text-[#C9B4D4] mt-4 max-w-2xl text-sm md:text-base px-4">
        Ask about universities, scholarships, visa guidance,
        careers and study opportunities worldwide.
      </p>

      <div className="flex gap-3 mt-6 flex-wrap justify-center">
        <div className="bg-white/5 px-4 py-3 rounded-xl">
          🎓 Scholarships
        </div>

        <div className="bg-white/5 px-4 py-3 rounded-xl">
          🏫 Universities
        </div>

        <div className="bg-white/5 px-4 py-3 rounded-xl">
          🌍 Study Abroad
        </div>
      </div>

    </div>
  )}


  
    {/* MESSAGE RENDERING */}
    <div className="space-y-6">
    {messages.map((msg, index) => (
      <motion.div
        key={index}
         ref={
      index === messages.length - 1
        ? latestMessageRef
        : null
    }
    
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
      >
    
        <div className={`max-w-[95%] md:max-w-[85%] prose prose-invert px-5 py-4 rounded-2xl text-sm leading-7 shadow-lg 
          ${msg.type === "user" 
            ? "bg-gradient-to-r from-[#6667AB] to-[#7B337E] rounded-br-md" 
            : "bg-white/5 backdrop-blur-xl border border-[#7B61FF]/20 rounded-bl-md"
          }`}
        >
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
      </motion.div>
    ))}
</div>
    {loading && (
      <div className="flex justify-start">
        <div className="bg-white/5 backdrop-blur-xl border border-[#7B61FF]/20 px-5 py-4 rounded-2xl rounded-bl-md">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#C9B4D4] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#C9B4D4] rounded-full animate-bounce [animation-delay:0.15s]"></div>
            <div className="w-2 h-2 bg-[#C9B4D4] rounded-full animate-bounce [animation-delay:0.3s]"></div>
          </div>
        </div>
      </div>
    )}
    
  </div>

 
        {/* INPUT AREA */}
        <div className="p-3 md:p-6 border-t border-[#7B337E]/20 bg-[#24143A]/60">

          <div className="max-w-4xl mx-auto bg-[#2D1B47]/20 border border-[#7B61FF]/20 rounded-3xl backdrop-blur-xl p-4 shadow-2xl">

            {/* TEXTAREA */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell Analy AI about your study goals..."
              className="w-full h-18 md:h-18 bg-transparent resize-none outline-none text-[#F5D5E0] placeholder:text-[#C9B4D4] text-[14px] md:text-[15px]"
            />


{showFileName && uploadedDocument && (
  <p className="text-xs text-[#C9B4D4] mt-2">
    📄 {uploadedDocument.name}
  </p>
)}


            {/* BOTTOM BAR */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-0 items-stretch md:items-center justify-between mt-4">

              {/* PDF BUTTON */}
              <label className="w-full md:w-auto bg-gradient-to-r from-[#6667AB] to-[#7B337E] hover:scale-105 hover:opacity-90 active:scale-95 transition px-6 py-2 rounded-xl text-sm font-medium">
                📎 Upload PDF
               <input
  type="file"
  className="hidden"
  onChange={(e) => {
  const file = e.target.files[0];

  setSelectedFile(file);
  setUploadedDocument(file);
  setShowFileName(true);
  
}}
/>
              </label>

              {/* SEND BUTTON */}
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-[#6667AB] to-[#7B337E] hover:scale-105 hover:opacity-90 active:scale-95 transition px-6 py-2 rounded-xl text-sm font-medium"
              >
                {loading ? "Thinking..." : "Send"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}