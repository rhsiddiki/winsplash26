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
  FileSpreadsheet,
  CheckCircle2,
  Megaphone,
  ShieldCheck,
  Zap,
  Cpu,
  TrendingUp,
  Sparkles,
  BarChart3,
  Layers,
  Star,
  CheckCircle,
  Activity,
  ArrowUpRight,
  Globe,
  Table,
  Building2,
  Calendar,
  Search,
  ChevronRight,
  TrendingDown,
  Info,
  Clock,
  Compass,
  DollarSign,
  FileCheck,
  Receipt,
} from 'lucide-react';
import { soundFx } from '../../utils/soundEffects';

interface PreservationSlideProps {
  slide: SlideData;
  globalOutfit: OutfitTheme;
  onPresenterOutfitChange?: (presenterId: string, outfit: OutfitTheme) => void;
}

type HODViewMode = 'charts' | 'table' | 'clients' | 'pillars';
type BDOViewMode = 'charts' | 'table' | 'anchor' | 'pillars';

export const PreservationSlide: React.FC<PreservationSlideProps> = ({
  slide,
  globalOutfit,
  onPresenterOutfitChange,
}) => {
  const [activePresenterTab, setActivePresenterTab] = useState<'foysal' | 'nafis'>('foysal');
  const [activeAwardModal, setActiveAwardModal] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'overview' | 'retained'>('overview');

  // HOD interactive sub-tab state
  const [hodViewMode, setHodViewMode] = useState<HODViewMode>('charts');
  const [selectedChartMetric, setSelectedChartMetric] = useState<string>('work_orders');
  const [tableSearchTerm, setTableSearchTerm] = useState<string>('');
  const [clientSearchTerm, setClientSearchTerm] = useState<string>('');
  const [activeYearHighlight, setActiveYearHighlight] = useState<string | null>(null);

  // BDO (Nafis) interactive sub-tab state
  const [bdoViewMode, setBdoViewMode] = useState<BDOViewMode>('charts');
  const [selectedBdoChartMetric, setSelectedBdoChartMetric] = useState<string>('invoice_value');
  const [bdoTableSearchTerm, setBdoTableSearchTerm] = useState<string>('');
  const [bdoActiveYearHighlight, setBdoActiveYearHighlight] = useState<string | null>(null);

  const foysal = slide.presenters.find((p) => p.id === 'foysal') || slide.presenters[0];
  const nafis = slide.presenters.find((p) => p.id === 'nafis') || slide.presenters[1];

  const topPerformerAward = slide.awards?.find((a) => a.type === 'top_performer');
  const retainedEmployeesAward = slide.awards?.find((a) => a.type === 'retained_employees');

  // Datasets for HOD and Asst. Manager
  const activeDataset: DepartmentPresenterDataset | undefined =
    slide.presenterDatasets?.[activePresenterTab];

  // Dynamic Chart Data for HOD 8-Year Trajectory
  const hodChartConfigurations: Record<
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
        title: 'Work Orders Completed (2019 – 2026)',
        subtitle: '116,806 Cumulative Work Orders Delivered & Accepted',
        unit: 'Orders',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [1952, 24032, 6400, 14281, 19773, 20253, 19901, 10214],
        color: '#10b981',
        icon: Database,
        description: 'Exponential scaling from 1,952 orders in 2019 up to consistent ~20K annual run-rate.',
      },
      properties: {
        title: 'Properties / Units Serviced (2019 – 2026)',
        subtitle: 'Over 2.17 Million Distinct Units Protected & Maintained',
        unit: 'Units',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [390, 314218, 179328, 137883, 455062, 355549, 370281, 363426],
        color: '#059669',
        icon: Building2,
        description: 'Multi-family & single-family portfolio servicing peaking at 455,000+ units in a single year.',
      },
      tat: {
        title: 'Average Turnaround Time (TAT in Hours)',
        subtitle: 'Massive 65% Efficiency Compression (103h down to 36h)',
        unit: 'Hours',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [103, 93, 84, 72, 50, 60, 48, 36],
        color: '#f59e0b',
        icon: Zap,
        description: 'Drastic turnaround compression from 103 hours at launch down to 36 hours record dispatch.',
      },
      cities: {
        title: 'Nationwide Geographic Reach (US Cities Covered)',
        subtitle: 'Expanded across 764 US Cities in 17 States',
        unit: 'Cities',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [267, 301, 348, 407, 674, 483, 615, 764],
        color: '#06b6d4',
        icon: Globe,
        description: 'Continuous nationwide territorial expansion covering major metropolitan and regional areas.',
      },
      vendors_team: {
        title: 'Vendor Partner Ecosystem (Contractors Coordinated)',
        subtitle: '7.2x Vendor Growth (16 to 115) & Headcount expanded to 51',
        unit: 'Vendors',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [16, 27, 34, 53, 97, 77, 95, 115],
        color: '#6366f1',
        icon: Users,
        description: 'Coordinated vendor partner network scaled from 16 to 115 trusted field contractors.',
      },
      escalations: {
        title: 'SLA Breaches & Formal Client Escalations',
        subtitle: 'Continuous Quality Hardening (Reduced from 19 to 8)',
        unit: 'Escalations',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [19, 17, 16, 14, 9, 14, 11, 8],
        color: '#ec4899',
        icon: ShieldCheck,
        description: 'Strict quality control dropped escalations to an all-time low of 8 formal tickets.',
      },
    }),
    []
  );

  // Dynamic Chart Data for BDO (Nafis) 8-Year Trajectory
  const bdoChartConfigurations: Record<
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
      prefix?: string;
    }
  > = useMemo(
    () => ({
      invoice_value: {
        title: 'Total Invoice Value Processed (2019 – 2026)',
        subtitle: '$11,644,170 Cumulative Gross Revenue Invoiced via PPW',
        unit: 'USD ($)',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [765428, 1571092, 896640, 689416, 2275310, 1777746, 1851406, 1817132],
        color: '#6366f1',
        icon: DollarSign,
        description: 'All-time peak gross invoicing of $2.28M in 2023, sustaining ~$1.8M annual run-rate.',
        prefix: '$',
      },
      bids_approved: {
        title: 'Bids Approved & Win Rate Surge (2019 – 2026)',
        subtitle: 'Unprecedented 8,732 Approvals in 2026 (90.0% Win Rate)',
        unit: 'Approved Bids',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [599, 5875, 1934, 3374, 4662, 4891, 4995, 8732],
        color: '#8b5cf6',
        icon: TrendingUp,
        description: 'Record-shattering 8,732 bid approvals in 2026 out of 9,703 bids submitted (90.0% conversion rate).',
      },
      bid_tat: {
        title: 'Average Bid-to-Approval Turnaround Time (TAT in Hours)',
        subtitle: 'Massive 75% Speed Compression (160 Hours down to 40 Hours)',
        unit: 'Hours',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [160, 140, 130, 120, 80, 60, 50, 40],
        color: '#f59e0b',
        icon: Zap,
        description: 'Rapid client decision cycles dropping from 160h down to 40h through automated price matrix synchronization.',
      },
      invoices_count: {
        title: 'Invoices Generated & Work Orders Analysed (2019 – 2026)',
        subtitle: '116,806 Invoices Raised & Validated in PPW',
        unit: 'Invoices',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [1952, 24032, 6400, 14281, 19773, 20253, 19901, 10214],
        color: '#3b82f6',
        icon: Receipt,
        description: 'Seamless document processing with over 116,800 invoices raised to enterprise clients.',
      },
      bids_submitted: {
        title: 'Bids Submitted against Price Sheets (2019 – 2026)',
        subtitle: '124,292 Cumulative Repair & Preservation Estimates Priced',
        unit: 'Bids',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [1560, 22830, 21688, 13566, 17795, 19240, 17910, 9703],
        color: '#06b6d4',
        icon: Cpu,
        description: 'Comprehensive price sheet analysis generating 124K+ compliant bids across multiple US regional price sheets.',
      },
      price_sheets: {
        title: 'Active Client Price Sheets Maintained in PPW (2019 – 2026)',
        subtitle: '16 Complex Pricing Matrices Across Multiple Enterprise Accounts',
        unit: 'Price Sheets',
        labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
        values: [1, 3, 10, 10, 15, 16, 16, 13],
        color: '#ec4899',
        icon: Layers,
        description: 'Rigorous maintenance of custom unit-rate catalogs per state, metro area, and client spec in PPW.',
      },
    }),
    []
  );

  // Icon resolver
  const renderMetricIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'CheckCircle':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Star':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-4 h-4 text-indigo-400" />;
      case 'Zap':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-indigo-400" />;
      case 'Globe':
        return <Globe className="w-4 h-4 text-teal-400" />;
      case 'DollarSign':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  // Filtered rows for HOD historical table
  const filteredHistoricalRows = useMemo(() => {
    if (!activeDataset?.historicalTable) return [];
    const term = activePresenterTab === 'foysal' ? tableSearchTerm : bdoTableSearchTerm;
    if (!term.trim()) return activeDataset.historicalTable.rows;
    return activeDataset.historicalTable.rows.filter(
      (r) =>
        r.metric.toLowerCase().includes(term.toLowerCase()) ||
        r.definition.toLowerCase().includes(term.toLowerCase())
    );
  }, [activeDataset, activePresenterTab, tableSearchTerm, bdoTableSearchTerm]);

  // Filtered clients for HOD timeline
  const filteredClientTimeline = useMemo(() => {
    if (!activeDataset?.clientTimeline) return [];
    if (!clientSearchTerm.trim()) return activeDataset.clientTimeline;
    return activeDataset.clientTimeline
      .map((group) => ({
        ...group,
        clients: group.clients.filter((c) =>
          c.toLowerCase().includes(clientSearchTerm.toLowerCase())
        ),
      }))
      .filter((group) => group.clients.length > 0);
  }, [activeDataset, clientSearchTerm]);

  const currentChartConfig =
    hodChartConfigurations[selectedChartMetric] || hodChartConfigurations.work_orders;
  const currentBdoChartConfig =
    bdoChartConfigurations[selectedBdoChartMetric] || bdoChartConfigurations.invoice_value;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Top Session Title Banner */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-[0.2em] mb-2">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          SESSION 04 • PRESERVATION & BDO EXCELLENCE
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-teal-200">
          Preservation & BDO Department
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto">
          Comprehensive 8-Year Performance (2019–2026) by HOD Foysal Ahmed Shojib & BDO Operational Matrix by Asst. Manager Nafis-Uz-Zaman.
        </p>
      </div>

      {/* Main Dataset Switcher & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-2.5 rounded-3xl border border-white/10 backdrop-blur-md">
        {/* Presenter & Dataset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 pl-2 pr-1 hidden sm:inline">
            Select Dataset:
          </span>

          {/* HOD Button */}
          <button
            onClick={() => {
              setActivePresenterTab('foysal');
              soundFx.playClick();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activePresenterTab === 'foysal'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] border border-emerald-400/40'
                : 'text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${activePresenterTab === 'foysal' ? 'text-emerald-200' : 'text-emerald-400'}`} />
            <div className="text-left">
              <div className="leading-tight">HOD Presentation (8-Year Matrix)</div>
              <div className={`text-[10px] font-medium ${activePresenterTab === 'foysal' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Foysal Ahmed Shojib • Operations & Reach
              </div>
            </div>
          </button>

          {/* Asst. Manager Button */}
          <button
            onClick={() => {
              setActivePresenterTab('nafis');
              soundFx.playClick();
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activePresenterTab === 'nafis'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/40'
                : 'text-slate-300 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className={`w-4 h-4 ${activePresenterTab === 'nafis' ? 'text-indigo-200' : 'text-indigo-400'}`} />
            <div className="text-left">
              <div className="leading-tight">Asst. Manager Presentation (BDO)</div>
              <div className={`text-[10px] font-medium ${activePresenterTab === 'nafis' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Nafis-Uz-Zaman • $11.64M Invoicing & Bids
              </div>
            </div>
          </button>
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
            {activeView === 'retained' ? 'Back to Datasets' : 'Retained Champions (8)'}
          </button>

          <button
            onClick={() => {
              setActiveAwardModal(true);
              soundFx.playClick();
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-slate-950" />
            <span className="hidden sm:inline">Top Performer Award</span>
            <span className="sm:hidden">Award</span>
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
        /* 2-Column Split: Presenter Podium & Dynamic Dataset View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Active Presenter Stage Pod with Real-time Picture/Avatar */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <SpeakerStagePod
              key={activePresenterTab}
              presenter={activePresenterTab === 'foysal' ? foysal : nafis}
              globalOutfit={globalOutfit}
              onPresenterOutfitChange={onPresenterOutfitChange}
              defaultMode="photo"
            />

            {/* Quick Summary Card Under Podium for HOD */}
            {activePresenterTab === 'foysal' ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 backdrop-blur-sm text-left text-xs text-slate-300 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>8-Year Operations Legacy (2019–2026)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Founded in 2019 with a single anchor client (MCS) and 16 members, the Preservation Department has grown into a 51-person nationwide operations powerhouse serving 30+ enterprise accounts across 764 US cities.
                </p>
                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Total Work Orders</span>
                    <span className="text-emerald-300 font-bold text-sm">116,806</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Units Protected</span>
                    <span className="text-teal-300 font-bold text-sm">2.17M+</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Quick Summary Card Under Podium for Asst. Manager Nafis (BDO) */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full mt-4 p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 backdrop-blur-sm text-left text-xs text-slate-300 space-y-2"
              >
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Receipt className="w-4 h-4 text-indigo-400" />
                  <span>BDO 8-Year Billing & Invoicing (2019–2026)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Led by Asst. Manager Nafis-Uz-Zaman, Business Data Operations (BDO) manages the complete lifecycle of repair bids, price sheet cataloging, invoice issuance, and compliance QA across 16 enterprise clients in PPW.
                </p>
                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Gross Invoiced</span>
                    <span className="text-indigo-300 font-bold text-sm">$11.64M USD</span>
                  </div>
                  <div className="bg-white/5 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">2026 Win Rate</span>
                    <span className="text-amber-300 font-bold text-sm">90.0% (8.7K)</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT: Dynamic Dataset (HOD vs Asst. Manager) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePresenterTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Active Dataset Header Banner */}
                {activeDataset && (
                  <div
                    className={`p-5 rounded-3xl border shadow-xl relative overflow-hidden backdrop-blur-md ${
                      activeDataset.themeColor === 'emerald'
                        ? 'bg-gradient-to-br from-emerald-950/40 via-teal-950/30 to-[#031512] border-emerald-500/30'
                        : 'bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-[#060c22] border-indigo-500/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                              activeDataset.themeColor === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            {activeDataset.badge}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {activePresenterTab === 'foysal' ? 'Speaker 1 of 2 • 8-Yr Operations Matrix' : 'Speaker 2 of 2 • 8-Yr Financial & BDO Matrix'}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                          {activeDataset.title}
                        </h3>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            activeDataset.themeColor === 'emerald' ? 'text-emerald-200/80' : 'text-indigo-200/80'
                          }`}
                        >
                          {activeDataset.tagline}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
                            activeDataset.themeColor === 'emerald'
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                              : 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Live Presentation
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4 Metric Summary Cards */}
                {activeDataset && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {activeDataset.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl bg-white/5 border hover:bg-white/[0.07] transition-all shadow-lg flex flex-col justify-between ${
                          activeDataset.themeColor === 'emerald'
                            ? 'border-white/10 hover:border-emerald-500/40'
                            : 'border-white/10 hover:border-indigo-500/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-xs font-medium text-slate-400 line-clamp-1">
                            {metric.label}
                          </span>
                          {renderMetricIcon(metric.icon)}
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-white my-1">
                          {metric.value}
                        </div>
                        <span
                          className={`text-[11px] font-semibold flex items-center gap-1 ${
                            activeDataset.themeColor === 'emerald' ? 'text-emerald-300' : 'text-indigo-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          {metric.change}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* ========================================================================= */}
                {/* HOD PRESENTATION DEDICATED MULTI-VIEW EXPERIENCE */}
                {/* ========================================================================= */}
                {activePresenterTab === 'foysal' ? (
                  <div className="space-y-5">
                    {/* HOD Interactive Exploration Mode Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            setHodViewMode('charts');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            hodViewMode === 'charts'
                              ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          8-Year Visual Trends
                        </button>

                        <button
                          onClick={() => {
                            setHodViewMode('table');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            hodViewMode === 'table'
                              ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Table className="w-3.5 h-3.5" />
                          Full 2019–2026 Data Matrix
                        </button>

                        <button
                          onClick={() => {
                            setHodViewMode('clients');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            hodViewMode === 'clients'
                              ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          Client Onboarding Journey (30+)
                        </button>

                        <button
                          onClick={() => {
                            setHodViewMode('pillars');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            hodViewMode === 'pillars'
                              ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Strategic Pillars
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 hidden md:inline">
                        Verified HOD Dataset
                      </span>
                    </div>

                    {/* SUB-VIEW 1: Interactive Charts & Trend Explorer */}
                    {hodViewMode === 'charts' && (
                      <div className="space-y-4">
                        {/* Metric Selector Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 mr-1">Select Metric:</span>
                          {[
                            { id: 'work_orders', label: 'Work Orders', icon: Database },
                            { id: 'properties', label: 'Properties / Units', icon: Building2 },
                            { id: 'tat', label: 'Turnaround Time (TAT)', icon: Zap },
                            { id: 'cities', label: 'US Cities', icon: Globe },
                            { id: 'vendors_team', label: 'Vendors & Headcount', icon: Users },
                            { id: 'escalations', label: 'Escalations Drop', icon: ShieldCheck },
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
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
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
                              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <currentChartConfig.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {currentChartConfig.title}
                                </h4>
                                <p className="text-xs text-emerald-300">
                                  {currentChartConfig.subtitle}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 self-start sm:self-auto">
                              Unit: {currentChartConfig.unit}
                            </span>
                          </div>

                          {/* Bar Chart Visualization */}
                          <div className="space-y-2.5 pt-1">
                            {currentChartConfig.labels.map((year, idx) => {
                              const val = currentChartConfig.values[idx];
                              const maxVal = Math.max(...currentChartConfig.values);
                              const percentage = Math.max(6, Math.round((val / maxVal) * 100));
                              const isHighlighted = activeYearHighlight === year;

                              return (
                                <div
                                  key={year}
                                  onMouseEnter={() => setActiveYearHighlight(year)}
                                  onMouseLeave={() => setActiveYearHighlight(null)}
                                  className={`p-2 rounded-xl transition-all ${
                                    isHighlighted ? 'bg-emerald-500/10 border border-emerald-500/30' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white w-12">{year}</span>
                                      {year === '2019' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold">
                                          Inception
                                        </span>
                                      )}
                                      {year === '2026' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                          Current YTD / Record
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono font-bold text-white">
                                      {val.toLocaleString()} {currentChartConfig.unit}
                                    </span>
                                  </div>
                                  <div className="w-full h-3.5 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                                      className={`h-full rounded-full ${
                                        selectedChartMetric === 'tat'
                                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                          : selectedChartMetric === 'escalations'
                                          ? 'bg-gradient-to-r from-pink-500 to-rose-400'
                                          : 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-xs text-slate-300 pt-2 border-t border-white/10 flex items-center gap-2">
                            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{currentChartConfig.description}</span>
                          </div>
                        </div>

                        {/* Breakdown Cards */}
                        {activeDataset?.breakdownStats && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {activeDataset.breakdownStats.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 font-medium">{item.category}</span>
                                  <span className="font-mono font-bold text-emerald-400">{item.percentage}%</span>
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

                    {/* SUB-VIEW 2: Full 8-Year Matrix Data Table */}
                    {hodViewMode === 'table' && activeDataset?.historicalTable && (
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <Table className="w-4 h-4 text-emerald-400" />
                              Official Preservation Historical Metrics (2019–2026)
                            </h4>
                            <p className="text-xs text-slate-400">
                              Locked performance indicators and operational volume tracking across 8 consecutive operating years.
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
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Interactive Data Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-white/[0.02]">
                                <th className="py-2.5 px-3 min-w-[220px]">Metric / Definition</th>
                                <th className="py-2.5 px-2 text-right">Unit</th>
                                {activeDataset.historicalTable.years.map((yr) => (
                                  <th
                                    key={yr}
                                    className={`py-2.5 px-2.5 text-right font-bold transition-all ${
                                      yr === '2026'
                                        ? 'text-amber-400 bg-amber-500/10'
                                        : yr === '2019'
                                        ? 'text-blue-300'
                                        : 'text-slate-200'
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
                                      row.highlight ? 'bg-emerald-950/10' : ''
                                    }`}
                                  >
                                    <td className="py-3 px-3">
                                      <div className="font-bold text-white flex items-center gap-1.5">
                                        {row.metric}
                                        {row.highlight && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-400 line-clamp-1">
                                        {row.definition}
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-slate-400 text-[11px]">
                                      {row.unit}
                                    </td>
                                    {activeDataset.historicalTable!.years.map((yr) => {
                                      const rawVal = row.values[yr];
                                      const formatted =
                                        typeof rawVal === 'number'
                                          ? rawVal.toLocaleString()
                                          : rawVal ?? '-';

                                      return (
                                        <td
                                          key={yr}
                                          className={`py-3 px-2.5 text-right font-mono font-semibold ${
                                            yr === '2026'
                                              ? 'text-amber-300 font-bold bg-amber-500/5'
                                              : 'text-slate-100'
                                          }`}
                                        >
                                          {formatted}
                                          {row.format === 'percentage' && typeof rawVal === 'number'
                                            ? '%'
                                            : ''}
                                          {row.format === 'hours' && typeof rawVal === 'number'
                                            ? 'h'
                                            : ''}
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

                    {/* SUB-VIEW 3: Marquee Client Onboarding Timeline */}
                    {hodViewMode === 'clients' && activeDataset?.clientTimeline && (
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-emerald-400" />
                              Marquee Enterprise Client Portfolio (2019–2026)
                            </h4>
                            <p className="text-xs text-slate-400">
                              Chronological onboarding of 30+ top-tier asset management, mortgage & preservation partners.
                            </p>
                          </div>

                          <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={clientSearchTerm}
                              onChange={(e) => setClientSearchTerm(e.target.value)}
                              placeholder="Search client name..."
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            />
                          </div>
                        </div>

                        {/* Chronological Timeline Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {filteredClientTimeline.map((group) => (
                            <div
                              key={group.year}
                              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all space-y-2.5"
                            >
                              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-emerald-400 font-mono">
                                    {group.year}
                                  </span>
                                  {group.badge && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/20">
                                      {group.badge}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {group.clients.length} {group.clients.length === 1 ? 'Client' : 'Clients'}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-1.5">
                                {group.clients.map((client, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center gap-1"
                                  >
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    {client}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SUB-VIEW 4: Strategic Pillars & HOD Leadership Takeaways */}
                    {hodViewMode === 'pillars' && activeDataset?.keyHighlights && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          {activeDataset.keyHighlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-white/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-lg"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                                    {highlight.badge}
                                  </span>
                                  {highlight.stat && (
                                    <span className="text-xs font-mono font-bold text-white">
                                      {highlight.stat}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-sm font-bold text-white leading-snug">
                                  {highlight.title}
                                </h5>
                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                  {highlight.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Executive Summary Takeaway */}
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/30 border border-emerald-500/30 backdrop-blur-md">
                          <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                            <h4 className="text-sm font-black text-white">
                              Executive Leadership Statement • HOD Foysal Ahmed Shojib
                            </h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pl-9">
                            "Over the past 8 years, our Preservation team transformed from handling single work orders into executing mission-critical nationwide operations across 764 US cities. By driving turnaround times down from 103 hours to 36 hours and maintaining ironclad compliance, we remain the trusted backbone for 30+ top-tier US real estate asset management enterprises."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Shoutout Banner */}
                    {activeDataset?.shoutoutBanner && (
                      <div className="p-4 rounded-2xl border bg-emerald-950/30 border-emerald-500/30 flex items-center gap-3.5 shadow-lg">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-lg bg-emerald-600">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300">
                              {activeDataset.shoutoutBanner.badge}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-white">
                              {activeDataset.shoutoutBanner.title}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {activeDataset.shoutoutBanner.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ========================================================================= */
                  /* ASST. MANAGER (NAFIS) BDO PRESENTATION - FULL MULTI-VIEW SUITE */
                  /* ========================================================================= */
                  <div className="space-y-5">
                    {/* BDO Interactive Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => {
                            setBdoViewMode('charts');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            bdoViewMode === 'charts'
                              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <BarChart3 className="w-3.5 h-3.5" />
                          BDO Visual Trends & Revenue
                        </button>

                        <button
                          onClick={() => {
                            setBdoViewMode('table');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            bdoViewMode === 'table'
                              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Table className="w-3.5 h-3.5" />
                          Official 2019–2026 BDO Matrix
                        </button>

                        <button
                          onClick={() => {
                            setBdoViewMode('anchor');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            bdoViewMode === 'anchor'
                              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Anchor Client & Price Sheets (PPW)
                        </button>

                        <button
                          onClick={() => {
                            setBdoViewMode('pillars');
                            soundFx.playClick();
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            bdoViewMode === 'pillars'
                              ? 'bg-indigo-600 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          Operational Pillars & 90% Win Rate
                        </button>
                      </div>

                      <span className="text-[10px] font-mono text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 hidden md:inline">
                        Verified PPW Source
                      </span>
                    </div>

                    {/* BDO SUB-VIEW 1: Interactive Charts & Trend Explorer */}
                    {bdoViewMode === 'charts' && (
                      <div className="space-y-4">
                        {/* Metric Selector Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 mr-1">Select Metric:</span>
                          {[
                            { id: 'invoice_value', label: 'Gross Invoice USD', icon: DollarSign },
                            { id: 'bids_approved', label: 'Bids Approved & Win Rate', icon: TrendingUp },
                            { id: 'bid_tat', label: 'Bid Approval TAT', icon: Zap },
                            { id: 'invoices_count', label: 'Invoices Generated', icon: Receipt },
                            { id: 'bids_submitted', label: 'Bids Submitted', icon: Cpu },
                            { id: 'price_sheets', label: 'PPW Price Sheets', icon: Layers },
                          ].map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                              <button
                                key={tab.id}
                                onClick={() => {
                                  setSelectedBdoChartMetric(tab.id);
                                  soundFx.playClick();
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  selectedBdoChartMetric === tab.id
                                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
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
                              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                <currentBdoChartConfig.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-base font-bold text-white">
                                  {currentBdoChartConfig.title}
                                </h4>
                                <p className="text-xs text-indigo-300">
                                  {currentBdoChartConfig.subtitle}
                                </p>
                              </div>
                            </div>
                            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 self-start sm:self-auto">
                              Source: PPW • Unit: {currentBdoChartConfig.unit}
                            </span>
                          </div>

                          {/* Bar Chart Visualization */}
                          <div className="space-y-2.5 pt-1">
                            {currentBdoChartConfig.labels.map((year, idx) => {
                              const val = currentBdoChartConfig.values[idx];
                              const maxVal = Math.max(...currentBdoChartConfig.values);
                              const percentage = Math.max(6, Math.round((val / maxVal) * 100));
                              const isHighlighted = bdoActiveYearHighlight === year;

                              return (
                                <div
                                  key={year}
                                  onMouseEnter={() => setBdoActiveYearHighlight(year)}
                                  onMouseLeave={() => setBdoActiveYearHighlight(null)}
                                  className={`p-2 rounded-xl transition-all ${
                                    isHighlighted ? 'bg-indigo-500/10 border border-indigo-500/30' : 'hover:bg-white/5'
                                  }`}
                                >
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-white w-12">{year}</span>
                                      {year === '2019' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold">
                                          Inception
                                        </span>
                                      )}
                                      {year === '2023' && selectedBdoChartMetric === 'invoice_value' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                          All-Time Peak ($2.28M)
                                        </span>
                                      )}
                                      {year === '2026' && (
                                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                          {selectedBdoChartMetric === 'bids_approved'
                                            ? '90.0% Record Win Rate'
                                            : selectedBdoChartMetric === 'bid_tat'
                                            ? '40h Record TAT'
                                            : 'Current 2026 Run-Rate'}
                                        </span>
                                      )}
                                    </div>
                                    <span className="font-mono font-bold text-white">
                                      {currentBdoChartConfig.prefix || ''}
                                      {val.toLocaleString()} {currentBdoChartConfig.prefix ? 'USD' : currentBdoChartConfig.unit}
                                    </span>
                                  </div>
                                  <div className="w-full h-3.5 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-white/5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${percentage}%` }}
                                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                                      className={`h-full rounded-full ${
                                        selectedBdoChartMetric === 'bid_tat'
                                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                          : selectedBdoChartMetric === 'invoice_value'
                                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                                          : selectedBdoChartMetric === 'bids_approved'
                                          ? 'bg-gradient-to-r from-purple-500 to-indigo-400 shadow-[0_0_10px_rgba(139,92,246,0.4)]'
                                          : 'bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                                      }`}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className="text-xs text-slate-300 pt-2 border-t border-white/10 flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                            <span>{currentBdoChartConfig.description}</span>
                          </div>
                        </div>

                        {/* Revenue Breakdown Cards */}
                        {activeDataset?.breakdownStats && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {activeDataset.breakdownStats.map((item, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between"
                              >
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-slate-300 font-medium">{item.category}</span>
                                  <span className="font-mono font-bold text-indigo-400">{item.percentage}%</span>
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

                    {/* BDO SUB-VIEW 2: Full 8-Year Official Matrix Data Table */}
                    {bdoViewMode === 'table' && activeDataset?.historicalTable && (
                      <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <Table className="w-4 h-4 text-indigo-400" />
                              Official Preservation BDO Historical Metrics (2019–2026)
                            </h4>
                            <p className="text-xs text-slate-400">
                              Locked PPW billing, bid volume, and pricing performance indicators presented by Asst. Manager Nafis-Uz-Zaman.
                            </p>
                          </div>

                          {/* Quick Search */}
                          <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              value={bdoTableSearchTerm}
                              onChange={(e) => setBdoTableSearchTerm(e.target.value)}
                              placeholder="Search BDO metrics..."
                              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
                            />
                          </div>
                        </div>

                        {/* Interactive Data Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-white/10 text-slate-400 font-mono text-[11px] bg-white/[0.02]">
                                <th className="py-2.5 px-3 min-w-[220px]">Metric / Definition</th>
                                <th className="py-2.5 px-2 text-right">Unit</th>
                                <th className="py-2.5 px-2 text-center">Source</th>
                                {activeDataset.historicalTable.years.map((yr) => (
                                  <th
                                    key={yr}
                                    className={`py-2.5 px-2.5 text-right font-bold transition-all ${
                                      yr === '2026'
                                        ? 'text-amber-400 bg-amber-500/10'
                                        : yr === '2023'
                                        ? 'text-indigo-300'
                                        : yr === '2019'
                                        ? 'text-blue-300'
                                        : 'text-slate-200'
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
                                      row.highlight ? 'bg-indigo-950/15' : ''
                                    }`}
                                  >
                                    <td className="py-3 px-3">
                                      <div className="font-bold text-white flex items-center gap-1.5">
                                        {row.metric}
                                        {row.highlight && (
                                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-400 line-clamp-1">
                                        {row.definition}
                                      </div>
                                    </td>
                                    <td className="py-3 px-2 text-right font-mono text-slate-400 text-[11px]">
                                      {row.unit}
                                    </td>
                                    <td className="py-3 px-2 text-center font-mono text-[10px] text-slate-500">
                                      {row.source || 'PPW'}
                                    </td>
                                    {activeDataset.historicalTable!.years.map((yr) => {
                                      const rawVal = row.values[yr];
                                      let formatted = '-';

                                      if (row.format === 'currency' && typeof rawVal === 'number') {
                                        formatted = `$${rawVal.toLocaleString()}`;
                                      } else if (typeof rawVal === 'number') {
                                        formatted = rawVal.toLocaleString();
                                      } else if (rawVal !== undefined && rawVal !== null) {
                                        formatted = String(rawVal);
                                      }

                                      return (
                                        <td
                                          key={yr}
                                          className={`py-3 px-2.5 text-right font-mono font-semibold ${
                                            yr === '2026'
                                              ? 'text-amber-300 font-bold bg-amber-500/5'
                                              : 'text-slate-100'
                                          }`}
                                        >
                                          {formatted}
                                          {row.format === 'percentage' && typeof rawVal === 'number'
                                            ? '%'
                                            : ''}
                                          {row.format === 'hours' && typeof rawVal === 'number'
                                            ? 'h'
                                            : ''}
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

                    {/* BDO SUB-VIEW 3: Anchor Client MCS & Price Sheet Analysis */}
                    {bdoViewMode === 'anchor' && (
                      <div className="space-y-4">
                        {/* MCS Legacy Banner */}
                        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-blue-950/30 to-[#060c22] border border-indigo-500/30 backdrop-blur-md shadow-xl space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-base font-black text-white">
                                  MCS (Mortgage Contracting Services) • 8-Year Unbroken Anchor Account
                                </h4>
                                <p className="text-xs text-indigo-300">
                                  Inaugural client since 2019 • $5,630,760+ Cumulative Gross Value Processed
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs border border-emerald-500/30 self-start sm:self-auto">
                              Continuous Since Inception (2019–2026)
                            </span>
                          </div>

                          {/* Year-by-Year MCS Contributions */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            {[
                              { yr: '2019', val: '$765,428', badge: '100% Inception' },
                              { yr: '2020', val: '$628,436', badge: 'Anchor Pillar' },
                              { yr: '2021', val: '$403,488', badge: 'Core Volume' },
                              { yr: '2022', val: '$310,237', badge: 'Sustained Base' },
                              { yr: '2023', val: '$1,023,889', badge: 'Record $1M+ Year' },
                              { yr: '2024', val: '$844,429', badge: 'High Volume' },
                              { yr: '2025', val: '$833,132', badge: 'Enterprise Base' },
                              { yr: '2026', val: '$817,709', badge: 'Current YTD' },
                            ].map((item) => (
                              <div key={item.yr} className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-white text-xs">{item.yr}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                                    {item.badge}
                                  </span>
                                </div>
                                <div className="text-sm sm:text-base font-black text-indigo-200 font-mono">
                                  {item.val}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price Sheets & Client Ecosystem Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg space-y-1.5">
                            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
                              <Layers className="w-4 h-4" />
                              <span>PPW Price Sheets Maintained</span>
                            </div>
                            <div className="text-2xl font-black text-white font-mono">16 Active Catalogs</div>
                            <p className="text-xs text-slate-400">
                              Granular pricing matrices standardized across regional labor rates and multi-family specifications.
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg space-y-1.5">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                              <Users className="w-4 h-4" />
                              <span>New Clients Onboarded</span>
                            </div>
                            <div className="text-2xl font-black text-white font-mono">22 New Accounts</div>
                            <p className="text-xs text-slate-400">
                              Total new enterprise accounts successfully launched with custom price sheets and PPW integration.
                            </p>
                          </div>

                          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-lg space-y-1.5">
                            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                              <Zap className="w-4 h-4" />
                              <span>Approval Compression</span>
                            </div>
                            <div className="text-2xl font-black text-white font-mono">40 Hours Avg TAT</div>
                            <p className="text-xs text-slate-400">
                              75% reduction in client bid approval cycle (from 160h down to 40h) maximizing work order release.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* BDO SUB-VIEW 4: Strategic Pillars & Asst. Manager Leadership Takeaways */}
                    {bdoViewMode === 'pillars' && activeDataset?.keyHighlights && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {activeDataset.keyHighlights.map((highlight, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-white/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-lg"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300">
                                    {highlight.badge}
                                  </span>
                                  {highlight.stat && (
                                    <span className="text-xs font-mono font-bold text-white">
                                      {highlight.stat}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-sm font-bold text-white leading-snug">
                                  {highlight.title}
                                </h5>
                                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                                  {highlight.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Executive Summary Takeaway */}
                        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-blue-950/30 border border-indigo-500/30 backdrop-blur-md">
                          <div className="flex items-center gap-3 mb-2">
                            <Receipt className="w-6 h-6 text-indigo-400 shrink-0" />
                            <h4 className="text-sm font-black text-white">
                              BDO Frontline Statement • Asst. Manager Nafis-Uz-Zaman
                            </h4>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed pl-9">
                            "Through relentless pricing precision, meticulous PPW catalog management, and automated validation scripts, BDO processed over $11.64 Million in gross invoice volume across 8 consecutive operating years. Reaching a record 90.0% bid win rate in 2026 with 8,732 approvals proves our ability to translate rapid data operations into solid enterprise revenue."
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Shoutout Banner */}
                    {activeDataset?.shoutoutBanner && (
                      <div className="p-4 rounded-2xl border bg-indigo-950/30 border-indigo-500/30 flex items-center gap-3.5 shadow-lg">
                        <div className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-lg bg-indigo-600">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300">
                              {activeDataset.shoutoutBanner.badge}
                            </span>
                            <h5 className="text-xs sm:text-sm font-bold text-white">
                              {activeDataset.shoutoutBanner.title}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            {activeDataset.shoutoutBanner.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Award Teaser Ribbon */}
                {topPerformerAward && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#0a1026] to-[#050A18] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em]">
                          Annual Excellence Award
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {topPerformerAward.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveAwardModal(true);
                        soundFx.playClick();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs shadow-md shrink-0 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Reveal Nominees & Winner
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Award Ceremony Modal */}
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
