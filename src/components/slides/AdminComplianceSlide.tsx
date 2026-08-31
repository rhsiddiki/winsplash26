import React from 'react';
import { motion } from 'motion/react';
import { SlideData, OutfitTheme } from '../../types';
import { SpeakerStagePod } from '../SpeakerStagePod';
import { ShieldCheck, Building, TrendingUp, Lock, CheckCircle2, FileText, BarChart3 } from 'lucide-react';

interface AdminComplianceSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

export const AdminComplianceSlide: React.FC<AdminComplianceSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const presenter = slide.presenters[0];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          SESSION 03 • DEPARTMENTAL MILESTONE REPORT
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-emerald-200">
          Accounts & Compliance
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl mx-auto">
          {slide.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Presenter Pod with Picture Upload & Avatar Switcher */}
        <div className="lg:col-span-4 flex flex-col items-center">
          <SpeakerStagePod
            presenter={presenter}
            globalOutfit={globalOutfit}
            onPresenterOutfitChange={onPresenterOutfitChange}
            defaultMode="photo"
          />
        </div>

        {/* Right Department Data & Financial Metrics */}
        <div className="lg:col-span-8 space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {slide.metrics?.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors shadow-lg flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-blue-400 mb-2">
                  <span className="text-xs font-medium text-slate-400 line-clamp-1">{metric.label}</span>
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {metric.value}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Compliance & Accounts Overview Cards */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Governance & Operational Fortitude Highlights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Statutory & Tax Compliance
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  100% adherence to all regulatory frameworks, tax filings, and external statutory audits with flawless transparency.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <Building className="w-4 h-4 text-cyan-400" />
                  Facility & Infra Expansion
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Expanded 3 operational modern work hubs, upgraded fiber networking backbone, and enhanced employee ergonomic facilities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Automated Fiscal Reconciliation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Implemented smart digital payment vouchers, automated vendor clearing, and accelerated budget allocation workflows.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                  <Lock className="w-4 h-4 text-purple-400" />
                  Security & Welfare Protocols
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Smart access security tokens, round-the-clock facility monitoring, and comprehensive emergency preparedness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
