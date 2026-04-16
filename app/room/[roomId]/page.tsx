"use client";
import {
  CheckCircle2,
  Clock,
  Copy,
  Hash,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";

function formatRemainingTime(seconds: number) {
  const mins = seconds / 60;
  const secs = seconds % 60;

  return `${mins} : ${secs.toString().padStart(2, "0")}`;
}

const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(120);
  const { roomId } = useParams();
  const inputRef = useRef<HTMLInputElement | null>(null);

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

              <button className="flex items-center gap-2 cursor-pointer bg-[#FF6B6B] border-2 border-black rounded-xl px-4 py-3 font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all">
                <Trash2 size={16} />
                Destroy
              </button>
            </div>
          </div>
        </div>

        {/* MESSAGE PREVIEW AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F0E6D2]/40">
          <div className="flex justify-center mb-4">
            <span className="bg-black/5 border-2 border-black/10 text-[10px] font-black uppercase px-4 py-1 rounded-full">
              Transmission Started
            </span>
          </div>

          {/* Incoming Message */}
          <div className="flex items-start gap-3">
            <div className="space-y-2 max-w-[80%]">
              <div className="bg-white border-2 border-black p-4 rounded-3xl rounded-tl-none font-bold text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                Welcome to the temporary room. All messages will be destroyed
                once the timer hits zero.
              </div>
              <span className="text-[9px] font-black text-black/30 uppercase ml-1">
                Commander Felix • 10:55 AM
              </span>
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex flex-col items-end gap-2 ml-auto max-w-[80%]">
            <div className="bg-[#FFB84C] border-2 border-black p-4 rounded-3xl rounded-tr-none font-bold text-sm shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              Understood. Protocol initialized.
            </div>
            <span className="text-[9px] font-black text-black/30 uppercase mr-1">
              Read 10:56 AM
            </span>
          </div>
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
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key ==="Enter" && message.trim()){
                    inputRef.current?.focus()
                }

              }}
              placeholder="Enter encrypted message..."
              className="flex-1 bg-transparent px-3 font-bold text-sm outline-none placeholder:text-black/30"
            />
            <button 
            className="bg-black text-[#FFB84C] px-5 py-3 cursor-pointer rounded-2xl hover:bg-black/90 active:scale-95 transition-all flex items-center gap-2 font-black uppercase text-xs tracking-widest shadow-[3px_3px_0px_0px_rgba(60,60,60,1)]"
            onClick={()=>{
                inputRef.current?.focus()
            }}
            >
              Send <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
