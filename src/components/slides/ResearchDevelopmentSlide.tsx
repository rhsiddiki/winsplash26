import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideData, OutfitTheme, DepartmentPresenterDataset } from '../../types';
import { SpeakerStagePod } from '../SpeakerStagePod';
import { AwardCeremonyModal } from '../AwardCeremonyModal';
import { RetainedEmployeesWall } from '../RetainedEmployeesWall';
import {
  Trophy,
  Users,
  Database,
  Building2,
  CheckCircle2,
  Zap,
  TrendingUp,
  Sparkles,
  BarChart3,
  Globe,
  Table,
  Search,
  Info,
  ShieldCheck,
  Briefcase,
  Star,
  MapPin,
  Clock,
  Flame,
  CheckCircle,
  Home,
  Check,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface ResearchDevelopmentSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

type ResidentialViewMode = 'charts' | 'states' | 'table' | 'clients' | 'pillars';

// Comprehensive US States data for Residential Development
interface StateItem {
  code: string;
  name: string;
  yearAdded: 2025 | 2026;
  isPioneer: boolean;
  region: 'South' | 'West' | 'Midwest' | 'Northeast';
}

const ALL_30_STATES: StateItem[] = [
  { code: 'AL', name: 'Alabama', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'AR', name: 'Arkansas', yearAdded: 2026, isPioneer: false, region: 'South' },
  { code: 'AZ', name: 'Arizona', yearAdded: 2025, isPioneer: true, region: 'West' },
  { code: 'CA', name: 'California', yearAdded: 2025, isPioneer: true, region: 'West' },
  { code: 'CO', name: 'Colorado', yearAdded: 2026, isPioneer: false, region: 'West' },
  { code: 'CT', name: 'Connecticut', yearAdded: 2025, isPioneer: true, region: 'Northeast' },
  { code: 'FL', name: 'Florida', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'GA', name: 'Georgia', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'IA', name: 'Iowa', yearAdded: 2026, isPioneer: false, region: 'Midwest' },
  { code: 'IL', name: 'Illinois', yearAdded: 2026, isPioneer: false, region: 'Midwest' },
  { code: 'IN', name: 'Indiana', yearAdded: 2025, isPioneer: true, region: 'Midwest' },
  { code: 'KY', name: 'Kentucky', yearAdded: 2026, isPioneer: false, region: 'South' },
  { code: 'MA', name: 'Massachusetts', yearAdded: 2025, isPioneer: true, region: 'Northeast' },
  { code: 'MD', name: 'Maryland', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'MI', name: 'Michigan', yearAdded: 2026, isPioneer: false, region: 'Midwest' },
  { code: 'MO', name: 'Missouri', yearAdded: 2026, isPioneer: false, region: 'Midwest' },
  { code: 'MS', name: 'Mississippi', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'NC', name: 'North Carolina', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'NJ', name: 'New Jersey', yearAdded: 2026, isPioneer: false, region: 'Northeast' },
  { code: 'NV', name: 'Nevada', yearAdded: 2026, isPioneer: false, region: 'West' },
  { code: 'NY', name: 'New York', yearAdded: 2025, isPioneer: true, region: 'Northeast' },
  { code: 'OH', name: 'Ohio', yearAdded: 2026, isPioneer: false, region: 'Midwest' },
  { code: 'OK', name: 'Oklahoma', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'OR', name: 'Oregon', yearAdded: 2026, isPioneer: false, region: 'West' },
  { code: 'RI', name: 'Rhode Island', yearAdded: 2026, isPioneer: false, region: 'Northeast' },
  { code: 'SC', name: 'South Carolina', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'TN', name: 'Tennessee', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'TX', name: 'Texas', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'VA', name: 'Virginia', yearAdded: 2025, isPioneer: true, region: 'South' },
  { code: 'WV', name: 'West Virginia', yearAdded: 2026, isPioneer: false, region: 'South' },
];

export const ResearchDevelopmentSlide: React.FC<ResearchDevelopmentSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'retained'>('overview');
  const [isAwardOpen, setIsAwardOpen] = useState<boolean>(false);

  // Sub-view switcher for HOD presentation
  const [viewMode, setViewMode] = useState<ResidentialViewMode>('charts');
  const [selectedChartMetric, setSelectedChartMetric] = useState<string>('work_orders');
  const [stateFilter, setStateFilter] = useState<'all' | '2025' | '2026_new'>('all');
  const [stateSearchTerm, setStateSearchTerm] = useState<string>('');
  const [tableSearchTerm, setTableSearchTerm] = useState<string>('');

  const presenter = slide.presenters[0];
  const topPerformerAward = slide.awards?.find((a) => a.type === 'top_performer');
  const retainedAward = slide.awards?.find((a) => a.type === 'retained_employees');

  const dataset: DepartmentPresenterDataset | undefined =
    slide.presenterDatasets?.abdur || slide.presenterDatasets?.rafael;

  // Chart configs comparing 2025 vs 2026 performance
  const chartConfigurations: Record<
    string,
    {
      title: string;
      subtitle: string;
      unit: string;
      values2025: number;
      values2026: number;
      secondary2025?: number;
      secondary2026?: number;
      secondaryLabel?: string;
      primaryLabel?: string;
      deltaText: string;
      color: string;
      icon: any;
      description: string;
    }
  > = useMemo(
    () => ({
      work_orders: {
        title: 'Work Orders Completed: Accepted vs. Closed (2025 vs 2026)',
        subtitle: '8,677 Total Accepted Orders (2-Year Cumulative)',
        unit: 'Orders',
        values2025: 2032,
        values2026: 6645,
        secondary2025: 1905,
        secondary2026: 6040,
        primaryLabel: 'Accepted Orders',
        secondaryLabel: 'Closed Orders',
        deltaText: '+227.0% Volume Surge in 2026',
        color: '#0284c7',
        icon: Database,
        description: 'Explosive 3.27x volume expansion from 2,032 accepted orders in 2025 to 6,645 in 2026 across 8 operating months.',
      },
      sfr_properties: {
        title: 'Single-Family Rental (SFR) Properties Serviced',
        subtitle: '3,986 Cumulative SFR Homes Managed Nationwide',
        unit: 'SFR Units',
        values2025: 978,
        values2026: 3008,
        deltaText: '+207.6% Property Growth (3.08x)',
        color: '#3b82f6',
        icon: Home,
        description: 'Scaled residential maintenance and turn services from 978 properties in 2025 to 3,008 SFR properties in 2026.',
      },
      active_clients: {
        title: 'Active Enterprise Clients in Residential Vertical',
        subtitle: 'From Inaugural 10 Clients to 17 Enterprise Accounts',
        unit: 'Clients',
        values2025: 10,
        values2026: 17,
        deltaText: '+70.0% Client Base Expansion',
        color: '#6366f1',
        icon: Users,
        description: 'Expanded institutional SFR client base including pioneer partner AMH and flagship partner Progress Residential.',
      },
      states_footprint: {
        title: 'US States Covered Nationwide',
        subtitle: 'Tripled Territorial Reach (17 to 30 US States)',
        unit: 'States',
        values2025: 17,
        values2026: 30,
        deltaText: '+76.5% Geographic Footprint (+13 States)',
        color: '#0ea5e9',
        icon: Globe,
        description: 'Expanded across 30 US states, adding 13 strategic new states in 2026 including OH, IL, CO, MI, and MO.',
      },
      tat_speed: {
        title: 'Average Work Order Turnaround Time (TAT in Hours)',
        subtitle: 'Massive 66.7% Turnaround Compression (72h → 24h)',
        unit: 'Hours',
        values2025: 72,
        values2026: 24,
        deltaText: '-66.7% Faster Execution (48h Saved)',
        color: '#f59e0b',
        icon: Clock,
        description: 'Dramatically accelerated turnaround velocity from 72 hours down to 24 hours while managing 3.3x higher volume.',
      },
      qa_compliance: {
        title: 'Compliance / Quality Assurance Pass Rate (%)',
        subtitle: 'Near-Flawless 99.99% First-Time Right Standard',
        unit: '%',
        values2025: 99.19,
        values2026: 99.99,
        deltaText: '99.99% QA Pass (Zero Defects)',
        color: '#10b981',
        icon: ShieldCheck,
        description: 'Elevated quality assurance benchmark to 99.99% without rework requests, dropping client escalations by 40%.',
      },
      field_crews: {
        title: 'Contractor & Vendor Network Coordinated',
        subtitle: '441 Vetted Field Crews Mobilized in 2026',
        unit: 'Field Crews',
        values2025: 231,
        values2026: 441,
        deltaText: '+90.9% Vendor Scale Expansion',
        color: '#8b5cf6',
        icon: Building2,
        description: 'Mobilized a dedicated network of 441 vetted contractor crews executing field maintenance across 606 cities.',
      },
      cities_covered: {
        title: 'US Cities & Metropolitan Clusters Covered',
        subtitle: 'Expanded from 346 Cities to 606 Cities Nationwide',
        unit: 'Cities',
        values2025: 346,
        values2026: 606,
        deltaText: '+75.1% City Reach Growth',
        color: '#06b6d4',
        icon: MapPin,
        description: 'Deepened local market penetration servicing 606 US cities across 30 active states.',
      },
      team_headcount: {
        title: 'Residential Vertical Headcount',
        subtitle: 'Specialized Team Expanded from 15 to 33 Professionals',
        unit: 'Specialists',
        values2025: 15,
        values2026: 33,
        deltaText: '+120.0% Team Scaling (2.2x)',
        color: '#ec4899',
        icon: Users,
        description: 'Strengthened in-house operations, QA specialists, and vendor coordinators to sustain exponential SFR growth.',
      },
      sla_escalations: {
        title: 'SLA Escalations Recorded (Fewer is Better)',
        subtitle: '40% Reduction in Client Escalations Despite 3.3x Volume',
        unit: 'Incidents',
        values2025: 5,
        values2026: 3,
        deltaText: '-40.0% Escalation Drop',
        color: '#10b981',
        icon: CheckCircle,
        description: 'Reduced formal client escalations from 5 to 3 even while processing 3.27x higher work order volume.',
      },
    }),
    []
  );

  const currentChartConfig =
    chartConfigurations[selectedChartMetric] || chartConfigurations.work_orders;

  // Filtered states for the interactive 30-state map explorer
  const filteredStates = useMemo(() => {
    return ALL_30_STATES.filter((st) => {
      const matchesFilter =
        stateFilter === 'all'
          ? true
          : stateFilter === '2025'
          ? st.isPioneer
          : !st.isPioneer;
      const matchesSearch =
        st.name.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
        st.code.toLowerCase().includes(stateSearchTerm.toLowerCase()) ||
        st.region.toLowerCase().includes(stateSearchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [stateFilter, stateSearchTerm]);

  // Filtered rows for the official 12-row historical table
  const filteredHistoricalRows = useMemo(() => {
    if (!dataset?.historicalTable) return [];
    if (!tableSearchTerm.trim()) return dataset.historicalTable.rows;
    return dataset.historicalTable.rows.filter(
      (r) =>
        r.metric.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        r.definition.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        r.source?.toLowerCase().includes(tableSearchTerm.toLowerCase())
    );
  }, [dataset, tableSearchTerm]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Slide Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-600/20 border border-sky-500/30 text-sky-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Home className="w-3.5 h-3.5 text-sky-400" />
          SESSION 06 • RESIDENTIAL DEVELOPMENT & SFR OPERATIONS
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-blue-200">
          Residential Development (R&D)
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl mx-auto">
          {slide.subtitle ||
            'Exponential Single-Family Rental (SFR) Scaling, 30 US States & 24h Turnaround'}
        </p>
      </div>

      {/* View Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-sky-300 px-3 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            HOD: Abdur Rahman (Head of Residential)
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
                ? 'bg-sky-600 text-white shadow-[0_0_15px_rgba(2,132,199,0.4)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-sky-400" />
            {activeView === 'retained'
              ? 'Back to Residential Presentation'
              : 'Residential Retained Pillars & Team'}
          </button>

          <button
            onClick={() => {
              setIsAwardOpen(true);
              soundFx.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Trophy className="w-4 h-4" />
            SFR Champion Award
          </button>
        </div>
      </div>

      {activeView === 'retained' && retainedAward?.retainedList ? (
        <RetainedEmployeesWall
          employees={retainedAward.retainedList}
          departmentTitle="Residential Development"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Presenter Stage Pod */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-4">
            <SpeakerStagePod
              presenter={presenter}
              globalOutfit={globalOutfit}
              onPresenterOutfitChange={onPresenterOutfitChange}
              defaultMode="photo"
            />

            {/* Quick Summary Highlights Card */}
            <div className="w-full p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 via-slate-900/60 to-slate-950/80 border border-sky-500/20 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Growth Velocity (2025 → 2026)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px]">
                  3.27x Surge
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Accepted Orders</div>
                  <div className="text-lg font-black text-white">6,645</div>
                  <div className="text-[10px] font-semibold text-emerald-400">+227% in 2026</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">SFR Properties</div>
                  <div className="text-lg font-black text-white">3,008</div>
                  <div className="text-[10px] font-semibold text-emerald-400">+207.6% (3.08x)</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">Turnaround (TAT)</div>
                  <div className="text-lg font-black text-amber-300">24 Hours</div>
                  <div className="text-[10px] font-semibold text-sky-400">From 72 Hours</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[11px] text-slate-400">QA Pass Rate</div>
                  <div className="text-lg font-black text-emerald-300">99.99%</div>
                  <div className="text-[10px] font-semibold text-emerald-400">Near Flawless</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Deep-Dive Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top 4 Key Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {slide.metrics?.map((metric, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/40 transition-all shadow-lg flex flex-col justify-between"
                >
                  <span className="text-xs font-medium text-slate-400 line-clamp-1">
                    {metric.label}
                  </span>
                  <div className="text-2xl font-black text-white my-1">{metric.value}</div>
                  <span className="text-[11px] font-semibold text-sky-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {metric.change}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Sub-View Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/80 rounded-2xl border border-white/10">
              <button
                onClick={() => {
                  setViewMode('charts');
                  soundFx.playClick();
                }}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'charts'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Visual Trend Analytics
              </button>

              <button
                onClick={() => {
                  setViewMode('states');
                  soundFx.playClick();
                }}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'states'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4" />
                30 US States Footprint
              </button>

              <button
                onClick={() => {
                  setViewMode('table');
                  soundFx.playClick();
                }}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Table className="w-4 h-4" />
                Historical Data Table (12 Rows)
              </button>

              <button
                onClick={() => {
                  setViewMode('clients');
                  soundFx.playClick();
                }}
                className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  viewMode === 'clients'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Client Journey & Pillars
              </button>
            </div>

            {/* TAB 1: VISUAL TREND ANALYTICS */}
            {viewMode === 'charts' && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/20 via-[#0a1428]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <currentChartConfig.icon className="w-5 h-5 text-sky-400" />
                      {currentChartConfig.title}
                    </h3>
                    <p className="text-xs text-slate-400">{currentChartConfig.subtitle}</p>
                  </div>

                  {/* Metric Switcher Dropdown */}
                  <select
                    value={selectedChartMetric}
                    onChange={(e) => {
                      setSelectedChartMetric(e.target.value);
                      soundFx.playClick();
                    }}
                    aria-label="Select Residential Development Performance Metric"
                    className="bg-slate-900 border border-white/20 text-sky-300 text-xs font-bold rounded-xl px-3 py-2 outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="work_orders">📊 Work Orders: Accepted vs. Closed</option>
                    <option value="sfr_properties">🏠 SFR Properties Serviced (3,008)</option>
                    <option value="active_clients">👥 Active Clients (10 → 17)</option>
                    <option value="states_footprint">🌐 US States Footprint (17 → 30 States)</option>
                    <option value="tat_speed">⚡ Turnaround Speed (72h → 24h)</option>
                    <option value="qa_compliance">🛡️ QA Pass Rate (99.19% → 99.99%)</option>
                    <option value="field_crews">🛠️ Contractors / Field Crews (231 → 441)</option>
                    <option value="cities_covered">📍 US Cities Covered (346 → 606)</option>
                    <option value="team_headcount">👨‍💼 Team Headcount (15 → 33)</option>
                    <option value="sla_escalations">✅ Escalations Drop (5 → 3)</option>
                  </select>
                </div>

                {/* Interactive Comparative 2025 vs 2026 Visualizer */}
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10 space-y-6">
                  {/* Visual Bar Comparison */}
                  <div className="space-y-4">
                    {/* 2025 Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-400 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                          2025 Baseline (March – December '2025)
                        </span>
                        <span className="text-white font-mono text-sm">
                          {currentChartConfig.values2025.toLocaleString()}{' '}
                          <span className="text-xs text-slate-400">
                            {currentChartConfig.unit}
                          </span>
                          {currentChartConfig.secondary2025 && (
                            <span className="text-xs text-slate-400 font-normal ml-2">
                              (Closed: {currentChartConfig.secondary2025.toLocaleString()})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="h-8 w-full bg-white/5 rounded-xl overflow-hidden p-1 border border-white/5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                12,
                                (currentChartConfig.values2025 /
                                  Math.max(
                                    currentChartConfig.values2025,
                                    currentChartConfig.values2026
                                  )) *
                                  100
                              )
                            )}%`,
                          }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center px-3"
                        >
                          <span className="text-[11px] font-bold text-white truncate">
                            {currentChartConfig.values2025.toLocaleString()}{' '}
                            {currentChartConfig.unit}
                          </span>
                        </motion.div>
                      </div>
                    </div>

                    {/* 2026 Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-sky-300 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
                          2026 Surge (January – August '2026)
                        </span>
                        <span className="text-sky-300 font-mono text-sm font-black">
                          {currentChartConfig.values2026.toLocaleString()}{' '}
                          <span className="text-xs text-sky-400">
                            {currentChartConfig.unit}
                          </span>
                          {currentChartConfig.secondary2026 && (
                            <span className="text-xs text-sky-400 font-normal ml-2">
                              (Closed: {currentChartConfig.secondary2026.toLocaleString()})
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="h-10 w-full bg-sky-950/40 rounded-xl overflow-hidden p-1 border border-sky-500/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                15,
                                (currentChartConfig.values2026 /
                                  Math.max(
                                    currentChartConfig.values2025,
                                    currentChartConfig.values2026
                                  )) *
                                  100
                              )
                            )}%`,
                          }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-400 rounded-lg flex items-center justify-between px-3 shadow-[0_0_20px_rgba(2,132,199,0.5)]"
                        >
                          <span className="text-xs font-black text-white truncate">
                            {currentChartConfig.values2026.toLocaleString()}{' '}
                            {currentChartConfig.unit}
                          </span>
                          <span className="text-[11px] font-extrabold bg-black/40 text-sky-200 px-2 py-0.5 rounded-md">
                            {currentChartConfig.deltaText}
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Metric Takeaway */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                    <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300 leading-relaxed">
                      <strong className="text-white">Executive Analysis:</strong>{' '}
                      {currentChartConfig.description}
                    </div>
                  </div>
                </div>

                {/* 3 Strategic Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400">Total 2-Year Accepted Volume</div>
                    <div className="text-xl font-black text-white">8,677 Orders</div>
                    <div className="text-[10px] text-sky-300 font-semibold">
                      7,945 Closed Orders (91.6% Completion)
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400">Turnaround Velocity</div>
                    <div className="text-xl font-black text-amber-300">24h Avg TAT</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      66.7% Faster than 72h Baseline
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                    <div className="text-[11px] text-slate-400">Quality & Pass Standard</div>
                    <div className="text-xl font-black text-emerald-300">99.99% QA Pass</div>
                    <div className="text-[10px] text-sky-300 font-semibold">
                      -40% Escalations (Only 3 in 2026)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 30 US STATES INTERACTIVE FOOTPRINT */}
            {viewMode === 'states' && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/20 via-[#0a1428]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-sky-400" />
                      30 US States Geographic Footprint & 606 Cities
                    </h3>
                    <p className="text-xs text-slate-400">
                      17 Inaugural States in 2025 + 13 High-Growth States Added in 2026
                    </p>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      onClick={() => setStateFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        stateFilter === 'all'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      All 30 States
                    </button>
                    <button
                      onClick={() => setStateFilter('2025')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        stateFilter === '2025'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      17 Launch States
                    </button>
                    <button
                      onClick={() => setStateFilter('2026_new')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        stateFilter === '2026_new'
                          ? 'bg-sky-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      13 New in 2026
                    </button>
                  </div>
                </div>

                {/* State Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search state by name, code (e.g. TX, FL, CA), or region..."
                    value={stateSearchTerm}
                    onChange={(e) => setStateSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                  />
                </div>

                {/* States Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {filteredStates.map((st) => (
                    <div
                      key={st.code}
                      className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                        st.isPioneer
                          ? 'bg-white/5 border-white/10 hover:border-sky-500/50'
                          : 'bg-sky-950/30 border-sky-500/30 hover:border-sky-400 shadow-[0_0_12px_rgba(2,132,199,0.2)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-black text-white font-mono">
                          {st.code}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                            st.isPioneer
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-sky-500/30 text-sky-300 border border-sky-500/40'
                          }`}
                        >
                          {st.isPioneer ? '2025 Launch' : '2026 Added'}
                        </span>
                      </div>
                      <div className="mt-1">
                        <div className="text-xs font-semibold text-slate-200 truncate">
                          {st.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{st.region} Region</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-blue-950/60 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-sky-400" />
                      606 Active Cities & Metropolitan Clusters
                    </span>
                    <span className="text-slate-300 text-[11px]">
                      Nationwide SFR coverage across 441 coordinated contractor crews.
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-sky-300">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                      17 States in 2025
                    </span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-white">
                      30 States in 2026 (+76.5%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMPLETE OFFICIAL HISTORICAL DATA TABLE */}
            {viewMode === 'table' && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/20 via-[#0a1428]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Table className="w-5 h-5 text-sky-400" />
                      Official Residential Performance Matrix (2025 vs. 2026)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Verified Data Sources: PPW, Client Portal, Winbridge Contact List & Manuel Register
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative min-w-[220px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter 12 metrics..."
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
                  <table className="w-full text-left text-xs text-slate-200 border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3 px-3.5">#</th>
                        <th className="py-3 px-3.5">Metric & Definition</th>
                        <th className="py-3 px-3.5">Unit</th>
                        <th className="py-3 px-3.5 text-slate-300">2025 (Mar–Dec)</th>
                        <th className="py-3 px-3.5 text-sky-300 font-bold">2026 (Jan–Aug)</th>
                        <th className="py-3 px-3.5">Source</th>
                        <th className="py-3 px-3.5">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredHistoricalRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`hover:bg-white/5 transition-colors ${
                            row.highlight ? 'bg-sky-950/20 font-semibold' : ''
                          }`}
                        >
                          <td className="py-3 px-3.5 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-3.5 max-w-[240px]">
                            <div className="font-bold text-white">{row.metric}</div>
                            <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                              {row.definition}
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-300 text-[11px]">
                            {row.unit}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-300 whitespace-pre-line">
                            {row.values['2025'] || 'N/A'}
                          </td>
                          <td className="py-3 px-3.5 font-mono text-sky-300 font-bold whitespace-pre-line">
                            {row.values['2026'] || 'N/A'}
                          </td>
                          <td className="py-3 px-3.5 text-[10px] text-slate-400">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {row.source || 'PPW'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold ${
                                row.confidence === 'Verified'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {row.confidence || 'Verified'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer Meta */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                  <span>Owner: Abdur Rahman — Head Of Residential</span>
                  <span>Showing {filteredHistoricalRows.length} official metrics</span>
                </div>
              </div>
            )}

            {/* TAB 4: CLIENT JOURNEY, TIMELINE & STRATEGIC PILLARS */}
            {viewMode === 'clients' && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/20 via-[#0a1428]/80 to-[#050A18] border border-white/10 backdrop-blur-md shadow-xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-sky-400" />
                    Residential Client Journey & Growth Pillars
                  </h3>
                  <p className="text-xs text-slate-400">
                    From March 2025 Pioneer AMH to Progress Residential & 17 Active Enterprise Accounts
                  </p>
                </div>

                {/* Timeline Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 2025 Launch Account */}
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold">
                        March 2025 Launch
                      </span>
                      <span className="text-xs font-mono text-slate-400">10 Clients Total</span>
                    </div>
                    <h4 className="text-base font-black text-white">
                      AMH (American Homes 4 Rent)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Inaugural client partner that launched the Residential Development vertical in March 2025. Delivered 2,032 accepted orders across 17 US states.
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>978 Properties</span>
                      <span>231 Field Crews</span>
                    </div>
                  </div>

                  {/* 2026 Enterprise Giant */}
                  <div className="p-5 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-3 relative overflow-hidden shadow-[0_0_20px_rgba(2,132,199,0.15)]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/20 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-400" />
                        2026 Enterprise Expansion
                      </span>
                      <span className="text-xs font-mono text-sky-300 font-bold">17 Clients Total</span>
                    </div>
                    <h4 className="text-base font-black text-white">
                      Progress Residential & Flagship Accounts
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Scaled by +227% in accepted orders (6,645 orders), servicing 3,008 SFR properties across 30 US states and 606 cities with 24-hour turnaround.
                    </p>
                    <div className="pt-2 border-t border-sky-500/20 flex items-center justify-between text-[11px] text-sky-300 font-mono">
                      <span>3,008 SFR Properties</span>
                      <span>441 Coordinated Crews</span>
                    </div>
                  </div>
                </div>

                {/* 4 Core Pillars */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Strategic Operational Pillars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {dataset?.keyHighlights?.map((hl, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">{hl.title}</span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {hl.badge}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {hl.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HOD Executive Statement */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-blue-950/60 border border-sky-500/30 flex items-start gap-3">
                  <Star className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-200 leading-relaxed">
                    <strong className="text-white block font-bold mb-0.5">
                      HOD Abdur Rahman — Strategic Vision:
                    </strong>
                    "{dataset?.executiveStatement ||
                      'Residential Development has transformed into an operational powerhouse. Since launching in March 2025 with AMH, the vertical has scaled to 6,645 accepted work orders across 3,008 SFR properties, expanding into 30 US states and 606 cities with a 24h turnaround and 99.99% QA compliance.'}"
                  </div>
                </div>
              </div>
            )}

            {/* Award Ceremony Callout Card */}
            {topPerformerAward && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0a1026]/80 to-[#050A18] border border-amber-500/30 backdrop-blur-md shadow-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    {topPerformerAward.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Recognizing our top SFR operations lead, compliance specialist & vendor coordinators.
                  </p>
                </div>
                <button
                  onClick={() => setIsAwardOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  Reveal Champion
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Award Ceremony Modal */}
      {topPerformerAward && (
        <AwardCeremonyModal
          isOpen={isAwardOpen}
          onClose={() => setIsAwardOpen(false)}
          award={topPerformerAward}
          departmentTitle="Residential Development"
        />
      )}
    </div>
  );
};
