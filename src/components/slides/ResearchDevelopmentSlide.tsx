import React, { useState } from 'react';
import { SlideData, OutfitTheme } from '../../types';
import { Avatar3D } from '../Avatar3D';
import { AwardCeremonyModal } from '../AwardCeremonyModal';
import { RetainedEmployeesWall } from '../RetainedEmployeesWall';
import { Trophy, Users, Cpu, Zap, Sparkles, CheckCircle2, ShieldCheck, FileCode } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface ResearchDevelopmentSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const ResearchDevelopmentSlide: React.FC<ResearchDevelopmentSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'retained'>('overview');
  const [isAwardOpen, setIsAwardOpen] = useState(false);

  const presenter = slide.presenters[0];
  const topPerformerAward = slide.awards?.find((a) => a.type === 'top_performer');
  const retainedAward = slide.awards?.find((a) => a.type === 'retained_employees');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          SESSION 06 • INNOVATION & DEEP TECH ENGINEERING
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
          Research & Development (R&D)
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      {/* View Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 px-3 font-mono">
            HOD: Abdur Rahman
          </span>
        </div>

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
            {activeView === 'retained' ? 'Back to R&D Tech Data' : 'R&D Retained Architects & Champions'}
          </button>

          <button
            onClick={() => {
              setIsAwardOpen(true);
              soundFx.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Trophy className="w-4 h-4" />
            R&D Innovator Award
          </button>
        </div>
      </div>

      {activeView === 'retained' && retainedAward?.retainedList ? (
        <RetainedEmployeesWall
          employees={retainedAward.retainedList}
          departmentTitle="Research & Development"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Presenter Stage Pod */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/20 via-[#0a1026]/90 to-[#050A18] border border-white/10 backdrop-blur-xl shadow-2xl w-full flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <Avatar3D
                presenter={presenter}
                outfitTheme={globalOutfit}
                action="speaking"
                size="lg"
                showSpeechBubble={true}
                onOutfitChange={(theme) => onPresenterOutfitChange?.(presenter.id, theme)}
              />
            </div>
          </div>

          {/* Tech Stats & Roadmap */}
          <div className="lg:col-span-8 space-y-6">
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

            {/* R&D Architecture Cards */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                Cutting-Edge Engineering Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="font-bold text-white text-sm mb-1">Low-Latency ML Pipeline</h5>
                  <p>Reduced average data classification latency from 450ms down to 180ms with 60% savings.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="font-bold text-white text-sm mb-1">Proprietary IP & Algorithms</h5>
                  <p>Authored 3 state-of-the-art algorithms for automated validation and asynchronous queues.</p>
                </div>
              </div>
            </div>

            {/* Award Ceremony Teaser */}
            {topPerformerAward && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0a1026]/80 to-[#050A18] border border-amber-500/30 backdrop-blur-md shadow-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    {topPerformerAward.title}
                  </h4>
                  <p className="text-xs text-slate-400">Nominee recognition and winner reveal ceremony.</p>
                </div>
                <button
                  onClick={() => setIsAwardOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  View & Reveal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {topPerformerAward && (
        <AwardCeremonyModal
          isOpen={isAwardOpen}
          onClose={() => setIsAwardOpen(false)}
          awardTitle={topPerformerAward.title}
          nominees={topPerformerAward.nominees}
          departmentName="Research & Development"
        />
      )}
    </div>
  );
};
