"use client";
import { useUsername } from '@/hooks/useUsername';
import { api } from '@/lib/eden';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, MessageCircle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const App: React.FC = () => {
  const router = useRouter()
  const {username} = useUsername()

  const {mutate: createRoom, isPending} = useMutation({
    mutationFn: async ()=>{
      const res = await api.room.create.post();

      if(res.status === 200){
        router.push(`/room/${res.data?.roomId}`)
      }
    }
  })

  const handleCreateRoom = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!username.trim()) return;
    console.log("Creating room for:", username);
  };
  return (
    <div className="min-h-screen bg-[#F0E6D2] flex flex-col items-center justify-center p-6 font-sans text-[#1A1A1A]">

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6 ml-1">
          <div className="bg-[#E2D4BA] p-2 border-2 border-black rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none">Nexus Chat</h1>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#E2D4BA] border-[3px] border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative">
          
          {/* Top Bar Decoration */}
          <div className="flex justify-between items-center mb-10 border-b-2 border-black/10 pb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full border-2 border-black bg-[#FF6B6B]"></div>
              <div className="w-3 h-3 rounded-full border-2 border-black bg-[#FFD93D]"></div>
              <div className="w-3 h-3 rounded-full border-2 border-black bg-[#6BCB77]"></div>
            </div>
            <div className="bg-black text-[#F0E6D2] px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Create room
            </div>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-8">
            {/* Username Input */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
                <User size={16} />
                Your Identity
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  disabled
                  placeholder="Enter alias..."
                  className="w-full bg-[#F0E6D2] border-2 cursor-not-allowed border-black rounded-xl py-4 px-5 text-lg font-bold placeholder:text-[#A89D88] outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2">
              <button
              onClick={()=>{
                createRoom()
              }}
              disabled= {isPending}
                type="submit"
                className="group relative w-full bg-[#FFB84C] border-2 border-black cursor-pointer rounded-xl py-4 px-6 font-black uppercase tracking-wider flex items-center justify-center gap-3 transition-all hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none"
              >
                Create New Room
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default App;