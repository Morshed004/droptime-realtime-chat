"use client";
import { useUsername } from "@/hooks/useUsername";
import { api } from "@/lib/eden";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, MessageCircle, User, Shield, Zap, Clock, Users, Hash, Link2, Info, Lock, Flame } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const HomePage = () => {
  const router = useRouter();
  const { username } = useUsername();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const error = searchParams.get("error");
    const destroyed =
      searchParams.get("destroy") ||
      searchParams.get("destroyed") ||
      searchParams.get("result") === "destroyed";

    if (error) {
      if (error === "room-full") {
        setErrorMsg("Transmission Denied: Room is currently at maximum capacity.");
      } else if (error === "invaild-room") {
        setErrorMsg("Signal Lost: The requested room is invalid or has expired.");
      } else {
        setErrorMsg("Error: Unable to establish a connection to the room.");
      }
    } else if (destroyed) {
      setErrorMsg("Connection Terminated: This room has been destroyed.");
    }

    if (error || destroyed) {
      const timer = setTimeout(() => {
        setErrorMsg(null);
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        url.searchParams.delete("destroy");
        url.searchParams.delete("destroyed");
        url.searchParams.delete("result");
        window.history.replaceState({}, "", url.toString());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await api.room.create.post();
      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  const handleCreateRoom = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!username.trim()) return;
  };

  return (
    <div className="min-h-screen bg-[#F0E6D2] flex flex-col items-center justify-center p-4 md:p-6 font-mono text-[#1A1A1A]">
      <div className="relative w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-[#E2D4BA] p-3 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex">
              <MessageCircle size={32} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-2">
            DropTime Chat
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-black/60">
            Ephemeral · Encrypted · Anonymous
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 bg-[#FF6B6B] border-[3px] border-black p-4 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="bg-black text-[#FF6B6B] p-2 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,107,107,0.4)] shrink-0">
              <AlertTriangle size={20} strokeWidth={3} />
            </div>
            <p className="font-black uppercase text-xs tracking-tight leading-tight flex-1">
              {errorMsg}
            </p>
            <button 
              onClick={() => setErrorMsg(null)}
              className="text-black/60 hover:text-black font-black text-xl leading-none"
            >
              ×
            </button>
          </div>
        )}

        {/* Two Column Layout for better organization */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Room Creation */}
          <div className="bg-[#E2D4BA] border-[3px] border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            {/* Window Controls */}
            <div className="flex justify-between items-center bg-black/5 px-6 pt-5 pb-3 border-b-2 border-black/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-black bg-[#FF6B6B]"></div>
                <div className="w-3 h-3 rounded-full border-2 border-black bg-[#FFD93D]"></div>
                <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6BCB77]"></div>
              </div>
              <div className="bg-black text-[#F0E6D2] px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
                <Hash size={8} /> CREATE
              </div>
            </div>

            <form onSubmit={handleCreateRoom} className="p-6">
              {/* User Info Display */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wide mb-2">
                  <User size={14} strokeWidth={2.5} />
                  Active Identity
                </label>
                <div className="bg-[#F0E6D2] border-2 border-black rounded-xl py-3 px-4 flex items-center justify-between">
                  <span className="font-bold text-sm">{username || "Guest"}</span>
                  <div className="flex items-center gap-1 text-[9px] font-black uppercase bg-black/5 px-2 py-0.5 rounded border border-black/20">
                    <Lock size={10} /> locked
                  </div>
                </div>
              </div>

              {/* Create Room Button */}
              <button
                onClick={() => createRoom()}
                disabled={isPending}
                type="submit"
                className="w-full bg-[#FFB84C] border-2 border-black rounded-xl py-3.5 px-4 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    Create New Room
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Quick Stats */}
          <div className="space-y-4">
            {/* Protocol Specs */}
            <div className="bg-white border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
                <Shield size={16} strokeWidth={2.5} /> Protocol Specs
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[#FF6B6B] font-black text-[10px] uppercase tracking-wider mb-1">
                    <Clock size={12} strokeWidth={2.5} /> Lifespan
                  </div>
                  <p className="font-bold text-xl leading-none">20 min</p>
                  <p className="text-[9px] font-bold uppercase text-black/40 mt-1">TTL</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[#6BCB77] font-black text-[10px] uppercase tracking-wider mb-1">
                    <Users size={12} strokeWidth={2.5} /> Capacity
                  </div>
                  <p className="font-bold text-xl leading-none">2 users</p>
                  <p className="text-[9px] font-bold uppercase text-black/40 mt-1">P2P</p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-[#FFD93D] border-[3px] border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-sm font-black uppercase mb-3 flex items-center gap-2">
                <Flame size={16} strokeWidth={2.5} /> Key Features
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <span>Auto-destruct after 20 minutes</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <span>End-to-end encrypted messages</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase">
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  <span>No logs or data persistence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works - Full width at bottom */}
        <div className="bg-black/5 border-[3px] border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-base font-black uppercase mb-4 flex items-center gap-2">
            <Zap size={18} strokeWidth={2.5} /> Operation Manual
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", text: "Create a room to generate a unique transmission ID" },
              { step: "02", text: "Share the URL with one other participant" },
              { step: "03", text: "Communicate in realtime until the timer expires" },
              { step: "04", text: "Room and logs are purged instantly from existence" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start group">
                <span className="bg-black text-white px-2 py-0.5 rounded text-xs font-black group-hover:scale-110 transition-transform shrink-0">
                  {item.step}
                </span>
                <span className="text-[10px] font-black uppercase leading-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[8px] font-black uppercase tracking-widest text-black/30 flex items-center justify-center gap-2">
            <Info size={10} />
            No data persistence · No tracking · Pure ephemeral communication
          </p>
        </div>
      </div>
    </div>
  );
};