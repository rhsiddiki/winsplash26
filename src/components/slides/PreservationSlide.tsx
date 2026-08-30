import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SlideData, OutfitTheme } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { AwardCeremonyModal } from '../AwardCeremonyModal';
import { RetainedEmployeesWall } from '../RetainedEmployeesWall';
import { Trophy, Users, Award, Sparkles, Database, FileSpreadsheet, CheckCircle2, Megaphone } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface PreservationSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const PreservationSlide: React.FC<PreservationSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activePresenterTab, setActivePresenterTab] = useState<'foysal' | 'nafis'>('foysal');
  const [activeAwardModal, setActiveAwardModal] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'overview' | 'retained'>('overview');

  const foysal = slide.presenters.find((p) => p.id === 'foysal') || slide.presenters[0];
  const nafis = slide.presenters.find((p) => p.id === 'nafis') || slide.presenters[1];

  const topPerformerAward = slide.awards?.find((a) => a.type === 'top_performer');
  const retainedEmployeesAward = slide.awards?.find((a) => a.type === 'retained_employees');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          SESSION 04 • PRESERVATION & BDO EXCELLENCE
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
          Preservation & BDO Department
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      {/* Main View Switcher Bar (Overview / Retained Employees Wall / Award Ceremony) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        {/* Presenter Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActivePresenterTab('foysal');
              soundFx.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePresenterTab === 'foysal'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'text-slate-400 hover:text-slate-200 bg-white/5'
            }`}
          >
            HOD Foysal Ahmed Shojib
          </button>
          <button
            onClick={() => {
              setActivePresenterTab('nafis');
              soundFx.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activePresenterTab === 'nafis'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'text-slate-400 hover:text-slate-200 bg-white/5'
            }`}
          >
            Asst. Manager Nafis-Uz-Zaman (BDO)
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveView(activeView === 'overview' ? 'retained' : 'overview');
              soundFx.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'retained'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            {activeView === 'retained' ? 'Back to Overview' : 'View Retained Employees (8)'}
          </button>

          <button
            onClick={() => {
              setActiveAwardModal(true);
              soundFx.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
            Top Performer Award Reveal!
          </button>
        </div>
      </div>

      {activeView === 'retained' && retainedEmployeesAward?.retainedList ? (
        /* Retained Employees Wall */
        <RetainedEmployeesWall
          employees={retainedEmployeesAward.retainedList}
          departmentTitle="Preservation & BDO"
        />
      ) : (
        /* Department Overview Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Presenter Pod */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/90 to-[#050A18] border border-white/10 backdrop-blur-xl shadow-2xl w-full flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <Avatar3D
                presenter={activePresenterTab === 'foysal' ? foysal : nafis}
                outfitTheme={globalOutfit}
                action="speaking"
                size="lg"
                showSpeechBubble={true}
                onOutfitChange={(theme) =>
                  onPresenterOutfitChange?.(activePresenterTab === 'foysal' ? foysal.id : nafis.id, theme)
                }
              />
            </div>
          </div>

          {/* Department Data & BDO Shoutout */}
          <div className="lg:col-span-8 space-y-6">
            {/* SHOUTOUT TO TEAM BDO BANNER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 shadow-xl flex items-center gap-4 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-black shadow-lg">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Special Department Shoutout
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  Huge Shoutout to Team BDO (Business Data Operations)!
                </h4>
                <p className="text-xs text-blue-200/80">
                  Record processing volumes, relentless accuracy, and exceptional teamwork under high-throughput client demands.
                </p>
              </div>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {slide.metrics?.map((metric, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors shadow-lg flex flex-col justify-between"
                >
                  <span className="text-xs font-medium text-slate-400 line-clamp-1">{metric.label}</span>
                  <div className="text-2xl font-black text-white my-1">{metric.value}</div>
                  <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {metric.change}
                  </span>
                </div>
              ))}
            </div>

            {/* Top Performer Card Teaser */}
            {topPerformerAward && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-amber-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" />
                    Award Category
                  </span>
                  <h4 className="text-lg font-bold text-white mt-1">
                    {topPerformerAward.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    3 Nominees shortlisted by HOD Foysal Ahmed Shojib & Management.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveAwardModal(true);
                    soundFx.playClick();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Launch Nominees & Reveal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AWARD CEREMONY MODAL */}
      {topPerformerAward && (
        <AwardCeremonyModal
          isOpen={activeAwardModal}
          onClose={() => setActiveAwardModal(false)}
          awardTitle={topPerformerAward.title}
          nominees={topPerformerAward.nominees}
          departmentName="Preservation & BDO"
        />
      )}
    </div>
  );
};
