import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  BarChart3, ArrowLeft, Download, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Target, Award, Clock, DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreditProfileAnalyzer() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [debts, setDebts] = useState([]);

  const [profile, setProfile] = useState({
    credit_score: '',
    num_accounts: '',
    oldest_account_years: '',
    payment_history_percent: '',
    hard_inquiries: '',
    derogatory_marks: '',
    total_credit_limit: '',
    total_balance: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userCards = await base44.entities.CreditCard.filter({ user_id: currentUser.id });
      setCards(userCards);
      
      const userDebts = await base44.entities.DebtAccount.filter({ user_id: currentUser.id });
      setDebts(userDebts);

      // Auto-populate from existing data
      if (userCards.length > 0) {
        const totalLimit = userCards.reduce((sum, c) => sum + c.credit_limit, 0);
        const totalBalance = userCards.reduce((sum, c) => sum + c.current_balance, 0);
        setProfile(prev => ({
          ...prev,
          total_credit_limit: totalLimit,
          total_balance: totalBalance
        }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeProfile = () => {
    const score = parseInt(profile.credit_score) || 0;
    const accounts = parseInt(profile.num_accounts) || 0;
    const oldestYears = parseFloat(profile.oldest_account_years) || 0;
    const paymentHistory = parseFloat(profile.payment_history_percent) || 0;
    const inquiries = parseInt(profile.hard_inquiries) || 0;
    const derogatories = parseInt(profile.derogatory_marks) || 0;
    const totalLimit = parseFloat(profile.total_credit_limit) || 0;
    const totalBalance = parseFloat(profile.total_balance) || 0;

    if (score === 0) return null;

    const utilization = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

    // Score breakdown
    const scoreBreakdown = {
      payment_history: Math.min(35, (paymentHistory / 100) * 35),
      utilization: Math.min(30, utilization <= 10 ? 30 : utilization <= 30 ? 25 : 15),
      credit_age: Math.min(15, oldestYears >= 7 ? 15 : oldestYears >= 3 ? 10 : 5),
      credit_mix: Math.min(10, accounts >= 10 ? 10 : accounts >= 5 ? 7 : 5),
      new_credit: Math.min(10, inquiries === 0 ? 10 : inquiries <= 2 ? 7 : 4)
    };

    const totalFactors = Object.values(scoreBreakdown).reduce((sum, val) => sum + val, 0);

    // Impact factors
    const impacts = {
      positive: [],
      negative: [],
      recommendations: []
    };

    // Positive factors
    if (paymentHistory >= 95) impacts.positive.push('Excellent payment history (95%+)');
    if (utilization <= 10) impacts.positive.push('Optimal credit utilization (≤10%)');
    if (oldestYears >= 7) impacts.positive.push('Strong credit age (7+ years)');
    if (inquiries === 0) impacts.positive.push('No recent hard inquiries');
    if (derogatories === 0) impacts.positive.push('Clean credit report (no derogatory marks)');

    // Negative factors
    if (paymentHistory < 90) impacts.negative.push('Payment history below 90%');
    if (utilization > 30) impacts.negative.push('High credit utilization (>30%)');
    if (oldestYears < 2) impacts.negative.push('Limited credit history (<2 years)');
    if (inquiries > 3) impacts.negative.push(`Too many hard inquiries (${inquiries})`);
    if (derogatories > 0) impacts.negative.push(`${derogatories} derogatory mark(s) on file`);
    if (accounts < 3) impacts.negative.push('Limited credit mix');

    // Recommendations
    if (utilization > 30) impacts.recommendations.push('Pay down balances to under 30% utilization');
    if (utilization > 10 && utilization <= 30) impacts.recommendations.push('Target under 10% utilization for best scores');
    if (paymentHistory < 100) impacts.recommendations.push('Set up automatic payments to ensure 100% on-time history');
    if (accounts < 5) impacts.recommendations.push('Consider adding 1-2 new accounts for better credit mix');
    if (inquiries > 2) impacts.recommendations.push('Avoid new credit applications for 6-12 months');
    if (derogatories > 0) impacts.recommendations.push('Dispute any inaccurate derogatory marks immediately');
    if (oldestYears < 5) impacts.recommendations.push('Keep oldest accounts open to build credit age');

    // Score potential
    let potentialScore = score;
    if (utilization > 10) potentialScore += Math.min(30, (utilization - 10) * 2);
    if (paymentHistory < 100) potentialScore += Math.min(20, (100 - paymentHistory) * 2);
    if (derogatories > 0) potentialScore += derogatories * 30;

    return {
      currentScore: score,
      utilization: utilization.toFixed(1),
      scoreBreakdown,
      totalFactors,
      impacts,
      potentialScore: Math.min(850, Math.round(potentialScore)),
      scoreGrade: getScoreGrade(score),
      healthScore: calculateHealthScore(profile)
    };
  };

  const getScoreGrade = (score) => {
    if (score >= 800) return { grade: 'Exceptional', color: 'text-green-500' };
    if (score >= 740) return { grade: 'Very Good', color: 'text-blue-500' };
    if (score >= 670) return { grade: 'Good', color: 'text-yellow-500' };
    if (score >= 580) return { grade: 'Fair', color: 'text-orange-500' };
    return { grade: 'Poor', color: 'text-red-500' };
  };

  const calculateHealthScore = (data) => {
    let health = 0;
    const score = parseInt(data.credit_score) || 0;
    const util = parseFloat(data.total_credit_limit) > 0 
      ? (parseFloat(data.total_balance) / parseFloat(data.total_credit_limit)) * 100 
      : 0;

    if (score >= 700) health += 30;
    else if (score >= 650) health += 20;
    else if (score >= 600) health += 10;

    if (util <= 10) health += 25;
    else if (util <= 30) health += 15;
    else if (util <= 50) health += 5;

    const payment = parseFloat(data.payment_history_percent) || 0;
    if (payment >= 95) health += 25;
    else if (payment >= 90) health += 15;

    const inquiries = parseInt(data.hard_inquiries) || 0;
    if (inquiries === 0) health += 10;
    else if (inquiries <= 2) health += 5;

    const derogs = parseInt(data.derogatory_marks) || 0;
    if (derogs === 0) health += 10;

    return health;
  };

  const exportReport = () => {
    const analysis = analyzeProfile();
    if (!analysis) return;

    const content = `
CREDIT PROFILE ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}

OVERVIEW:
Credit Score: ${analysis.currentScore}
Grade: ${analysis.scoreGrade.grade}
Overall Health Score: ${analysis.healthScore}/100
Credit Utilization: ${analysis.utilization}%

SCORE BREAKDOWN:
Payment History (35%): ${analysis.scoreBreakdown.payment_history.toFixed(1)}/35
Credit Utilization (30%): ${analysis.scoreBreakdown.utilization.toFixed(1)}/30
Length of History (15%): ${analysis.scoreBreakdown.credit_age.toFixed(1)}/15
Credit Mix (10%): ${analysis.scoreBreakdown.credit_mix.toFixed(1)}/10
New Credit (10%): ${analysis.scoreBreakdown.new_credit.toFixed(1)}/10

POSITIVE FACTORS:
${analysis.impacts.positive.map((p, i) => `${i + 1}. ${p}`).join('\n')}

NEGATIVE FACTORS:
${analysis.impacts.negative.map((n, i) => `${i + 1}. ${n}`).join('\n')}

RECOMMENDATIONS:
${analysis.impacts.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

SCORE POTENTIAL:
Current: ${analysis.currentScore}
Potential (with improvements): ${analysis.potentialScore}
Potential Gain: ${analysis.potentialScore - analysis.currentScore} points
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const analysis = analyzeProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Credit Profile Analyzer</h1>
              <p className="text-gray-400">Comprehensive analysis of your credit profile</p>
            </div>
            <Button onClick={exportReport} variant="outline" className="gap-2" disabled={!analysis}>
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div>
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Your Credit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credit Score *</label>
                  <input
                    type="number"
                    min="300"
                    max="850"
                    value={profile.credit_score}
                    onChange={(e) => setProfile({ ...profile, credit_score: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="680"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Number of Accounts</label>
                  <input
                    type="number"
                    value={profile.num_accounts}
                    onChange={(e) => setProfile({ ...profile, num_accounts: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Oldest Account (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={profile.oldest_account_years}
                    onChange={(e) => setProfile({ ...profile, oldest_account_years: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="5.5"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Payment History (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={profile.payment_history_percent}
                    onChange={(e) => setProfile({ ...profile, payment_history_percent: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="95"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Hard Inquiries (Last 12mo)</label>
                  <input
                    type="number"
                    value={profile.hard_inquiries}
                    onChange={(e) => setProfile({ ...profile, hard_inquiries: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Derogatory Marks</label>
                  <input
                    type="number"
                    value={profile.derogatory_marks}
                    onChange={(e) => setProfile({ ...profile, derogatory_marks: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total Credit Limit</label>
                  <input
                    type="number"
                    value={profile.total_credit_limit}
                    onChange={(e) => setProfile({ ...profile, total_credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Total Balance</label>
                  <input
                    type="number"
                    value={profile.total_balance}
                    onChange={(e) => setProfile({ ...profile, total_balance: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="5000"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-6">
            {analysis ? (
              <>
                {/* Score Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                    <CardContent className="text-center py-6">
                      <p className="text-sm text-gray-400 mb-2">Credit Score</p>
                      <div className={`text-4xl font-bold mb-1 ${analysis.scoreGrade.color}`}>
                        {analysis.currentScore}
                      </div>
                      <p className={`text-sm ${analysis.scoreGrade.color}`}>{analysis.scoreGrade.grade}</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardContent className="text-center py-6">
                      <p className="text-sm text-gray-400 mb-2">Health Score</p>
                      <div className="text-4xl font-bold text-white mb-1">{analysis.healthScore}</div>
                      <p className="text-sm text-gray-500">out of 100</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardContent className="text-center py-6">
                      <p className="text-sm text-gray-400 mb-2">Utilization</p>
                      <div className={`text-4xl font-bold mb-1 ${
                        parseFloat(analysis.utilization) <= 10 ? 'text-green-500' :
                        parseFloat(analysis.utilization) <= 30 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {analysis.utilization}%
                      </div>
                      <p className="text-sm text-gray-500">credit usage</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Score Breakdown */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Score Factor Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(analysis.scoreBreakdown).map(([key, value]) => {
                      const maxValues = { payment_history: 35, utilization: 30, credit_age: 15, credit_mix: 10, new_credit: 10 };
                      const percent = (value / maxValues[key]) * 100;
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">
                              {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="text-white">{value.toFixed(1)}/{maxValues[key]}</span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                percent >= 80 ? 'bg-green-500' :
                                percent >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Positive & Negative Factors */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-900/20 to-transparent border-green-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Positive Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysis.impacts.positive.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.impacts.positive.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-500 mt-1">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No strong positive factors identified</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-red-900/20 to-transparent border-red-500/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Negative Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysis.impacts.negative.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.impacts.negative.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-red-400 mt-1">✗</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No major negative factors!</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-[#D4AF37]" />
                      Action Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.impacts.recommendations.length > 0 ? (
                      <ul className="space-y-3">
                        {analysis.impacts.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-xs font-bold">
                              {idx + 1}
                            </span>
                            <span className="text-gray-300">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-300">Your profile is strong! Continue current practices.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Score Potential */}
                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Score Potential</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Current</p>
                        <p className="text-3xl font-bold text-white">{analysis.currentScore}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-[#D4AF37]" />
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Potential</p>
                        <p className="text-3xl font-bold text-green-500">{analysis.potentialScore}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-400 mb-1">Gain</p>
                        <p className="text-3xl font-bold text-[#D4AF37]">+{analysis.potentialScore - analysis.currentScore}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-4 text-center">
                      Follow the action plan to potentially gain {analysis.potentialScore - analysis.currentScore} points
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-24">
                  <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Enter Your Profile</h3>
                  <p className="text-gray-400">Fill out your credit information to see detailed analysis</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}