import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { 
  Search, Filter, Star, Calculator, FileText, TrendingUp,
  Building2, DollarSign, Download, ArrowRight, Check,
  ShoppingBag, Sparkles, Award, Target, Users
} from 'lucide-react';

export default function Store() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);


  const categories = [
    { id: 'all', name: 'All Products', icon: ShoppingBag },
    { id: 'templates', name: 'Templates', icon: FileText },
    { id: 'calculators', name: 'Calculators', icon: Calculator },
    { id: 'credit-repair', name: 'Credit Repair', icon: TrendingUp },
    { id: 'business-credit', name: 'Business Credit', icon: Building2 },
    { id: 'funding', name: 'Funding Tools', icon: DollarSign },
    { id: 'dispute', name: 'Dispute Tools', icon: FileText },
    { id: 'popular', name: 'Most Popular', icon: Star }
  ];

  const products = [
    // Best Sellers
    {
      id: 1,
      name: 'Pay Stub Template',
      description: 'Professional pay stub template for business applications',
      price: 35,
      category: 'templates',
      featured: true,
      icon: FileText,
      benefits: ['Instant download', 'Editable format', 'Professional layout']
    },
    {
      id: 2,
      name: 'Dispute Letter Pack',
      description: 'Complete collection of proven dispute letter templates',
      price: 45,
      category: 'dispute',
      featured: true,
      icon: FileText,
      benefits: ['15+ templates', 'FCRA compliant', 'Step-by-step guide']
    },
    {
      id: 3,
      name: 'Business Credit Vendor Tracker',
      description: 'Track vendor accounts and build business credit systematically',
      price: 65,
      category: 'business-credit',
      featured: true,
      icon: Building2,
      benefits: ['300+ vendors', 'Tier system', 'Application tracking']
    },
    {
      id: 4,
      name: 'BLoC Calculator',
      description: 'Calculate business line of credit potential and requirements',
      price: 55,
      category: 'funding',
      featured: true,
      icon: Calculator,
      benefits: ['Multiple scenarios', 'Approval predictor', 'Strategy guide']
    },

    // Credit Repair Tools
    {
      id: 5,
      name: 'Credit Utilization Tracker',
      description: 'Monitor and optimize your credit card utilization',
      price: 30,
      category: 'credit-repair',
      icon: Calculator,
      benefits: ['Real-time tracking', 'AZEO optimization', 'Alert system']
    },
    {
      id: 6,
      name: 'Hard Inquiry Tracker',
      description: 'Track and manage credit inquiries effectively',
      price: 25,
      category: 'credit-repair',
      icon: Target,
      benefits: ['Inquiry log', 'Removal strategies', '2-year timeline']
    },
    {
      id: 7,
      name: 'Credit Profile Analyzer',
      description: 'Complete credit profile analysis and recommendations',
      price: 40,
      category: 'credit-repair',
      icon: TrendingUp,
      benefits: ['All 3 bureaus', 'Score factors', 'Action plan']
    },
    {
      id: 8,
      name: 'Credit Errors Checklist',
      description: 'Systematic checklist for identifying credit report errors',
      price: 20,
      category: 'credit-repair',
      icon: FileText,
      benefits: ['50+ error types', 'Detection guide', 'Priority system']
    },

    // Dispute Tools
    {
      id: 9,
      name: 'Method of Verification Log',
      description: 'Track MOV requests and responses from bureaus',
      price: 35,
      category: 'dispute',
      icon: FileText,
      benefits: ['Request tracking', 'Response log', 'Timeline tracker']
    },
    {
      id: 10,
      name: 'Identity Theft Report Template',
      description: 'Complete identity theft report and affidavit package',
      price: 30,
      category: 'dispute',
      icon: FileText,
      benefits: ['FTC compliant', 'Police report guide', 'Bureau submission']
    },
    {
      id: 11,
      name: 'Debt Validation Letter Pack',
      description: 'Force debt collectors to prove debt validity',
      price: 40,
      category: 'dispute',
      icon: FileText,
      benefits: ['FDCPA templates', 'Cease & desist', 'Follow-up letters']
    },

    // Credit Building
    {
      id: 12,
      name: 'Authorized User Planner',
      description: 'Strategic plan for leveraging authorized user accounts',
      price: 30,
      category: 'credit-repair',
      icon: Users,
      benefits: ['Tradeline selection', 'Timing strategy', 'Risk assessment']
    },
    {
      id: 13,
      name: 'AZEO Strategy Sheet',
      description: 'Master the All Zero Except One utilization method',
      price: 25,
      category: 'credit-repair',
      icon: Target,
      benefits: ['Payment calculator', 'Statement dates', 'Optimization tips']
    },
    {
      id: 14,
      name: 'High-Limit Credit Plan',
      description: 'Step-by-step plan for securing high credit limits',
      price: 45,
      category: 'credit-repair',
      icon: TrendingUp,
      benefits: ['CLI strategies', 'Bank preferences', 'Income optimization']
    },

    // Business Credit
    {
      id: 15,
      name: 'Business Credit Tier Builder',
      description: 'Build business credit from tier 1 to tier 4',
      price: 60,
      category: 'business-credit',
      icon: Award,
      benefits: ['4-tier system', 'Vendor lists', 'Application guides']
    },
    {
      id: 16,
      name: 'Paydex Roadmap',
      description: 'Strategic plan for building Paydex score to 80+',
      price: 50,
      category: 'business-credit',
      icon: TrendingUp,
      benefits: ['Score tracking', 'Payment strategy', 'Timeline planner']
    },

    // Funding Tools
    {
      id: 17,
      name: 'Soft Pull Lenders Spreadsheet',
      description: 'Database of lenders that use soft pulls for pre-approval',
      price: 40,
      category: 'funding',
      icon: DollarSign,
      benefits: ['100+ lenders', 'Requirements', 'Application links']
    },
    {
      id: 18,
      name: 'Bank Relationship Checklist',
      description: 'Build banking relationships for better funding approvals',
      price: 35,
      category: 'funding',
      icon: Building2,
      benefits: ['Relationship strategy', 'Bank comparison', 'Action steps']
    },

    // Financial Templates
    {
      id: 19,
      name: 'Profit & Loss Template',
      description: 'Professional P&L statement for business applications',
      price: 30,
      category: 'templates',
      icon: FileText,
      benefits: ['Professional format', 'Auto calculations', 'Quarterly & annual']
    },
    {
      id: 20,
      name: 'Monthly Budget Planner',
      description: 'Comprehensive budget tracking and planning system',
      price: 25,
      category: 'templates',
      icon: Calculator,
      benefits: ['Income tracking', 'Expense categories', 'Savings goals']
    },
    {
      id: 21,
      name: 'Debt Snowball Calculator',
      description: 'Plan and track your debt elimination journey',
      price: 30,
      category: 'calculators',
      icon: Calculator,
      benefits: ['Multiple strategies', 'Payoff timeline', 'Interest savings']
    },
    {
      id: 22,
      name: '24-Month Financial Plan',
      description: 'Complete 2-year financial transformation roadmap',
      price: 50,
      category: 'templates',
      icon: Target,
      benefits: ['Goal setting', 'Milestone tracking', 'Monthly reviews']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                          product.category === selectedCategory ||
                          (selectedCategory === 'popular' && product.featured);
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'newest':
        return b.id - a.id;
      default: // popular
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {/* 1. Store Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full text-sm font-medium mb-6 text-[#D4AF37]">
            <ShoppingBag className="w-4 h-4" />
            <span>Premium Tools & Templates</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
            WealthBC <span className="text-[#D4AF37]">Store</span>
          </h1>
          <p className="text-xl text-[#E3E3E3] max-w-3xl mx-auto mb-2">
            Buy individual tools, calculators, and templates without a membership.
          </p>
          <p className="text-sm text-[#E3E3E3]">All items include lifetime updates.</p>
        </div>

        {/* 2. Search + Filters Bar */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-6 mb-8 sticky top-0 z-40 backdrop-blur-md">
          <div className="grid md:grid-cols-[1fr_auto_auto] gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#E3E3E3]" />
              <input
                type="text"
                placeholder="Search tools and templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.slice(0, 8).map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#D4AF37] text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Featured Row (Best Sellers) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <Star className="w-8 h-8 text-[#D4AF37]" />
              Best Sellers
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => {
              const Icon = product.icon;
              return (
                <div key={product.id} className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-xl p-6 hover:border-[#D4AF37] transition-all group">
                  <div className="w-16 h-16 bg-[#D4AF37] rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    {isAdmin ? (
                      <span className="text-3xl font-bold text-green-400">FREE</span>
                    ) : (
                      <span className="text-3xl font-bold text-gray-600">LOCKED</span>
                    )}
                    <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm group-hover:scale-105">
                      {isAdmin ? 'View Item' : 'Admin Only'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* 4 & 5. All Products Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-gray-400">{sortedProducts.length} items</span>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map(product => {
                const Icon = product.icon;
                return (
                  <div key={product.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl overflow-hidden hover:border-[#D4AF37]/50 transition-all group">
                    <div className="aspect-square bg-gradient-to-br from-[#D4AF37]/10 to-transparent flex items-center justify-center border-b border-[#D4AF37]/20">
                      <Icon className="w-16 h-16 text-[#D4AF37] opacity-80 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {product.benefits?.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-[#E3E3E3]">
                            <Check className="w-3 h-3 text-[#D4AF37]" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        {isAdmin ? (
                          <span className="text-2xl font-bold text-green-400">FREE</span>
                        ) : (
                          <span className="text-2xl font-bold text-gray-600">LOCKED</span>
                        )}
                        <button className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold text-sm">
                          {isAdmin ? 'View Item' : 'Admin Only'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#D4AF37]/20 rounded-xl p-12 text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C4A137] transition-all font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}