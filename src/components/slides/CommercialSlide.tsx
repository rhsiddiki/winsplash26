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
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface CommercialSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

type CommercialViewMode = 'charts' | 'table' | 'clients' | 'pillars';

export const CommercialSlide: React.FC<CommercialSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'retained'>('overview');
  const [isAwardOpen, setIsAwardOpen] = useState<boolean>(false);

  // Interactive Sub-View State for HOD Presentation
  const [viewMode, setViewMode] = useState<CommercialViewMode>('charts');
  const [selectedChartMetric, setSelectedChartMetric] = useState<string>('work_orders');
  const [tableSearchTerm, setTableSearchTerm] = useState<string>('');
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [activeYearHighlight, setActiveYearHighlight] = useState<string | null>(null);

  const presenter = slide.presenters[0];
  const topPerformerAward = slide.awards?.find((a) => a.type === 'top_performer');
  const retainedAward = slide.awards?.find((a) => a.type === 'retained_employees');

  const dataset: DepartmentPresenterDataset | undefined =
    slide.presenterDatasets?.shahidul;

  // Dynamic Chart Data for HOD Commercial 3-Year Trajectory
  const chartConfigurations: Record<
    string,
    {
      title: string;
      subtitle: string;
      unit: string;
      values: number[];
      labels: string[];
      color: string;
      icon: any;
      description: string;
    }
  > = useMemo(
    () => ({
      work_orders: {
        title: 'Commercial Work Orders Completed (2024 – 2026)',
        subtitle: '3,280 Cumulative Work Orders Closed & Accepted',
        unit: 'Orders',
        labels: ['2024', '2025', '2026'],
        values: [147, 2016, 1117],
        color: '#3b82f6',
        icon: Database,
        description: 'Explosive 13.7x scaling from 147 orders in launch year 2024 up to 2,016 orders in 2025 (+1,271% surge).',
      },
      active_clients: {
        title: 'Active Enterprise Clients (2024 – 2026)',
        subtitle: '4x Portfolio Growth (Scaled from 7 to 28 Enterprise Accounts)',
        unit: 'Clients',
        labels: ['2024', '2025', '2026'],
        values: [7, 17, 28],
        color: '#6366f1',
        icon: Users,
        description: 'Rapid client acquisition expanding from 7 inaugural partners to 28 active corporate accounts in 2026.',
      },
      states_covered: {
        title: 'US States Footprint (2024 – 2026)',
        subtitle: 'Tripled Territorial Coverage across 18 US States',
        unit: 'States',
        labels: ['2024', '2025', '2026'],
        values: [6, 9, 18],
        color: '#06b6d4',
        icon: Globe,
        description: 'Geographic expansion tripling coverage from 6 states at launch to 18 US states in 2026.',
      },
      contractors_vendors: {
        title: 'Contractors & Vendor Network Coordinated (2024 – 2026)',
        subtitle: '18x Partner Ecosystem Scaling (14 to 254 Contractors)',
        unit: 'Vendors',
        labels: ['2024', '2025', '2026'],
        values: [14, 254, 189],
        color: '#8b5cf6',
        icon: Building2,
        description: 'Built a reliable contractor network peaking at 254 field vendors to execute commercial facility jobs.',
      },
      cities_covered: {
        title: 'US Cities Covered Nationwide (2024 – 2026)',
        subtitle: 'Reached 694 US Cities Nationwide in Commercial Operations',
        unit: 'Cities',
        labels: ['2024', '2025', '2026'],
        values: [54, 694, 377],
        color: '#10b981',
        icon: MapPin,
        description: 'Footprint expanding from 54 cities at 2024 launch to a peak of 694 US metropolitan and regional cities.',
      },
      tat: {
        title: 'Average Work Order Turnaround Time (TAT in Hours)',
        subtitle: 'Rapid SLA Response: Maintained Sub-8.1 Hour Mean Turnaround',
        unit: 'Hours',
        labels: ['2024', '2025', '2026'],
        values: [8.25, 7.56, 8.06],
        color: '#f59e0b',
        icon: Zap,
        description: 'Consistently ultra-fast completion averaging 7.56h to 8.25h for commercial maintenance work orders.',
      },
      properties_units: {
        title: 'Commercial Properties / Units Serviced (2024 – 2026)',
        subtitle: '1,755 Distinct Commercial Properties & Facilities Maintained',
        unit: 'Units',
        labels: ['2024', '2025', '2026'],
        values: [85, 1089, 581],
        color: '#ec4899',
        icon: Briefcase,
        description: 'Scaled servicing from 85 properties in 2024 to 1,089 units in 2025 and 581 units in 2026.',
      },
    }),
    []
  );

  const currentChartConfig =
    chartConfigurations[selectedChartMetric] || chartConfigurations.work_orders;

  // Filtered rows for Commercial historical table
  const filteredHistoricalRows = useMemo(() => {
    if (!dataset?.historicalTable) return [];
    if (!tableSearchTerm.trim()) return dataset.historicalTable.rows;
    return dataset.historicalTable.rows.filter(
      (r) =>
        r.metric.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        r.definition.toLowerCase().includes(tableSearchTerm.toLowerCase())
    );
  }, [dataset, tableSearchTerm]);

  // Filtered clients for Commercial timeline
  const filteredClientTimeline = useMemo(() => {
    if (!dataset?.clientTimeline) return [];
    if (!clientSearchTerm.trim()) return dataset.clientTimeline;
    return dataset.clientTimeline
      .map((group) => ({
        ...group,
        clients: group.clients.filter((c) =>
          c.toLowerCase().includes(clientSearchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.clients.length > 0);
  }, [dataset, clientSearchTerm]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Session Title Banner */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Briefcase className="w-3.5 h-3.5 text-blue-400" />
          SESSION 05 • COMMERCIAL DEPARTMENT EXCELLENCE
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-cyan-200">
          Commercial Department
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
          High-Octane 3-Year Acceleration (2024–2026) Presented by HOD Md. Shahidul Islam — 3,280 Orders, 28 Enterprise Clients & 18 US States.
        </p>
      </div>

      {/* Main Controls & Global Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2.5 rounded-3xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 pl-2 pr-1 hidden sm:inline">
            HOD Presentation:
          </span>
          <div className="px-3.5 py-1.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Md. Shahidul Islam • 3-Year Growth Matrix</span>
          </div>
        </div>

        {/* Global Slide Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveView(activeView === 'overview' ? 'retained' : 'overview');
              soundFx.playClick();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeView === 'retained'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            {activeView === 'retained' ? 'Back to Commercial Stats' : 'Commercial Retained Pillars (5)'}
          </button>

          <button
            onClick={() => {
              setIsAwardOpen(true);
              soundFx.playClick();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Top Dealmaker Award</span>
            <span className="sm:hidden">Award</span>
          </button>
        </div>
      </div>

      {activeView === 'retained' && retainedAward?.retainedList ? (
        /* Retained Employees Wall */
        <RetainedEmployeesWall
          employees={retainedAward.retainedList}
          departmentTitle="Commercial"
        />
      ) : (
        /* 2-Column Split: Presenter Podium & Dynamic Dataset View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: HOD Presenter Stage Pod with Real-time Picture/Avatar */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <SpeakerStagePod
              presenter={presenter}
              globalOutfit={globalOutfit}
              onPresenterOutfitChange={onPresenterOutfitChange}
              defaultMode="photo"
            />

            {/* Quick Summary Card Under Podium for HOD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mt-4 p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-sm text-left text-xs text-slate-300 space-y-2"
            >
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Star className="w-4 h-4 fill-blue-400" />
                <span>3-Year Commercial Inception & Scaling</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Launched in 2024 with 4 pioneer clients (DMG Pro, Liberty Home Guard, Power House, Service Plus) and 4 members, the Commercial vertical has expanded into 28 active enterprise clients operating across 18 US states and 694 cities.
              </p>
              <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Total Work Orders</span>
                  <span className="text-blue-300 font-bold text-sm">3,280</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl">
                  <span className="text-slate-400 block text-[10px]">Active Clients (2026)</span>
                  <span className="text-cyan-300 font-bold text-sm">28 Accounts</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Dynamic Dataset for Commercial Department */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Dataset Header Banner */}
            {dataset && (
              <div className="p-5 rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-cyan-950/30 to-[#030d22] shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {dataset.badge}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        3-Year Operational Scale (2024–2026)
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {dataset.title}
                    </h3>
                    <p className="text-xs mt-1 font-medium text-blue-200/80">
                      {dataset.tagline}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40">
                      <Sparkles className="w-3.5 h-3.5" />
                      Live Presentation
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4 Metric Summary Cards */}
            {dataset && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {dataset.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.07] transition-all shadow-lg flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-xs font-medium text-slate-400 line-clamp-1">
                        {metric.label}
                      </span>
                      {metric.icon === 'Database' && <Database className="w-4 h-4 text-blue-400" />}
                      {metric.icon === 'Users' && <Users className="w-4 h-4 text-cyan-400" />}
                      {metric.icon === 'Globe' && <Globe className="w-4 h-4 text-teal-400" />}
                      {metric.icon === 'Zap' && <Zap className="w-4 h-4 text-amber-400" />}
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-white my-1">
                      {metric.value}
                    </div>
                    <span className="text-[11px] font-semibold text-blue-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      {metric.change}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* HOD Interactive Exploration Mode Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    setViewMode('charts');
                    soundFx.playClick();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'charts'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  3-Year Visual Trends
                </button>

                <button
                  onClick={() => {
                    setViewMode('table');
                    soundFx.playClick();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  Full 2024–2026 Data Matrix
                </button>

                <button
                  onClick={() => {
                    setViewMode('clients');
                    soundFx.playClick();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'clients'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Client Onboarding (28 Accounts)
                </button>

                <button
                  onClick={() => {
                    setViewMode('pillars');
                    soundFx.playClick();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'pillars'
                      ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Strategic Pillars
                </button>
              </div>

              <span className="text-[10px] font-mono text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 hidden md:inline">
                Verified Commercial Dataset
              </span>
            </div>

            {/* SUB-VIEW 1: Interactive Charts & Trend Explorer */}
            {viewMode === 'charts' && (
              <div className="space-y-4">
                {/* Metric Selector Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 mr-1">Select Metric:</span>
                  {[
                    { id: 'work_orders', label: 'Work Orders', icon: Database },
                    { id: 'active_clients', label: 'Active Clients (28)', icon: Users },
                    { id: 'states_covered', label: 'US States (18)', icon: Globe },
                    { id: 'contractors_vendors', label: 'Vendors (254)', icon: Building2 },
                    { id: 'cities_covered', label: 'US Cities (694)', icon: MapPin },
                    { id: 'tat', label: 'Turnaround Time (TAT)', icon: Zap },
                    { id: 'properties_units', label: 'Properties / Units', icon: Briefcase },
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedChartMetric(tab.id);
                          soundFx.playClick();
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          selectedChartMetric === tab.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm'
                            : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Visual Chart Card */}
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <currentChartConfig.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">
                          {currentChartConfig.title}
                        </h4>
                        <p className="text-xs text-blue-300">
                          {currentChartConfig.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 self-start sm:self-auto">
                      Unit: {currentChartConfig.unit}
                    </span>
                  </div>

                  {/* Bar Chart Visualization */}
                  <div className="space-y-3 pt-1">
                    {currentChartConfig.labels.map((year, idx) => {
                      const val = currentChartConfig.values[idx];
                      const maxVal = Math.max(...currentChartConfig.values);
                      const percentage = Math.max(8, Math.round((val / maxVal) * 100));
                      const isHighlighted = activeYearHighlight === year;

                      return (
                        <div
                          key={year}
                          onMouseEnter={() => setActiveYearHighlight(year)}
                          onMouseLeave={() => setActiveYearHighlight(null)}
                          className={`p-2.5 rounded-xl transition-all ${
                            isHighlighted ? 'bg-blue-500/10 border border-blue-500/30' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-center text-xs mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-white text-sm w-14 font-mono">{year}</span>
                              {year === '2024' && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                                  Vertical Inception
                                </span>
                              )}
                              {year === '2025' && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                                  +1,271% Surge (2,016 Orders)
                                </span>
                              )}
                              {year === '2026' && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                  28 Active Clients • 18 States
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-bold text-white text-sm">
                              {typeof val === 'number' ? val.toLocaleString() : val} {currentChartConfig.unit}
                            </span>
                          </div>
                          <div className="w-full h-4 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-white/5">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: idx * 0.08 }}
                              className={`h-full rounded-full ${
                                selectedChartMetric === 'tat'
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                  : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-xs text-slate-300 pt-2 border-t border-white/10 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{currentChartConfig.description}</span>
                  </div>
                </div>

                {/* Breakdown Stats Cards */}
                {dataset?.breakdownStats && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {dataset.breakdownStats.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-medium">{item.category}</span>
                          <span className="font-mono font-bold text-blue-400">{item.percentage}%</span>
                        </div>
                        <div className="text-lg font-black text-white my-1">{item.amount}</div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: item.color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW 2: Full 3-Year Matrix Data Table */}
            {viewMode === 'table' && dataset?.historicalTable && (
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Table className="w-4 h-4 text-blue-400" />
                      Official Commercial Department Historical Metrics (2024–2026)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Locked performance indicators, order completion volumes, turnaround speed, and nationwide footprint across 3 operating years.
                    </p>
                  </div>

                  {/* Quick Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={tableSearchTerm}
                      onChange={(e) => setTableSearchTerm(e.target.value)}
                      placeholder="Search metrics..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Interactive Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-white/[0.02]">
                        <th className="py-2.5 px-3 min-w-[240px]">Metric / Definition</th>
                        <th className="py-2.5 px-2 text-right">Unit</th>
                        {dataset.historicalTable.years.map((yr) => (
                          <th
                            key={yr}
                            className={`py-2.5 px-3 text-right font-bold transition-all ${
                              yr === '2026'
                                ? 'text-amber-400 bg-amber-500/10'
                                : yr === '2024'
                                ? 'text-cyan-300'
                                : 'text-blue-200'
                            }`}
                          >
                            {yr}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredHistoricalRows.map((row, idx) => {
                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-white/[0.04] transition-colors ${
                              row.highlight ? 'bg-blue-950/10' : ''
                            }`}
                          >
                            <td className="py-3 px-3">
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {row.metric}
                                {row.highlight && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 line-clamp-1">
                                {row.definition}
                              </div>
                            </td>
                            <td className="py-3 px-2 text-right font-mono text-slate-400 text-[11px]">
                              {row.unit}
                            </td>
                            {dataset.historicalTable!.years.map((yr) => {
                              const rawVal = row.values[yr];
                              const formatted =
                                typeof rawVal === 'number'
                                  ? rawVal.toLocaleString()
                                  : rawVal ?? '-';

                              return (
                                <td
                                  key={yr}
                                  className={`py-3 px-3 text-right font-mono font-semibold ${
                                    yr === '2026'
                                      ? 'text-amber-300 font-bold bg-amber-500/5'
                                      : yr === '2025'
                                      ? 'text-blue-100 font-bold'
                                      : 'text-slate-200'
                                  }`}
                                >
                                  {formatted}
                                  {row.format === 'percentage' && typeof rawVal === 'number' ? '%' : ''}
                                  {row.format === 'hours' && typeof rawVal === 'number' ? 'h' : ''}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: Client Onboarding Journey */}
            {viewMode === 'clients' && dataset?.clientTimeline && (
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-400" />
                      Commercial Enterprise Client Portfolio (2024–2026)
                    </h4>
                    <p className="text-xs text-slate-400">
                      Chronological onboarding of 28 enterprise warranty, facility maintenance, and commercial asset management accounts.
                    </p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={clientSearchTerm}
                      onChange={(e) => setClientSearchTerm(e.target.value)}
                      placeholder="Search client name..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                {/* Chronological Timeline Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {filteredClientTimeline.map((group) => (
                    <div
                      key={group.year}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/30 transition-all space-y-2.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black text-blue-400 font-mono">
                              {group.year}
                            </span>
                            {group.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 font-bold border border-blue-500/20 line-clamp-1">
                                {group.badge}
                              </span>
                            )}
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {group.clients.map((client, cIdx) => (
                            <li
                              key={cIdx}
                              className="text-xs text-slate-200 flex items-start gap-2 bg-white/5 p-2 rounded-xl"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                              <span className="font-medium">{client}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                        <span>Total Active Accounts:</span>
                        <span className="text-blue-300 font-bold">
                          {group.year === '2024' ? '7 Clients' : group.year === '2025' ? '17 Clients' : '28 Clients'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: Strategic Pillars & Executive Outlook */}
            {viewMode === 'pillars' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {dataset?.keyHighlights.map((hl, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                            {hl.badge}
                          </span>
                          {hl.stat && (
                            <span className="text-xs font-mono font-bold text-amber-300">
                              {hl.stat}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{hl.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-1">
                          {hl.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-blue-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verified Commercial Metric</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* HOD Executive Statement Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900/20 via-indigo-950/30 to-[#030b20] border border-blue-500/30 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Executive Statement from HOD Md. Shahidul Islam
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">
                        Commercial Leadership & 2026 Strategic Vision
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-200 italic leading-relaxed bg-white/5 p-3.5 rounded-2xl border border-white/5">
                    "From establishing our foundation in 2024 to delivering over 3,280 work orders and serving 28 enterprise clients across 18 US states, the Commercial vertical proves that speed, strict compliance, and dependable partner coordination drive sustainable market leadership."
                  </p>
                </div>
              </div>
            )}

            {/* Award Ceremony Teaser */}
            {topPerformerAward && (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-[#0a1026]/80 to-[#050A18] border border-amber-500/30 backdrop-blur-md shadow-xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    {topPerformerAward.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Recognizing our stellar dealmaker and frontline contributors.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAwardOpen(true);
                    soundFx.playClick();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  View & Reveal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Performer Award Ceremony Modal */}
      {topPerformerAward && (
        <AwardCeremonyModal
          isOpen={isAwardOpen}
          onClose={() => setIsAwardOpen(false)}
          awardTitle={topPerformerAward.title}
          nominees={topPerformerAward.nominees}
          departmentName="Commercial"
        />
      )}
    </div>
  );
};
