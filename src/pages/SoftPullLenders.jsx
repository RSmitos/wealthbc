import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Search, Filter, ArrowLeft, ExternalLink, Star, DollarSign,
  CreditCard, Building2, Home, Briefcase, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SoftPullLenders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const lenders = [
    // Credit Cards
    {
      id: 1,
      name: 'American Express',
      category: 'credit_cards',
      type: 'Soft Pull Pre-Qualification',
      minScore: 670,
      features: ['Pre-qualify without hard pull', 'See offers instantly', 'Multiple card options'],
      website: 'americanexpress.com/pre-qualify',
      rating: 4.5,
      notes: 'Check for pre-qualified offers before applying'
    },
    {
      id: 2,
      name: 'Capital One',
      category: 'credit_cards',
      type: 'Pre-Approval Tool',
      minScore: 600,
      features: ['No impact to credit score', 'Instant pre-approval', 'Wide range of cards'],
      website: 'capitalone.com/check-for-offers',
      rating: 4.7,
      notes: 'Best for fair-good credit'
    },
    {
      id: 3,
      name: 'Discover',
      category: 'credit_cards',
      type: 'Pre-Approval',
      minScore: 650,
      features: ['Cash back rewards', 'No annual fee options', 'Pre-qualify tool'],
      website: 'discover.com/preapproval',
      rating: 4.6,
      notes: 'Great for building credit'
    },
    {
      id: 4,
      name: 'Chase',
      category: 'credit_cards',
      type: 'Pre-Qualification',
      minScore: 680,
      features: ['Premium rewards', 'Pre-qualify available', 'Multiple card tiers'],
      website: 'chase.com/prequalified',
      rating: 4.4,
      notes: 'Check eligibility before applying'
    },

    // Personal Loans
    {
      id: 5,
      name: 'SoFi',
      category: 'personal_loans',
      type: 'Soft Pull Check',
      minScore: 680,
      features: ['No fees', 'Unemployment protection', 'Competitive rates'],
      website: 'sofi.com',
      rating: 4.8,
      notes: 'Great rates for good credit'
    },
    {
      id: 6,
      name: 'LendingClub',
      category: 'personal_loans',
      type: 'Pre-Qualification',
      minScore: 600,
      features: ['Fair credit accepted', 'Quick funding', 'Flexible terms'],
      website: 'lendingclub.com',
      rating: 4.3,
      notes: 'Good for fair credit borrowers'
    },
    {
      id: 7,
      name: 'Upstart',
      category: 'personal_loans',
      type: 'Soft Pull Pre-Approval',
      minScore: 580,
      features: ['AI-based approval', 'Fast funding', 'Alternative data considered'],
      website: 'upstart.com',
      rating: 4.5,
      notes: 'Considers more than credit score'
    },
    {
      id: 8,
      name: 'Marcus by Goldman Sachs',
      category: 'personal_loans',
      type: 'Pre-Qualification',
      minScore: 660,
      features: ['No fees ever', 'Fixed rates', 'Flexible payment dates'],
      website: 'marcus.com',
      rating: 4.7,
      notes: 'No origination fees'
    },

    // Business Loans
    {
      id: 9,
      name: 'Bluevine',
      category: 'business_loans',
      type: 'Soft Pull Pre-Qualification',
      minScore: 625,
      features: ['Lines of credit', 'Fast approval', 'No personal guarantee options'],
      website: 'bluevine.com',
      rating: 4.6,
      notes: 'Great for business lines of credit'
    },
    {
      id: 10,
      name: 'Fundbox',
      category: 'business_loans',
      type: 'Soft Check',
      minScore: 600,
      features: ['Quick funding', 'Flexible repayment', 'Small business friendly'],
      website: 'fundbox.com',
      rating: 4.4,
      notes: 'Good for startups'
    },
    {
      id: 11,
      name: 'Lendio',
      category: 'business_loans',
      type: 'Multiple Lender Match',
      minScore: 580,
      features: ['Marketplace platform', 'Multiple offers', 'One application'],
      website: 'lendio.com',
      rating: 4.5,
      notes: 'Compare multiple lenders at once'
    },

    // Mortgage
    {
      id: 12,
      name: 'Rocket Mortgage',
      category: 'mortgage',
      type: 'Soft Pull Pre-Approval',
      minScore: 620,
      features: ['Fast pre-approval', 'Digital process', 'Rate check'],
      website: 'rocketmortgage.com',
      rating: 4.3,
      notes: 'Quick online process'
    },
    {
      id: 13,
      name: 'Better.com',
      category: 'mortgage',
      type: 'Pre-Qualification',
      minScore: 640,
      features: ['Low rates', 'No lender fees', 'Fast closing'],
      website: 'better.com',
      rating: 4.6,
      notes: 'No lender origination fees'
    },

    // Auto Loans
    {
      id: 14,
      name: 'Capital One Auto Navigator',
      category: 'auto_loans',
      type: 'Pre-Qualification',
      minScore: 600,
      features: ['Pre-qualify without impact', 'Dealer network', 'Multiple offers'],
      website: 'capitalone.com/auto',
      rating: 4.5,
      notes: 'Wide dealer network'
    },
    {
      id: 15,
      name: 'Carvana',
      category: 'auto_loans',
      type: 'Soft Pull Pre-Approval',
      minScore: 580,
      features: ['Online buying', 'Pre-approval available', 'Home delivery'],
      website: 'carvana.com',
      rating: 4.2,
      notes: 'Complete process online'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Lenders', icon: Star },
    { id: 'credit_cards', name: 'Credit Cards', icon: CreditCard },
    { id: 'personal_loans', name: 'Personal Loans', icon: DollarSign },
    { id: 'business_loans', name: 'Business Loans', icon: Building2 },
    { id: 'mortgage', name: 'Mortgage', icon: Home },
    { id: 'auto_loans', name: 'Auto Loans', icon: Briefcase }
  ];

  const filteredLenders = lenders
    .filter(lender => {
      const matchesSearch = lender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lender.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || lender.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'score') return a.minScore - b.minScore;
      return 0;
    });

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Soft Pull Lenders Database</h1>
            <p className="text-gray-400">Find lenders that offer pre-qualification without hard inquiries</p>
          </div>
        </div>

        {/* Info Card */}
        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Why Soft Pull Pre-Qualifications Matter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Soft pull pre-qualifications let you check your approval odds WITHOUT impacting your credit score. 
              Only apply for products where you're pre-qualified to avoid unnecessary hard inquiries.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-bold text-white mb-1">No Score Impact</h4>
                <p className="text-sm text-gray-400">Check eligibility safely</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <Star className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">Better Approval Odds</h4>
                <p className="text-sm text-gray-400">Apply only where you qualify</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Compare Offers</h4>
                <p className="text-sm text-gray-400">See rates before applying</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search lenders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#D4AF37] text-black'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:border-[#D4AF37]/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-[#D4AF37]/20 text-white rounded-lg focus:border-[#D4AF37] focus:outline-none"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="score">Sort by Min Score</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing {filteredLenders.length} lender{filteredLenders.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredLenders.map(lender => (
            <Card key={lender.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl mb-2">{lender.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-[#D4AF37]/20 border border-[#D4AF37]/40 rounded text-xs text-[#D4AF37]">
                        {lender.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-white">{lender.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Minimum Credit Score</p>
                  <p className="text-2xl font-bold text-white">{lender.minScore}+</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Features</p>
                  <ul className="space-y-1">
                    {lender.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-[#D4AF37] mt-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {lender.notes && (
                  <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-gray-300">{lender.notes}</p>
                  </div>
                )}

                <a
                  href={`https://${lender.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                    Visit Lender
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Soft Pull Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Pre-Qualify First</h4>
                <p className="text-sm text-gray-400">Always check pre-qualification before applying</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Compare Multiple</h4>
                <p className="text-sm text-gray-400">Check several lenders to compare offers</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Read Fine Print</h4>
                <p className="text-sm text-gray-400">Verify soft pull claim before submitting info</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}