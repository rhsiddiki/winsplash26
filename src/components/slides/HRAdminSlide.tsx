import React, { useState } from 'react';
import { SlideData, OutfitTheme } from '../../types';
import { SpeakerStagePod } from '../SpeakerStagePod';
import { AwardCeremonyModal } from '../AwardCeremonyModal';
import { Heart, Smile, GraduationCap, Award, Crown, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface HRAdminSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const HRAdminSlide: React.FC<HRAdminSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [isAwardOpen, setIsAwardOpen] = useState(false);

  const presenter = slide.presenters[0];
  const specialAward = slide.awards?.find((a) => a.type === 'special_appreciation');
  const candidate = specialAward?.singleCandidate;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Heart className="w-3.5 h-3.5 text-blue-400" />
          SESSION 07 • PEOPLE, CULTURE & HAPPINESS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-indigo-200">
          HR & Administration
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Presenter Stage Pod with Picture Upload & Avatar Switcher */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <SpeakerStagePod
            presenter={presenter}
            globalOutfit={globalOutfit}
            onPresenterOutfitChange={onPresenterOutfitChange}
            defaultMode="photo"
          />
        </div>

        {/* HR Metrics & Special Appreciation Award */}
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

          {/* SPECIAL APPRECIATION HONOREE CARD (SINGLE CANDIDATE) */}
          {candidate && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0a1026]/90 to-[#050A18] border-2 border-amber-400/50 shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Honoree Badge / Picture */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-2xl bg-[#050A18] flex items-center justify-center text-amber-400 font-black text-3xl">
                      {candidate.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-md">
                    <Crown className="w-4 h-4" />
                  </div>
                </div>

                {/* Honoree Info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    Special Appreciation Honoree
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {candidate.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-blue-300 mb-2">
                    {candidate.role}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    "{candidate.achievement}"
                  </p>
                </div>

                {/* Celebration Action Button */}
                <button
                  onClick={() => {
                    setIsAwardOpen(true);
                    soundFx.playClick();
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Stage Trophy Ceremony
                </button>
              </div>
            </div>
          )}

          {/* HR Highlights */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl">
            <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
              <Smile className="w-4 h-4 text-blue-400" />
              Employee Engagement & Wellness Initiatives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <h5 className="font-bold text-white mb-1">Continuous Learning & Upskilling</h5>
                <p>Over 1,280 hours of accredited technical & leadership development workshops completed.</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <h5 className="font-bold text-white mb-1">Health & Wellbeing Safeguards</h5>
                <p>Comprehensive medical coverage, mental wellness sessions, and corporate sports tournaments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {specialAward && (
        <AwardCeremonyModal
          isOpen={isAwardOpen}
          onClose={() => setIsAwardOpen(false)}
          awardTitle={specialAward.title}
          singleCandidate={specialAward.singleCandidate}
          departmentName="HR & Administration"
        />
      )}
    </div>
  );
};
