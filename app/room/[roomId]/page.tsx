"use client";
import { useUsername } from "@/hooks/useUsername";
import { api } from "@/lib/eden";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  Loader2,
  MessageCircle,
  MessageSquareDashed,
  Send,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

function formatRemainingTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const params = useParams();
  const roomId = params.roomId as string;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { username } = useUsername();
  const router = useRouter();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (msg: string) => {
      if (!msg.trim()) return;
      await api.message.post(
        {
          sender: username,
          msg,
        },
        { query: { roomId } },
      );
    },
  });

  const {
    data: messages,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["message", roomId],
    queryFn: async () => {
      const res = await api.message.get({ query: { roomId } });
      return res.data;
    },
  });

  const { data: ttlData } = useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await api.room.ttl.get({ query: { roomId } });
      return res.data;
    },
  });

  useEffect(() => {
    if (ttlData?.ttl !== undefined && timeRemaining === null) {
      setTimeRemaining(ttlData.ttl);
    }
  }, [ttlData, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, router]);

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await api.room.delete(null, { query: { roomId } });
      router.push("/");
    },
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch();
      }
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.message]);

  const handleCopy = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F0E6D2] flex items-center justify-center p-4 font-sans text-[#1A1A1A]">
      {/* Main Chat Container */}
      <div className="relative w-full max-w-2xl h-[90vh] bg-[#E2D4BA] border-[3px] border-black rounded-[40px] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
        {/* ROOM MANAGEMENT HEADER */}
        <div className="p-6 border-b-[3px] border-black bg-[#E2D4BA]/80 backdrop-blur-sm z-10">
          <div className="flex flex-col gap-4">
            {/* Top Row: Info */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 bg-black text-[#F0E6D2] px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                <Hash size={12} strokeWidth={3} />
                Secure Channel
              </div>
              <div className="flex items-center gap-2 text-[#FF6B6B] font-black text-xs uppercase tracking-tighter">
                <Clock size={14} strokeWidth={3} />
                Expires in:{" "}
                {timeRemaining !== null
                  ? formatRemainingTime(timeRemaining)
                  : "--:--"}
              </div>
            </div>

            {/* Middle Row: ID and Actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center justify-between bg-[#F0E6D2] border-2 border-black rounded-xl px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-black/30 leading-none mb-1">
                    Room ID
                  </span>
                  <span className="text-lg font-black tracking-tighter leading-none">
                    {roomId}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-black/5 cursor-pointer rounded-lg transition-colors relative"
                >
                  {copied ? (
                    <CheckCircle2 size={20} className="text-green-600" />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  destroyRoom();
                }}
                className="flex items-center gap-2 cursor-pointer bg-[#FF6B6B] border-2 border-black rounded-xl px-4 py-3 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all"
              >
                <Trash2 size={16} />
                Destroy
              </button>
            </div>
          </div>
        </div>

        {/* MESSAGE PREVIEW AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F0E6D2]/40 scroll-smooth custom-scrollbar">
          <div className="flex justify-center mb-4">
            <span className="bg-black/5 border-2 border-black/10 text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Transmission Started
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Decrypting frequency...
              </span>
            </div>
          ) : !messages?.message || messages.message.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60%] text-center px-8">
              <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-black/20">
                <MessageSquareDashed size={32} className="text-black/20" />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight mb-2">
                Silence on the Wire
              </h3>
              <p className="text-xs font-bold text-black/40 max-w-60 leading-relaxed">
                The frequency is clear. Be the first to broadcast a secure
                transmission in this room.
              </p>
            </div>
          ) : (
            messages.message.map((msg, index) => {
              const isOwnMessage = !!msg.token;
              const date = new Date(msg.timeStamp);
              const timeString = date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={msg.id || index}
                  className={`flex flex-col ${isOwnMessage ? "items-end ml-auto" : "items-start"} max-w-[80%] gap-2`}
                >
                  <div
                    className={`${
                      isOwnMessage
                        ? "bg-[#FFB84C] rounded-tr-none"
                        : "bg-white rounded-tl-none"
                    } border-2 border-black p-4 rounded-3xl font-bold text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] wrap-break-word w-full`}
                  >
                    {msg.msg}
                  </div>
                  <span className="text-[9px] font-black text-black/30 uppercase px-1">
                    {!isOwnMessage && `${msg.sender} • `}
                    {timeString}
                    {isOwnMessage && " • Sent"}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* MESSAGE INPUT */}
        <div className="p-6 border-t-[3px] border-black bg-[#E2D4BA]/30">
          <div className="bg-[#F0E6D2] border-[3px] border-black rounded-[28px] p-2 flex items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:translate-y-0.5 transition-all">
            <div className="flex items-center border-r-2 border-black/10 pr-1">
              <div className="p-3 hover:bg-black/5 rounded-full transition-colors">
                <MessageCircle size={20} />
              </div>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && message.trim() && !isPending) {
                  sendMessage(message);
                }
              }}
              placeholder="Enter encrypted message..."
              className="flex-1 bg-transparent px-3 font-bold text-sm outline-none placeholder:text-black/30"
            />
            <button
              className="bg-black text-[#FFB84C] px-5 py-3 cursor-pointer rounded-2xl hover:bg-black/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(60,60,60,1)]"
              disabled={!message.trim() || isPending}
              onClick={() => {
                sendMessage(message);
              }}
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Send <Send size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
