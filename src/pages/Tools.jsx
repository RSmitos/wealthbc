import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  Search, Filter, Calculator, FileText, TrendingUp, Award, 
  Building2, DollarSign, Download, ExternalLink, Clock, 
  Star, ChevronRight, X, Target, Shield, CheckCircle,
  AlertCircle, BarChart, Zap, Mail, Lock
} from 'lucide-react';

export default function Tools() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, []);


  const categories = [
    { id: 'all', name: 'All Tools' },
    { id: 'credit-repair', name: 'Credit Repair' },
    { id: 'disputes', name: 'Disputes' },
    { id: 'credit-building', name: 'Credit Building' },
    { id: 'business-credit', name: 'Business Credit' },
    { id: 'funding', name: 'Funding Tools' },
    { id: 'wealth', name: 'Wealth Tools' },
    { id: 'templates', name: 'Templates' },
    { id: 'downloads', name: 'Downloads' }
  ];

  const allTools = [
    // Credit Repair Tools
    { 
      id: 1, 
      title: 'Credit Utilization Tracker', 
      description: 'Monitor and optimize your credit card usage across all accounts',
      category: 'credit-repair',
      icon: Calculator,
      type: 'Tool',
      updated: '2025-11-20',
      popular: true
    },
    { 
      id: 2, 
      title: 'Dispute Log', 
      description: 'Track all your credit disputes and their outcomes',
      category: 'credit-repair',
      icon: FileText,
      type: 'Tool',
      updated: '2025-11-18',
      popular: true
    },
    { 
      id: 3, 
      title: 'Credit Profile Analyzer', 
      description: 'Comprehensive analysis of your entire credit profile',
      category: 'credit-repair',
      icon: BarChart,
      type: 'Tool',
      updated: '2025-11-22',
      popular: true
    },
    { 
      id: 4, 
      title: 'Hard Inquiry Map', 
      description: 'Track and manage hard inquiries on your credit report',
      category: 'credit-repair',
      icon: Target,
      type: 'Tool',
      updated: '2025-11-15'
    },
    { 
      id: 5, 
      title: 'Late Payment Strategy Sheet', 
      description: 'Strategic planning for handling late payment removals',
      category: 'credit-repair',
      icon: AlertCircle,
      type: 'Sheet',
      updated: '2025-11-10'
    },

    // Dispute Tools & Templates
    { 
      id: 6, 
      title: 'Dispute Letter Generator', 
      description: 'Generate professional dispute letters for credit bureaus',
      category: 'disputes',
      icon: Mail,
      type: 'Tool',
      updated: '2025-11-19',
      popular: true
    },
    { 
      id: 7, 
      title: 'FCRA Reference Sheet', 
      description: 'Quick reference for Fair Credit Reporting Act rights',
      category: 'disputes',
      icon: Shield,
      type: 'PDF',
      updated: '2025-11-12'
    },
    { 
      id: 8, 
      title: 'Debt Validation Template', 
      description: 'Template for validating debt with collectors',
      category: 'disputes',
      icon: FileText,
      type: 'Template',
      updated: '2025-11-08'
    },
    { 
      id: 9, 
      title: 'Method of Verification Tracker', 
      description: 'Track MOV requests and responses from bureaus',
      category: 'disputes',
      icon: CheckCircle,
      type: 'Sheet',
      updated: '2025-11-14'
    },
    { 
      id: 10, 
      title: 'Certified Mail Log', 
      description: 'Log all certified mail for dispute documentation',
      category: 'disputes',
      icon: FileText,
      type: 'Sheet',
      updated: '2025-11-05'
    },

    // Credit Building Tools
    { 
      id: 11, 
      title: 'Authorized User Score Impact Estimator', 
      description: 'Calculate potential score boost from authorized user accounts',
      category: 'credit-building',
      icon: TrendingUp,
      type: 'Calculator',
      updated: '2025-11-17'
    },
    { 
      id: 12, 
      title: 'AZEO Plan Tracker', 
      description: 'All Zero Except One strategy planner',
      category: 'credit-building',
      icon: Target,
      type: 'Tool',
      updated: '2025-11-16'
    },
    { 
      id: 13, 
      title: 'Secured Card Builder', 
      description: 'Plan your secured card graduation strategy',
      category: 'credit-building',
      icon: Award,
      type: 'Tool',
      updated: '2025-11-13'
    },
    { 
      id: 14, 
      title: 'Revolving vs Installment Mix Chart', 
      description: 'Optimize your credit mix for better scores',
      category: 'credit-building',
      icon: BarChart,
      type: 'Chart',
      updated: '2025-11-11'
    },

    // Business Credit Tools
    { 
      id: 15, 
      title: 'Business Credit Tier Builder', 
      description: 'Build business credit from tier 1 through tier 4',
      category: 'business-credit',
      icon: Building2,
      type: 'Tool',
      updated: '2025-11-21',
      popular: true
    },
    { 
      id: 16, 
      title: 'Vendor Tracking Sheet', 
      description: 'Track all vendor credit accounts and reporting',
      category: 'business-credit',
      icon: FileText,
      type: 'Sheet',
      updated: '2025-11-18'
    },
    { 
      id: 17, 
      title: 'Paydex Planner', 
      description: 'Optimize your Dun & Bradstreet Paydex score',
      category: 'business-credit',
      icon: Target,
      type: 'Tool',
      updated: '2025-11-15'
    },
    { 
      id: 18, 
      title: 'Business Address + EIN Setup Checklist', 
      description: 'Complete checklist for business credit foundation',
      category: 'business-credit',
      icon: CheckCircle,
      type: 'Checklist',
      updated: '2025-11-10'
    },
    { 
      id: 19, 
      title: 'Business Credit Monitoring Sheet', 
      description: 'Monitor all three business credit bureaus',
      category: 'business-credit',
      icon: BarChart,
      type: 'Sheet',
      updated: '2025-11-09'
    },

    // Funding Tools
    { 
      id: 20, 
      title: 'BLoC Loan Calculator', 
      description: 'Calculate business line of credit potential and payments',
      category: 'funding',
      icon: Calculator,
      type: 'Calculator',
      updated: '2025-11-20',
      popular: true
    },
    { 
      id: 21, 
      title: 'Soft Pull Lenders List', 
      description: 'Database of lenders that do soft pull pre-approvals',
      category: 'funding',
      icon: FileText,
      type: 'List',
      updated: '2025-11-19'
    },
    { 
      id: 22, 
      title: 'DSCR Prep Sheet', 
      description: 'Prepare for Debt Service Coverage Ratio loans',
      category: 'funding',
      icon: DollarSign,
      type: 'Sheet',
      updated: '2025-11-14'
    },
    { 
      id: 23, 
      title: 'Income / FICO Readiness Check', 
      description: 'Check if you\'re ready for funding applications',
      category: 'funding',
      icon: CheckCircle,
      type: 'Checklist',
      updated: '2025-11-12'
    },

    // Templates & Downloads
    { 
      id: 24, 
      title: 'Pay Stub Template', 
      description: 'Professional pay stub template for self-employed',
      category: 'templates',
      icon: FileText,
      type: 'Template',
      updated: '2025-11-17'
    },
    { 
      id: 25, 
      title: 'Profit & Loss Template', 
      description: 'P&L statement template for business applications',
      category: 'templates',
      icon: FileText,
      type: 'Template',
      updated: '2025-11-16'
    },
    { 
      id: 26, 
      title: '24-Month Budget Planner', 
      description: 'Complete budget planning spreadsheet',
      category: 'templates',
      icon: Calculator,
      type: 'Template',
      updated: '2025-11-15'
    },
    { 
      id: 27, 
      title: 'Debt Payoff Calculator', 
      description: 'Calculate optimal debt payoff strategies',
      category: 'templates',
      icon: Calculator,
      type: 'Calculator',
      updated: '2025-11-14'
    },
    { 
      id: 28, 
      title: 'Master Dispute Log', 
      description: 'Comprehensive dispute tracking spreadsheet',
      category: 'templates',
      icon: FileText,
      type: 'Sheet',
      updated: '2025-11-13'
    },
    { 
      id: 29, 
      title: 'Employment Verification Template', 
      description: 'Employment verification letter template',
      category: 'templates',
      icon: FileText,
      type: 'Template',
      updated: '2025-11-10'
    },
    { 
      id: 30, 
      title: 'Google Sheets Bundle', 
      description: 'Complete collection of all spreadsheet tools',
      category: 'downloads',
      icon: Download,
      type: 'Bundle',
      updated: '2025-11-22'
    }
  ];

  const filteredTools = allTools
    .filter(tool => {
      const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.updated) - new Date(a.updated);
      if (sortBy === 'alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'popular') return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const popularTools = allTools.filter(tool => tool.popular);

  const toolsByCategory = (categoryId) => {
    return filteredTools.filter(tool => tool.category === categoryId);
  };

  const ToolCard = ({ tool }) => {
    const Icon = tool.icon;
    
    return (
      <div 
        onClick={() => setSelectedTool(tool)}
        className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37] transition-all cursor-pointer group relative"
      >
        {!isAdmin && (
          <div className="absolute top-3 right-3">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
          </div>
        )}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-[#D4AF37]" />
          </div>
          {tool.popular && isAdmin && (
            <div className="px-2 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-full text-xs font-semibold text-[#D4AF37]">
              Popular
            </div>
          )}
        </div>
        <h3 className="font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4">{tool.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{tool.type}</span>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{new Date(tool.updated).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {/* 1. Page Title + Subtitle */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Tools & Templates Library
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            All your calculators, trackers, dispute tools, business credit worksheets, and downloads in one organized place.
          </p>
          <p className="text-sm text-gray-600">New tools added regularly.</p>
        </div>

        {/* 2. Search + Filters Bar */}
        <div className="mb-10 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search tools by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[#D4AF37]/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Used</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>

        {/* 4. Featured Tools */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-[#D4AF37]" />
              Popular This Month
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* 3. Category Sections */}
        {selectedCategory === 'all' && !searchQuery ? (
          // Show all categories
          <div className="space-y-12">
            {/* Credit Repair Tools */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Credit Repair Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('credit-repair').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Dispute Tools & Templates */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Dispute Tools & Templates</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('disputes').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Credit Building Tools */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Credit Building Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('credit-building').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Business Credit Tools */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Business Credit Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('business-credit').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Funding Tools */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Funding Tools</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('funding').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* Templates & Downloads */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Templates & Downloads</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {toolsByCategory('templates').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
                {toolsByCategory('downloads').map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Show filtered results
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {filteredTools.length} {filteredTools.length === 1 ? 'Tool' : 'Tools'} Found
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        )}

        {/* 6. Admin Notice */}
        <div className="mt-16 mb-10">
          <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-8 text-center">
            <p className="text-white font-medium mb-4">
              Can't find a tool or need a new one?
            </p>
            <Link to={createPageUrl('Contact')}>
              <button className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold">
                Request a Tool
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Tool Detail Modal */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  {React.createElement(selectedTool.icon, {
                    className: "w-12 h-12 text-[#D4AF37]"
                  })}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedTool.title}</h2>
                    <p className="text-gray-400">{selectedTool.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="text-white font-medium">{selectedTool.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="text-white font-medium">
                    {new Date(selectedTool.updated).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Category:</span>
                  <span className="text-white font-medium">
                    {categories.find(c => c.id === selectedTool.category)?.name}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {isAdmin ? (
                  <Link to={createPageUrl(
                  selectedTool.title === 'Credit Utilization Tracker' ? 'CreditUtilizationTracker' :
                  selectedTool.title === 'Debt Payoff Calculator' ? 'DebtPayoffCalculator' :
                  selectedTool.title === 'Dispute Log' ? 'DisputeLog' :
                  selectedTool.title === 'Business Credit Tier Builder' ? 'BusinessCreditTracker' :
                  selectedTool.title === 'BLoC Calculator' || selectedTool.title === 'BLoC Loan Calculator' ? 'BLoCCalculator' :
                  selectedTool.title === 'Credit Profile Analyzer' ? 'CreditProfileAnalyzer' :
                  selectedTool.title === 'Hard Inquiry Map' ? 'HardInquiryTracker' :
                  selectedTool.title === 'Dispute Letter Generator' ? 'DisputeLetterGenerator' :
                  selectedTool.title === 'AZEO Plan Tracker' ? 'AZEOTracker' :
                  selectedTool.title === 'Paydex Planner' ? 'PaydexPlanner' :
                  selectedTool.title === 'Method of Verification Tracker' ? 'MOVTracker' :
                  selectedTool.title === 'Certified Mail Log' ? 'CertifiedMailLog' :
                  selectedTool.title === 'Soft Pull Lenders List' ? 'SoftPullLenders' :
                  selectedTool.title === 'Authorized User Score Impact Estimator' ? 'AuthorizedUserCalculator' :
                  selectedTool.title === 'DSCR Prep Sheet' ? 'DSCRPrepSheet' :
                  selectedTool.title === '24-Month Budget Planner' ? 'BudgetPlanner' :
                  selectedTool.title === 'Late Payment Strategy Sheet' ? 'LatePaymentStrategy' :
                  selectedTool.title === 'Income / FICO Readiness Check' ? 'FundingReadinessCheck' :
                  selectedTool.title === 'Revolving vs Installment Mix Chart' ? 'CreditMixOptimizer' :
                  selectedTool.title === 'Secured Card Builder' ? 'SecuredCardBuilder' :
                  selectedTool.title === 'Business Address + EIN Setup Checklist' ? 'BusinessSetupChecklist' :
                  selectedTool.title === 'Business Credit Monitoring Sheet' ? 'BusinessCreditMonitoring' :
                  selectedTool.title === 'FCRA Reference Sheet' ? 'FCRAReference' :
                  selectedTool.title === 'Debt Validation Template' ? 'DebtValidationGenerator' :
                  selectedTool.title === 'Master Dispute Log' ? 'MasterDisputeLog' :
                  selectedTool.title === 'Pay Stub Template' ? 'PayStubGenerator' :
                  selectedTool.title === 'Profit & Loss Template' ? 'ProfitLossGenerator' :
                  selectedTool.title === 'Employment Verification Template' ? 'EmploymentVerificationGenerator' :
                  selectedTool.title === 'Vendor Tracking Sheet' ? 'VendorTrackingSheet' :
                  selectedTool.title === 'Google Sheets Bundle' ? 'GoogleSheetsBundle' :
                  'Tools'
                )}>
                    <button className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg">
                      Open Tool
                    </button>
                  </Link>
                ) : (
                  <Link to={createPageUrl('Contact')}>
                    <button className="w-full px-6 py-4 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-bold text-lg flex items-center justify-center gap-2">
                      <Lock className="w-5 h-5" />
                      Admin Access Only
                    </button>
                  </Link>
                )}
                {selectedTool.type === 'PDF' || selectedTool.type === 'Template' && (
                  <button className="w-full px-6 py-3 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                )}
                {selectedTool.type === 'Sheet' && (
                  <button className="w-full px-6 py-3 bg-white/5 border border-[#D4AF37]/30 text-white rounded-lg hover:border-[#D4AF37] transition-all font-medium flex items-center justify-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Open Google Sheet
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}