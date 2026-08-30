import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Award, Heart, Sparkles, Star, Users, ShieldCheck, CheckCircle } from 'lucide-react';
import { RetainedEmployee } from '../types';
import { soundFx } from '../utils/soundEffects';

interface RetainedEmployeesWallProps {
  employees: RetainedEmployee[];
  departmentTitle: string;
}

export const RetainedEmployeesWall: React.FC<RetainedEmployeesWallProps> = ({
  employees,
  departmentTitle,
}) => {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleLike = (id: string) => {
    setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    soundFx.playClick();
  };

  const triggerGroupCheers = () => {
    soundFx.playFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#10b981', '#0284c7', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  const filtered = employees.filter((emp) => {
    if (activeFilter === 'veteran') return emp.yearsOfService >= 4;
    if (activeFilter === 'core') return emp.yearsOfService < 4;
    return true;
  });

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/90 to-[#050A18] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-1">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Loyalty & Dedication Awards
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {departmentTitle} — Retained Employees Wall
          </h3>
          <p className="text-xs text-slate-400">
            Honoring our steadfast pillars who built and sustained Winbridge Tech through every milestone.
          </p>
        </div>

        {/* Group Cheer Button & Filter */}
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              All ({employees.length})
            </button>
            <button
              onClick={() => setActiveFilter('veteran')}
              className={`px-3 py-1 rounded-lg transition-colors ${activeFilter === 'veteran' ? 'bg-blue-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Veterans (4+ Yrs)
            </button>
          </div>

          <button
            onClick={triggerGroupCheers}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Cheer All Pillars!
          </button>
        </div>
      </div>

      {/* ALL EMPLOYEES SHOWN TOGETHER IN A GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((emp, idx) => (
          <motion.div
            key={emp.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] transition-all flex flex-col items-center text-center relative group"
          >
            {/* Service Badge */}
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-300">
              {emp.yearsOfService} yrs
            </div>

            {/* Avatar / Picture */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-blue-900 to-indigo-800 border-2 border-blue-400/40 flex items-center justify-center text-white font-black text-lg mb-2.5 shadow-md group-hover:scale-105 transition-transform overflow-hidden relative">
              {emp.avatarUrl ? (
                <img src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
              ) : (
                <span>{emp.name.split(' ').map((n) => n[0]).join('')}</span>
              )}
            </div>

            <h5 className="font-bold text-slate-100 text-xs sm:text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
              {emp.name}
            </h5>
            <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{emp.role}</p>

            {/* Loyalty Ribbon */}
            <div className="w-full pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-amber-400 font-medium flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-amber-400" />
                {emp.badge || 'Retained Pillar'}
              </span>

              <button
                onClick={() => handleLike(emp.id)}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Send heart reaction"
              >
                <Heart className="w-3 h-3 fill-rose-500/50" />
                <span>{likes[emp.id] || 0}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
