import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  CheckCircle, XCircle, AlertTriangle, ArrowLeft, TrendingUp, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FundingReadinessCheck() {
  const [formData, setFormData] = useState({
    personalCreditScore: '',
    businessCreditScore: '',
    annualRevenue: '',
    monthsInBusiness: '',
    bankBalance: '',
    existingDebt: '',
    latePayments: '',
    collections: '',
    bankruptcies: '',
    businessStructure: '',
    hasEIN: '',
    hasBankAccount: ''
  });

  const [results, setResults] = useState(null);

  const checkReadiness = () => {
    const personalScore = parseInt(formData.personalCreditScore) || 0;
    const businessScore = parseInt(formData.businessCreditScore) || 0;
    const revenue = parseFloat(formData.annualRevenue) || 0;
    const months = parseInt(formData.monthsInBusiness) || 0;
    const balance = parseFloat(formData.bankBalance) || 0;
    const debt = parseFloat(formData.existingDebt) || 0;
    const latePayments = parseInt(formData.latePayments) || 0;
    const collections = formData.collections === 'yes';
    const bankruptcies = formData.bankruptcies === 'yes';

    let readinessScore = 0;
    let maxScore = 100;
    let issues = [];
    let strengths = [];
    let recommendations = [];

    // Personal Credit Score (20 points)
    if (personalScore >= 700) {
      readinessScore += 20;
      strengths.push('Excellent personal credit score');
    } else if (personalScore >= 650) {
      readinessScore += 15;
      strengths.push('Good personal credit score');
    } else if (personalScore >= 600) {
      readinessScore += 10;
      issues.push('Personal credit score could be improved');
      recommendations.push('Work on improving personal score to 680+ for better rates');
    } else {
      issues.push('Personal credit score is below most lender requirements');
      recommendations.push('Focus on credit repair before applying for funding');
    }

    // Business Credit Score (15 points)
    if (businessScore >= 75) {
      readinessScore += 15;
      strengths.push('Strong business credit profile');
    } else if (businessScore >= 50) {
      readinessScore += 10;
      strengths.push('Moderate business credit');
    } else if (businessScore > 0) {
      readinessScore += 5;
      issues.push('Business credit needs improvement');
      recommendations.push('Build business credit through vendor tradelines');
    } else {
      issues.push('No established business credit');
      recommendations.push('Start building business credit with Tier 1 vendors');
    }

    // Revenue (20 points)
    if (revenue >= 100000) {
      readinessScore += 20;
      strengths.push('Strong revenue stream');
    } else if (revenue >= 50000) {
      readinessScore += 15;
      strengths.push('Moderate revenue');
    } else if (revenue >= 25000) {
      readinessScore += 10;
      issues.push('Revenue below ideal levels');
      recommendations.push('Consider revenue-based loans or microloans');
    } else {
      issues.push('Low revenue may limit funding options');
      recommendations.push('Focus on growing revenue before large funding attempts');
    }

    // Time in Business (15 points)
    if (months >= 24) {
      readinessScore += 15;
      strengths.push('Established business history');
    } else if (months >= 12) {
      readinessScore += 10;
      strengths.push('Good business history');
    } else if (months >= 6) {
      readinessScore += 5;
      issues.push('Limited business history');
      recommendations.push('Continue building business history');
    } else {
      issues.push('Very new business - most lenders require 6+ months');
      recommendations.push('Focus on business credit and revenue first');
    }

    // Bank Balance (10 points)
    if (balance >= 10000) {
      readinessScore += 10;
      strengths.push('Strong cash reserves');
    } else if (balance >= 5000) {
      readinessScore += 7;
      strengths.push('Adequate cash reserves');
    } else if (balance >= 2000) {
      readinessScore += 3;
      issues.push('Low cash reserves');
      recommendations.push('Build up 3-6 months operating expenses');
    } else {
      issues.push('Very low cash reserves');
      recommendations.push('Increase cash reserves before seeking funding');
    }

    // Debt-to-Income (10 points)
    const dti = revenue > 0 ? (debt / revenue) * 100 : 100;
    if (dti <= 30) {
      readinessScore += 10;
      strengths.push('Low debt-to-income ratio');
    } else if (dti <= 50) {
      readinessScore += 7;
      strengths.push('Manageable debt levels');
    } else {
      issues.push('High debt-to-income ratio');
      recommendations.push('Pay down existing debt before new financing');
    }

    // Late Payments (10 points)
    if (latePayments === 0) {
      readinessScore += 10;
      strengths.push('Perfect payment history');
    } else if (latePayments <= 2) {
      readinessScore += 5;
      issues.push('Some late payments present');
      recommendations.push('Maintain perfect payments for 12+ months');
    } else {
      issues.push('Multiple late payments');
      recommendations.push('Focus on perfect payment history before funding');
    }

    // Collections/Bankruptcies (deductions)
    if (collections) {
      issues.push('Active collections present');
      recommendations.push('Settle or pay collections before applying');
    }
    if (bankruptcies) {
      issues.push('Bankruptcy on record');
      recommendations.push('Most lenders require 2+ years since discharge');
    }

    // Business Structure
    if (formData.businessStructure === 'llc' || formData.businessStructure === 'corp') {
      strengths.push('Proper business structure in place');
    } else if (formData.businessStructure === 'sole_proprietor') {
      issues.push('Sole proprietorship limits some funding options');
      recommendations.push('Consider forming an LLC for better funding access');
    } else {
      issues.push('No business structure established');
      recommendations.push('Form an LLC or Corporation');
    }

    // EIN
    if (formData.hasEIN === 'yes') {
      strengths.push('EIN established');
    } else {
      issues.push('No EIN - required for most business funding');
      recommendations.push('Obtain EIN from IRS (free and takes minutes)');
    }

    // Business Bank Account
    if (formData.hasBankAccount === 'yes') {
      strengths.push('Business bank account active');
    } else {
      issues.push('No business bank account');
      recommendations.push('Open business bank account immediately');
    }

    const readinessPercentage = (readinessScore / maxScore) * 100;
    let readinessLevel = '';
    let fundingOptions = [];

    if (readinessPercentage >= 80) {
      readinessLevel = 'EXCELLENT';
      fundingOptions = [
        'Term Loans (up to $500K+)',
        'Business Lines of Credit',
        'SBA Loans',
        'Equipment Financing',
        'Commercial Real Estate'
      ];
    } else if (readinessPercentage >= 60) {
      readinessLevel = 'GOOD';
      fundingOptions = [
        'Small Business Loans (up to $250K)',
        'Business Lines of Credit (lower limits)',
        'Equipment Financing',
        'Invoice Financing'
      ];
    } else if (readinessPercentage >= 40) {
      readinessLevel = 'FAIR';
      fundingOptions = [
        'Microloans (up to $50K)',
        'Business Credit Cards',
        'Vendor Credit',
        'Revenue-Based Financing'
      ];
    } else {
      readinessLevel = 'NOT READY';
      fundingOptions = [
        'Focus on building credit first',
        'Business credit cards (secured)',
        'Vendor credit (Tier 1)',
        'Personal loans as last resort'
      ];
    }

    setResults({
      readinessScore: readinessPercentage,
      readinessLevel,
      issues,
      strengths,
      recommendations,
      fundingOptions,
      personalScore,
      businessScore,
      revenue,
      dti: dti.toFixed(1)
    });
  };

  const exportReport = () => {
    if (!results) return;

    const report = `FUNDING READINESS ASSESSMENT
Generated: ${new Date().toLocaleDateString()}

OVERALL READINESS
Score: ${results.readinessScore.toFixed(0)}/100
Level: ${results.readinessLevel}

CURRENT PROFILE
Personal Credit Score: ${results.personalScore}
Business Credit Score: ${results.businessScore || 'Not established'}
Annual Revenue: $${results.revenue.toLocaleString()}
Debt-to-Income Ratio: ${results.dti}%
Time in Business: ${formData.monthsInBusiness} months

STRENGTHS
${results.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

ISSUES TO ADDRESS
${results.issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

RECOMMENDATIONS
${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SUITABLE FUNDING OPTIONS
${results.fundingOptions.map((o, i) => `${i + 1}. ${o}`).join('\n')}

---
This assessment is for guidance only. Actual funding eligibility varies by lender.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funding-readiness-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Income / FICO Readiness Check</h1>
            <p className="text-gray-400">Assess your readiness for business funding and financing</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Personal & Credit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Personal Credit Score</label>
                  <input
                    type="number"
                    value={formData.personalCreditScore}
                    onChange={(e) => setFormData({ ...formData, personalCreditScore: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="680"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Credit Score (if established)</label>
                  <input
                    type="number"
                    value={formData.businessCreditScore}
                    onChange={(e) => setFormData({ ...formData, businessCreditScore: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="75"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Late Payments (Last 12 Months)</label>
                  <input
                    type="number"
                    value={formData.latePayments}
                    onChange={(e) => setFormData({ ...formData, latePayments: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Active Collections?</label>
                  <select
                    value={formData.collections}
                    onChange={(e) => setFormData({ ...formData, collections: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bankruptcy History?</label>
                  <select
                    value={formData.bankruptcies}
                    onChange={(e) => setFormData({ ...formData, bankruptcies: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Annual Revenue</label>
                  <input
                    type="number"
                    value={formData.annualRevenue}
                    onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="100000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Months in Business</label>
                  <input
                    type="number"
                    value={formData.monthsInBusiness}
                    onChange={(e) => setFormData({ ...formData, monthsInBusiness: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="24"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Bank Balance</label>
                  <input
                    type="number"
                    value={formData.bankBalance}
                    onChange={(e) => setFormData({ ...formData, bankBalance: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Existing Business Debt</label>
                  <input
                    type="number"
                    value={formData.existingDebt}
                    onChange={(e) => setFormData({ ...formData, existingDebt: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Structure</label>
                  <select
                    value={formData.businessStructure}
                    onChange={(e) => setFormData({ ...formData, businessStructure: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="sole_proprietor">Sole Proprietorship</option>
                    <option value="llc">LLC</option>
                    <option value="corp">Corporation</option>
                    <option value="none">No Structure Yet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Have EIN?</label>
                  <select
                    value={formData.hasEIN}
                    onChange={(e) => setFormData({ ...formData, hasEIN: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Bank Account?</label>
                  <select
                    value={formData.hasBankAccount}
                    onChange={(e) => setFormData({ ...formData, hasBankAccount: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Button onClick={checkReadiness} className="w-full bg-[#D4AF37] hover:bg-[#C4A137]">
              Check Readiness
            </Button>
          </div>

          <div className="space-y-6">
            {!results ? (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-16">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Fill out the form to check your funding readiness</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className={`bg-gradient-to-br border-2 ${
                  results.readinessLevel === 'EXCELLENT' ? 'from-green-500/10 to-transparent border-green-500/50' :
                  results.readinessLevel === 'GOOD' ? 'from-blue-500/10 to-transparent border-blue-500/50' :
                  results.readinessLevel === 'FAIR' ? 'from-yellow-500/10 to-transparent border-yellow-500/50' :
                  'from-red-500/10 to-transparent border-red-500/50'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-white">Readiness Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-[#D4AF37] mb-2">
                        {results.readinessScore.toFixed(0)}
                      </div>
                      <p className="text-gray-400 mb-2">out of 100</p>
                      <div className={`text-2xl font-bold ${
                        results.readinessLevel === 'EXCELLENT' ? 'text-green-500' :
                        results.readinessLevel === 'GOOD' ? 'text-blue-500' :
                        results.readinessLevel === 'FAIR' ? 'text-yellow-500' :
                        'text-red-400'
                      }`}>
                        {results.readinessLevel}
                      </div>
                    </div>
                    <Button onClick={exportReport} variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>

                {results.strengths.length > 0 && (
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardHeader>
                      <CardTitle className="text-white">Your Strengths</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.strengths.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {results.issues.length > 0 && (
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardHeader>
                      <CardTitle className="text-white">Issues to Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <AlertTriangle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Suitable Funding Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.fundingOptions.map((option, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-[#D4AF37]">•</span>
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}