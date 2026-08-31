import React, { useState } from 'react';
import { SlideData, OutfitTheme, DepartmentPresenterDataset } from '../../types';
import { SpeakerStagePod } from '../SpeakerStagePod';
import { AwardCeremonyModal } from '../AwardCeremonyModal';
import {
  Heart,
  Users,
  Sparkles,
  TrendingUp,
  Award,
  Crown,
  CheckCircle2,
  Star,
  Search,
  Filter,
  BarChart3,
  Table,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Percent,
  UserCheck,
  UserPlus,
  Briefcase,
  Smile,
  GraduationCap,
  Flame,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'workforce' | 'funnel' | 'matrix' | 'culture' | 'retained'>('workforce');
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('headcount');
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [tableSearchQuery, setTableSearchQuery] = useState('');
  const [selectedFunnelStep, setSelectedFunnelStep] = useState<number | null>(null);

  const presenter = slide.presenters[0];
  const specialAward = slide.awards?.find((a) => a.type === 'special_appreciation');
  const candidate = specialAward?.singleCandidate;
  const retainedAward = slide.awards?.find((a) => a.type === 'retained_employees');

  const dataset: DepartmentPresenterDataset | undefined = slide.presenterDatasets?.fahrial;

  // Comparison metrics for Workforce Analytics
  const comparativeMetrics: Record<
    string,
    {
      label: string;
      unit: string;
      val2025: number;
      val2026: number;
      display2025: string;
      display2026: string;
      delta: string;
      isPositive: boolean;
      description: string;
      insight: string;
      color: string;
      icon: any;
    }
  > = {
    headcount: {
      label: 'Total Workforce Headcount',
      unit: 'Employees',
      val2025: 65,
      val2026: 87,
      display2025: '65 Staff',
      display2026: '87 Staff',
      delta: '+33.8% Net Expansion',
      isPositive: true,
      description: 'Total active full-time staff across all technical, operational, and administrative verticals.',
      insight: 'Company expanded by 22 active full-time members while keeping organizational structure agile and high-performing.',
      color: '#38bdf8',
      icon: Users,
    },
    retention: {
      label: 'Annual Retention Rate',
      unit: '%',
      val2025: 66.0,
      val2026: 81.5,
      display2025: '66.0%',
      display2026: '81.5%',
      delta: '+15.5% YoY Improvement',
      isPositive: true,
      description: 'Proportion of active employees retained over the operating period.',
      insight: 'Significant cultural stabilization with comprehensive wellbeing, performance incentives, and career pathways.',
      color: '#10b981',
      icon: Heart,
    },
    attrition: {
      label: 'Turnover / Attrition Rate',
      unit: '%',
      val2025: 34.0,
      val2026: 18.5,
      display2025: '34.0%',
      display2026: '18.5%',
      delta: '-15.5% Attrition Reduction',
      isPositive: true,
      description: 'Employee turnover rate (Lower is better).',
      insight: 'Reduced turnover by nearly half from 34.0% down to 18.5% through active engagement and proactive leadership.',
      color: '#f43f5e',
      icon: TrendingUp,
    },
    female_headcount: {
      label: 'Female Headcount Strength',
      unit: 'Employees',
      val2025: 9,
      val2026: 18,
      display2025: '9 Females (13.8%)',
      display2026: '18 Females (20.7%)',
      delta: '+100.0% Doubled in Size',
      isPositive: true,
      description: 'Female workforce count and representation ratio.',
      insight: 'Doubled female employee presence from 9 to 18 members, driving diversity across technical, design, and ops teams.',
      color: '#ec4899',
      icon: Crown,
    },
    male_headcount: {
      label: 'Male Headcount Strength',
      unit: 'Employees',
      val2025: 56,
      val2026: 69,
      display2025: '56 Males (86.2%)',
      display2026: '69 Males (79.3%)',
      delta: '+23.2% Organic Growth',
      isPositive: true,
      description: 'Male workforce strength across departments.',
      insight: 'Grew from 56 to 69 male professionals supporting high-velocity US operations and technical delivery.',
      color: '#818cf8',
      icon: Users,
    },
    job_fairs: {
      label: 'Campus & Job Fairs Attended',
      unit: 'Events',
      val2025: 6,
      val2026: 3,
      display2025: '6 Fairs (2025)',
      display2026: '3 Fairs (2026 YTD)',
      delta: '9 Total Fairs Conducted',
      isPositive: true,
      description: 'Campus talent hunting and external career fair participation.',
      insight: 'Built direct recruitment bridges with top universities, tapping into fresh engineering and analytical talent pools.',
      color: '#fbbf24',
      icon: Briefcase,
    },
  };

  const activeMetric = comparativeMetrics[selectedMetricKey] || comparativeMetrics.headcount;

  // 2026 Recruitment Funnel Data
  const recruitmentFunnel = [
    {
      step: 1,
      stage: 'Hiring Demand',
      count: 122,
      unit: 'Positions',
      conversionRate: '100%',
      desc: 'Total staffing positions required across all business verticals',
      badge: '122 Positions Demanded',
      highlight: 'Demand Baseline',
      color: 'from-blue-600 to-indigo-600',
      barPercent: 100,
    },
    {
      step: 2,
      stage: 'Candidates Reached',
      count: 1774,
      unit: 'CVs Called',
      conversionRate: '1,774 Reached',
      desc: 'Candidate resumes called, screened, and mobilized across university & job networks',
      badge: '1,774 Top of Funnel',
      highlight: 'Talent Outreach',
      color: 'from-sky-500 to-blue-600',
      barPercent: 100,
    },
    {
      step: 3,
      stage: 'CVs Shortlisted',
      count: 610,
      unit: 'Shortlisted',
      conversionRate: '34.4%',
      desc: '610 candidates shortlisted from 1,774 candidate resumes called',
      badge: '34.4% Shortlisting Rate',
      highlight: 'Quality Screening',
      color: 'from-cyan-500 to-teal-500',
      barPercent: 34.4,
    },
    {
      step: 4,
      stage: 'Interviews Conducted',
      count: 201,
      unit: 'Interviews',
      conversionRate: '33.0%',
      desc: '201 thorough panel interviews and technical problem-solving sessions',
      badge: '201 In-depth Interviews',
      highlight: 'Technical Assessment',
      color: 'from-teal-500 to-emerald-500',
      barPercent: 25.0,
    },
    {
      step: 5,
      stage: 'Selected for Training',
      count: 107,
      unit: 'Trainees Selected',
      conversionRate: '53.2%',
      desc: '107 candidates selected for structured onboarding from 201 interviews',
      badge: '53.2% Interview-to-Training',
      highlight: 'Rigorous Onboarding',
      color: 'from-amber-500 to-orange-500',
      barPercent: 18.0,
    },
    {
      step: 6,
      stage: 'Training Completed',
      count: 69,
      unit: 'Graduates',
      conversionRate: '64.5%',
      desc: '69 trainees successfully graduated from intensive multi-week training programs',
      badge: '64.5% Completion Rate',
      highlight: 'Accredited Ready',
      color: 'from-rose-500 to-pink-500',
      barPercent: 12.0,
    },
    {
      step: 7,
      stage: 'Employees Hired',
      count: 56,
      unit: 'Full Hires',
      conversionRate: '81.2%',
      desc: '56 hired from 69 training completions (81.2% Training-to-Hire Conversion; 45.9% demand fulfilled)',
      badge: '81.2% Conversion • 56 Hired',
      highlight: 'Final Placement',
      color: 'from-emerald-500 to-green-600',
      barPercent: 9.5,
    },
  ];

  // Filter historical table rows
  const historicalRows = dataset?.historicalTable?.rows || [];
  const filteredHistoricalRows = historicalRows.filter(
    (row) =>
      row.metric.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      row.definition.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      (row.source && row.source.toLowerCase().includes(tableSearchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-rose-950/40 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            SESSION 07 • PEOPLE, TALENT & CULTURE
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200">
            HR & Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Headline HR achievements: <span className="text-sky-300 font-bold">33.8% workforce growth</span> | <span className="text-emerald-300 font-bold">81.5% retention</span> | <span className="text-rose-300 font-bold">18.5% attrition</span> | <span className="text-pink-300 font-bold">female headcount +100%</span> | <span className="text-amber-300 font-bold">1,774 candidates reached</span> | <span className="text-emerald-300 font-bold">56 hires (81.2% conv.)</span>
          </p>
        </div>

        {/* Action Indicators */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center">
          <div className="flex items-center gap-2 bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            HOD: Fahrial Alam (Head of HR & Admin)
          </div>

          <button
            onClick={() => {
              setActiveTab('retained');
              soundFx.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'retained'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg'
                : 'bg-white/10 text-slate-200 hover:bg-white/20 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Retained Pillars
          </button>

          {candidate && (
            <button
              onClick={() => {
                setIsAwardOpen(true);
                soundFx.playFanfare();
              }}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Special Appreciation
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Presenter Pod & Comprehensive HR Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Speaker Stage Pod & Quick Profile */}
        <div className="lg:col-span-4 space-y-4">
          <SpeakerStagePod
            presenter={presenter}
            globalOutfit={globalOutfit}
            onPresenterOutfitChange={onPresenterOutfitChange}
            defaultMode="photo"
          />

          {/* Quick Stats Highlights */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                HR Growth Engine (2025 vs 2026)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[10px] text-slate-400">Total Workforce</div>
                <div className="text-lg font-black text-sky-400">87 Staff</div>
                <div className="text-[10px] text-emerald-400 font-semibold">+33.8% Growth</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[10px] text-slate-400">Retention Rate</div>
                <div className="text-lg font-black text-emerald-400">81.5%</div>
                <div className="text-[10px] text-emerald-300 font-semibold">+15.5% YoY Gain</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[10px] text-slate-400">Female Headcount</div>
                <div className="text-lg font-black text-pink-400">18 (20.7%)</div>
                <div className="text-[10px] text-pink-300 font-semibold">+100.0% Doubled</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                <div className="text-[10px] text-slate-400">Training-to-Hire</div>
                <div className="text-lg font-black text-amber-400">81.2%</div>
                <div className="text-[10px] text-amber-300 font-semibold">56 Hired of 69</div>
              </div>
            </div>

            {/* Quick Quote */}
            <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[11px] text-blue-200 italic">
              "We foster talent, happiness, and high-velocity retention across our growing Winbridge family."
            </div>
          </div>
        </div>

        {/* Right Column: 4 Top KPI Cards + Interactive Sub-Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {slide.metrics?.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 hover:border-rose-500/40 transition-all shadow-lg flex flex-col justify-between group"
              >
                <span className="text-xs font-semibold text-slate-300 line-clamp-1">{metric.label}</span>
                <div className="text-2xl sm:text-3xl font-black text-white my-1 group-hover:scale-105 transition-transform">
                  {metric.value}
                </div>
                <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  {metric.change}
                </span>
              </div>
            ))}
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 overflow-x-auto scrollbar-none">
            <button
              onClick={() => {
                setActiveTab('workforce');
                soundFx.playClick();
              }}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'workforce'
                  ? 'bg-gradient-to-r from-blue-600 to-rose-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Workforce & Retention
            </button>

            <button
              onClick={() => {
                setActiveTab('funnel');
                soundFx.playClick();
              }}
              className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'funnel'
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              2026 Funnel (1,774 → 56)
            </button>

            <button
              onClick={() => {
                setActiveTab('matrix');
                soundFx.playClick();
              }}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'matrix'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Historical Matrix (11 KPIs)
            </button>

            <button
              onClick={() => {
                setActiveTab('culture');
                soundFx.playClick();
              }}
              className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'culture'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              Culture & Appreciation
            </button>
          </div>

          {/* TAB CONTENT 1: WORKFORCE & RETENTION ANALYTICS */}
          {activeTab === 'workforce' && (
            <div className="space-y-4">
              {/* Metric Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries(comparativeMetrics).map(([key, item]) => {
                  const isSelected = selectedMetricKey === key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedMetricKey(key);
                        soundFx.playClick();
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/15 border-rose-400/80 shadow-lg scale-102'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />}
                      </div>
                      <div className="text-[11px] font-bold text-white line-clamp-1">{item.label}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">{item.delta}</div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Metric Comparative Visualizer */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1026]/90 to-[#050A18] border border-white/15 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                      Comparative Growth Analysis (2025 Baseline vs. Aug 2026 / YTD)
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      {activeMetric.label}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">{activeMetric.description}</p>
                  </div>

                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm">
                    {activeMetric.delta}
                  </div>
                </div>

                {/* Comparative Visual Bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2025 Baseline Bar */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                      <span>2025 Annual Baseline</span>
                      <span className="text-slate-300">Previous Benchmark</span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-300">
                      {activeMetric.display2025}
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-slate-500 transition-all duration-700"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              15,
                              (activeMetric.val2025 / Math.max(activeMetric.val2025, activeMetric.val2026)) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Aug 2026 / YTD Bar */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/30 to-blue-950/30 border border-rose-500/30 space-y-2 shadow-lg">
                    <div className="flex items-center justify-between text-xs text-rose-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                        Aug 2026 / YTD Achievement
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        Current Scaled
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-between">
                      <span>{activeMetric.display2026}</span>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        {activeMetric.delta}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-sky-400 transition-all duration-700 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Executive Strategic Insight */}
                <div className="p-4 rounded-2xl bg-blue-900/20 border border-blue-400/20 flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-white block font-bold mb-0.5">Strategic HR Impact:</strong>
                    {activeMetric.insight}
                  </div>
                </div>

                {/* 3 Summary Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Retention Surge</div>
                    <div className="font-extrabold text-emerald-300 text-sm mt-0.5">81.5% (+15.5% Gain)</div>
                    <p className="text-[11px] text-slate-300 mt-1">Attrition plunged from 34.0% down to 18.5%.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Gender Diversity</div>
                    <div className="font-extrabold text-pink-300 text-sm mt-0.5">18 Females (+100.0%)</div>
                    <p className="text-[11px] text-slate-300 mt-1">Representation increased from 13.8% to 20.7%.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Training Efficiency</div>
                    <div className="font-extrabold text-sky-300 text-sm mt-0.5">81.2% Conv. Rate</div>
                    <p className="text-[11px] text-slate-300 mt-1">56 hires secured from 69 training graduates.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: 2026 RECRUITMENT FUNNEL */}
          {activeTab === 'funnel' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1026]/90 to-[#050A18] border border-white/15 shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      Comprehensive Candidate Journey & High-Impact Conversion
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      2026 Recruitment Funnel | Key HR Achievements
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Tracking 1,774 candidate resumes called down to 56 top-tier employee hires against 122 demand.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
                      81.2% Training-to-Hire
                    </span>
                  </div>
                </div>

                {/* Interactive Funnel Steps */}
                <div className="space-y-3">
                  {recruitmentFunnel.map((step, idx) => {
                    const isSelected = selectedFunnelStep === idx;
                    return (
                      <div
                        key={step.step}
                        onClick={() => {
                          setSelectedFunnelStep(isSelected ? null : idx);
                          soundFx.playClick();
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white/15 border-cyan-400 shadow-xl scale-101'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                              0{step.step}
                            </div>
                            <div>
                              <div className="text-sm font-black text-white flex items-center gap-2">
                                {step.stage}
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-semibold">
                                  {step.highlight}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400">{step.desc}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 self-end sm:self-center">
                            <div className="text-right">
                              <div className="text-base font-black text-white">
                                {typeof step.count === 'number' ? step.count.toLocaleString() : step.count}
                              </div>
                              <div className="text-[10px] font-bold text-emerald-400">{step.badge}</div>
                            </div>
                          </div>
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${step.color} transition-all duration-700`}
                            style={{ width: `${Math.max(8, step.barPercent)}%` }}
                          />
                        </div>

                        {/* Conversion Bridge Pill to Next Step */}
                        {idx < recruitmentFunnel.length - 1 && (
                          <div className="mt-2 flex items-center justify-end text-[10px] text-slate-400 gap-1 font-mono">
                            <span>Step conversion:</span>
                            <span className="text-cyan-300 font-bold">
                              {recruitmentFunnel[idx + 1].conversionRate}
                            </span>
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Funnel Summary Insights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
                    <div className="text-[10px] font-bold uppercase text-cyan-300">Top-of-Funnel Reach</div>
                    <div className="text-lg font-black text-white mt-0.5">1,774 Candidates</div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Aggressive multi-channel sourcing calling 1,774 candidate resumes.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/20">
                    <div className="text-[10px] font-bold uppercase text-teal-300">Selection Precision</div>
                    <div className="text-lg font-black text-white mt-0.5">34.4% → 53.2%</div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Filtered 610 shortlist & 201 interviews into 107 high-aptitude trainees.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
                    <div className="text-[10px] font-bold uppercase text-emerald-300">Final Hire Yield</div>
                    <div className="text-lg font-black text-white mt-0.5">81.2% Conversion</div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      69 training completions generated 56 full-time verified hires.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 3: HISTORICAL DATA TABLE */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1026]/90 to-[#050A18] border border-white/15 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">
                      Official Verified Data Matrix
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      HR Workforce & Retention Snapshot
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      2025 Baseline vs. Aug 2026 / YTD Performance (Owner: Fahrial Alam - HOD HR & Admin)
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      placeholder="Filter 11 metrics..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/10 text-slate-300 font-bold border-b border-white/10">
                      <tr>
                        <th className="p-3">Metric Name</th>
                        <th className="p-3">2025 Baseline</th>
                        <th className="p-3">Aug 2026 / YTD</th>
                        <th className="p-3">Source System</th>
                        <th className="p-3 text-center">Owner & Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredHistoricalRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-white/5 transition-colors ${
                            row.highlight ? 'bg-purple-950/20 font-semibold' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {row.highlight && <Star className="w-3 h-3 text-amber-400 shrink-0" />}
                              {row.metric}
                            </div>
                            <div className="text-[11px] text-slate-400 max-w-xs">{row.definition}</div>
                          </td>
                          <td className="p-3 text-slate-300 font-mono">
                            {row.values?.['2025'] || 'N/A'}
                          </td>
                          <td className="p-3 font-bold text-emerald-400 font-mono">
                            {row.values?.['2026'] || 'N/A'}
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                              {row.source}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="text-[11px] text-slate-300 font-medium">{row.owner}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                              {row.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Source: Picnic HR Master Register & 2026 Recruitment Funnel Tracker</span>
                  <span>Showing {filteredHistoricalRows.length} of 11 verified metrics</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: CULTURE & SPECIAL APPRECIATION */}
          {activeTab === 'culture' && (
            <div className="space-y-4">
              {/* Special Appreciation Honoree Card */}
              {candidate && (
                <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-900/30 via-purple-900/20 to-[#050A18] border-2 border-rose-400/50 shadow-[0_0_40px_rgba(244,63,94,0.2)] relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Initials Badge */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-1 shadow-2xl">
                        <div className="w-full h-full rounded-2xl bg-[#050A18] flex items-center justify-center text-rose-400 font-black text-3xl">
                          {candidate.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-rose-500 text-white shadow-md">
                        <Crown className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Honoree Details */}
                    <div className="flex-1 text-center sm:text-left">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        <Star className="w-3.5 h-3.5 fill-rose-300" />
                        Special Appreciation Honoree 2026
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{candidate.name}</h3>
                      <p className="text-xs sm:text-sm font-semibold text-rose-300 mb-2">
                        {candidate.role} • <span className="text-amber-300">{candidate.metric}</span>
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                        "{candidate.achievement}"
                      </p>
                    </div>

                    {/* Ceremony Button */}
                    <button
                      onClick={() => {
                        setIsAwardOpen(true);
                        soundFx.playFanfare();
                      }}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Stage Ceremony
                    </button>
                  </div>
                </div>
              )}

              {/* Engagement & Wellbeing Initiatives */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-900/15 via-[#0a1026]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Smile className="w-4 h-4 text-rose-400" />
                  Employee Engagement & Holistic Wellbeing Initiatives
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-sky-400" />
                      Continuous Learning & Leadership
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Over 1,280+ hours of accredited technical training, SFR process certifications, and soft-skill development workshops completed.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      Health, Wellness & Recreation
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Comprehensive health support, annual company picnics, sports tournaments, and periodic mental wellness check-ins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 5: RETAINED HR PILLARS */}
          {activeTab === 'retained' && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/20 via-[#0a1026]/90 to-[#050A18] border border-amber-500/30 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      Loyalty & Sustained Leadership
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                      HR & Administration Retained Pillars
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                    2+ Years Dedication
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {retainedAward?.retainedList?.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-300 text-sm">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{member.name}</div>
                          <div className="text-xs text-slate-400">{member.role}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          {member.badge || 'Retained Anchor'}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{member.yearsOfService} Years Service</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Award Ceremony Modal for Special Appreciation */}
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
