import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
  Search,
  MessageSquare,
  Clock,
  User,
  ArrowLeft,
  Trash2,
} from "lucide-react";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await adminApi.get("/conversations");

        setConversations(
          Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data?.conversations)
            ? res.data.conversations
            : []
        );
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  const openConversation = async (convId) => {
    setSelectedConv(convId);
    setMessages([]);

    try {
      const res = await adminApi.get(`/messages/${convId}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleDeleteConversation = async () => {
    if (!selectedConv) return;

    const result = await Swal.fire({
      title: "Delete this chat?",
      text: "This will permanently remove the conversation and all messages.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#DC2626",
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.delete(`/conversations/${selectedConv}`);
      setConversations((prev) => prev.filter((conv) => conv._id !== selectedConv));
      setSelectedConv(null);
      setMessages([]);

      Swal.fire("Deleted", "Conversation deleted successfully.", "success");
    } catch (error) {
      console.error("Error deleting conversation:", error);
      Swal.fire(
        "Error",
        error?.response?.data?.error || "Failed to delete conversation",
        "error"
      );
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const searchLower = search.toLowerCase();
    return (
      conv.userA?.name?.toLowerCase().includes(searchLower) ||
      conv.userB?.name?.toLowerCase().includes(searchLower) ||
      conv.lastMessage?.toLowerCase().includes(searchLower)
    );
  });

  const activeConversation = conversations.find((c) => c._id === selectedConv);

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#E0F2F1] via-white to-[#E0F2F1] font-[Poppins]">
      <div className="flex w-1/3 flex-col border-r bg-white/80 shadow-xl backdrop-blur-xl">
        <div className="flex items-center border-b bg-[#E0F2F1]/60 p-4 shadow-sm">
          <Search className="mr-2 text-[#00695C]" size={18} />
          <input
            type="text"
            placeholder="Search user or message..."
            className="flex-1 bg-transparent text-gray-700 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-white to-[#E0F2F1] p-3">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <motion.div
                key={conv._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => openConversation(conv._id)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  selectedConv === conv._id
                    ? "border-[#009688]/40 bg-[#009688]/15 shadow-md"
                    : "bg-white hover:border-[#009688]/30 hover:bg-[#009688]/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#009688] to-[#004D40] font-semibold text-white shadow">
                      {conv.userA?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></span>
                  </div>

                  <div>
                    <p className="font-semibold text-[#004D40]">
                      {conv.userA?.name} ↔ {conv.userB?.name}
                    </p>
                    <p className="max-w-[150px] truncate text-sm text-gray-500">
                      {conv.lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs text-gray-500">
                  {conv.updatedAt &&
                    new Date(conv.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  <Clock className="mx-auto mt-1 text-[#00695C]" size={14} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <MessageSquare size={28} />
              <p>No conversations found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-gradient-to-b from-white to-[#E0F2F1]">
        {selectedConv ? (
          <>
            <div className="flex items-center gap-3 border-b bg-white/90 p-4 shadow backdrop-blur-md">
              <button onClick={() => setSelectedConv(null)} className="lg:hidden">
                <ArrowLeft size={20} className="text-[#00695C]" />
              </button>

              <User size={22} className="text-[#009688]" />

              <div>
                <p className="font-semibold text-[#004D40]">
                  {activeConversation?.userA?.name}
                  {" ↔ "}
                  {activeConversation?.userB?.name}
                </p>
                <p className="text-xs text-gray-500">Conversation View</p>
              </div>

              <button
                type="button"
                onClick={handleDeleteConversation}
                className="ml-auto inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Delete Chat
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isSenderA = msg.senderId === activeConversation?.userA?._id;

                  return (
                    <motion.div
                      key={msg._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isSenderA ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs rounded-2xl p-3 text-sm shadow ${
                          isSenderA
                            ? "bg-[#009688] text-white"
                            : "bg-[#E0F2F1] text-[#004D40]"
                        }`}
                      >
                        {msg.message || msg.text}
                        <p className="mt-1 text-right text-[10px] opacity-80">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  <MessageSquare size={26} />
                  <span className="ml-2">No messages yet</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-gray-400">
            <MessageSquare size={40} />
            <p>Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
