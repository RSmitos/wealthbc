import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  PieChart, ArrowLeft, TrendingUp, AlertCircle, CheckCircle, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreditMixOptimizer() {
  const [accounts, setAccounts] = useState({
    creditCards: '',
    storeCards: '',
    personalLoans: '',
    autoLoans: '',
    mortgages: '',
    studentLoans: '',
    otherInstallment: ''
  });

  const [results, setResults] = useState(null);

  const analyzeCreditMix = () => {
    const creditCards = parseInt(accounts.creditCards) || 0;
    const storeCards = parseInt(accounts.storeCards) || 0;
    const personalLoans = parseInt(accounts.personalLoans) || 0;
    const autoLoans = parseInt(accounts.autoLoans) || 0;
    const mortgages = parseInt(accounts.mortgages) || 0;
    const studentLoans = parseInt(accounts.studentLoans) || 0;
    const otherInstallment = parseInt(accounts.otherInstallment) || 0;

    const totalRevolving = creditCards + storeCards;
    const totalInstallment = personalLoans + autoLoans + mortgages + studentLoans + otherInstallment;
    const totalAccounts = totalRevolving + totalInstallment;

    if (totalAccounts === 0) {
      alert('Please enter at least one account');
      return;
    }

    const revolvingPercent = (totalRevolving / totalAccounts) * 100;
    const installmentPercent = (totalInstallment / totalAccounts) * 100;

    let mixScore = 0;
    let maxScore = 100;
    let strengths = [];
    let issues = [];
    let recommendations = [];

    // Ideal mix is 60-70% revolving, 30-40% installment
    
    // Account Diversity (40 points)
    const accountTypes = [
      creditCards > 0,
      personalLoans > 0 || otherInstallment > 0,
      autoLoans > 0,
      mortgages > 0
    ].filter(Boolean).length;

    if (accountTypes >= 3) {
      mixScore += 40;
      strengths.push('Excellent account diversity');
    } else if (accountTypes === 2) {
      mixScore += 25;
      strengths.push('Good account diversity');
      recommendations.push('Consider adding another account type for optimal mix');
    } else {
      mixScore += 10;
      issues.push('Limited account diversity');
      recommendations.push('Add different types of credit accounts');
    }

    // Revolving vs Installment Balance (35 points)
    if (revolvingPercent >= 55 && revolvingPercent <= 75) {
      mixScore += 35;
      strengths.push('Optimal revolving/installment ratio');
    } else if (revolvingPercent >= 40 && revolvingPercent <= 85) {
      mixScore += 25;
      strengths.push('Good revolving/installment balance');
    } else if (revolvingPercent >= 25 && revolvingPercent <= 90) {
      mixScore += 15;
      issues.push('Suboptimal credit mix ratio');
      if (revolvingPercent < 55) {
        recommendations.push('Consider adding revolving accounts (credit cards)');
      } else {
        recommendations.push('Consider adding installment loans');
      }
    } else {
      mixScore += 5;
      issues.push('Poor credit mix balance');
      if (revolvingPercent < 25) {
        recommendations.push('You need more revolving credit accounts');
      } else {
        recommendations.push('You need installment loans for better mix');
      }
    }

    // Total Account Count (25 points)
    if (totalAccounts >= 7) {
      mixScore += 25;
      strengths.push('Optimal number of accounts');
    } else if (totalAccounts >= 4) {
      mixScore += 20;
      strengths.push('Good number of accounts');
    } else if (totalAccounts >= 2) {
      mixScore += 12;
      issues.push('Low account count');
      recommendations.push('Gradually add accounts to reach 7-10 total');
    } else {
      mixScore += 5;
      issues.push('Very few credit accounts');
      recommendations.push('Start building credit with 2-3 accounts');
    }

    // Specific recommendations based on what's missing
    if (creditCards === 0 && storeCards === 0) {
      recommendations.push('Get at least 2-3 credit cards for revolving credit');
    }
    if (personalLoans === 0 && autoLoans === 0 && mortgages === 0 && otherInstallment === 0) {
      recommendations.push('Add an installment loan (personal loan, auto, etc.)');
    }
    if (totalRevolving > 0 && totalInstallment === 0) {
      recommendations.push('Credit-builder loan or personal loan would improve mix');
    }
    if (totalInstallment > 0 && totalRevolving === 0) {
      recommendations.push('2-3 credit cards would significantly improve your mix');
    }

    // Ideal mix suggestion
    const idealRevolving = Math.round(totalAccounts * 0.65);
    const idealInstallment = Math.round(totalAccounts * 0.35);
    const needMoreRevolving = totalRevolving < idealRevolving;
    const needMoreInstallment = totalInstallment < idealInstallment;

    let nextStep = '';
    if (needMoreRevolving && needMoreInstallment) {
      nextStep = 'Add both revolving and installment accounts';
    } else if (needMoreRevolving) {
      nextStep = `Add ${idealRevolving - totalRevolving} more revolving account(s)`;
    } else if (needMoreInstallment) {
      nextStep = `Add ${idealInstallment - totalInstallment} more installment account(s)`;
    } else {
      nextStep = 'Your mix is well-balanced';
    }

    setResults({
      mixScore,
      totalAccounts,
      totalRevolving,
      totalInstallment,
      revolvingPercent: revolvingPercent.toFixed(1),
      installmentPercent: installmentPercent.toFixed(1),
      strengths,
      issues,
      recommendations,
      nextStep,
      breakdown: {
        creditCards,
        storeCards,
        personalLoans,
        autoLoans,
        mortgages,
        studentLoans,
        otherInstallment
      }
    });
  };

  const exportAnalysis = () => {
    if (!results) return;

    const report = `CREDIT MIX ANALYSIS
Generated: ${new Date().toLocaleDateString()}

MIX SCORE: ${results.mixScore}/100

CURRENT CREDIT MIX
Total Accounts: ${results.totalAccounts}
Revolving Credit: ${results.totalRevolving} accounts (${results.revolvingPercent}%)
  - Credit Cards: ${results.breakdown.creditCards}
  - Store Cards: ${results.breakdown.storeCards}
Installment Credit: ${results.totalInstallment} accounts (${results.installmentPercent}%)
  - Personal Loans: ${results.breakdown.personalLoans}
  - Auto Loans: ${results.breakdown.autoLoans}
  - Mortgages: ${results.breakdown.mortgages}
  - Student Loans: ${results.breakdown.studentLoans}
  - Other Installment: ${results.breakdown.otherInstallment}

IDEAL MIX
Revolving: 60-70% of accounts
Installment: 30-40% of accounts
Total Accounts: 7-10 accounts

STRENGTHS
${results.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS FOR IMPROVEMENT
${results.issues.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

RECOMMENDATIONS
${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

NEXT STEP: ${results.nextStep}

---
Credit mix accounts for 10% of your FICO score.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-mix-analysis-${new Date().toISOString().split('T')[0]}.txt`;
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
            <h1 className="text-4xl font-bold text-white mb-2">Credit Mix Optimizer</h1>
            <p className="text-gray-400">Analyze and optimize your revolving vs installment credit mix</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Why Credit Mix Matters</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Credit mix accounts for 10% of your FICO score. Having both revolving credit (credit cards) 
              and installment loans (mortgages, auto loans, personal loans) shows lenders you can manage 
              different types of credit responsibly.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Revolving Credit</h4>
                <p className="text-sm text-gray-400">Credit cards, lines of credit - balances vary monthly</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Installment Credit</h4>
                <p className="text-sm text-gray-400">Fixed loans - auto, mortgage, personal loans</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <h4 className="font-bold text-white mb-1">Ideal Mix</h4>
                <p className="text-sm text-gray-400">60-70% revolving, 30-40% installment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Your Credit Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="pb-4 border-b border-white/10">
                <h3 className="text-white font-bold mb-4">Revolving Credit</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Credit Cards</label>
                    <input
                      type="number"
                      value={accounts.creditCards}
                      onChange={(e) => setAccounts({ ...accounts, creditCards: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Store Cards</label>
                    <input
                      type="number"
                      value={accounts.storeCards}
                      onChange={(e) => setAccounts({ ...accounts, storeCards: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-white font-bold mb-4">Installment Credit</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Personal Loans</label>
                    <input
                      type="number"
                      value={accounts.personalLoans}
                      onChange={(e) => setAccounts({ ...accounts, personalLoans: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Auto Loans</label>
                    <input
                      type="number"
                      value={accounts.autoLoans}
                      onChange={(e) => setAccounts({ ...accounts, autoLoans: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Mortgages</label>
                    <input
                      type="number"
                      value={accounts.mortgages}
                      onChange={(e) => setAccounts({ ...accounts, mortgages: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Student Loans</label>
                    <input
                      type="number"
                      value={accounts.studentLoans}
                      onChange={(e) => setAccounts({ ...accounts, studentLoans: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Other Installment</label>
                    <input
                      type="number"
                      value={accounts.otherInstallment}
                      onChange={(e) => setAccounts({ ...accounts, otherInstallment: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={analyzeCreditMix} className="w-full bg-[#D4AF37] hover:bg-[#C4A137]">
                Analyze Mix
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!results ? (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-16">
                  <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Enter your account counts to analyze your credit mix</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Mix Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-[#D4AF37] mb-2">
                        {results.mixScore}
                      </div>
                      <p className="text-gray-400">out of 100</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Revolving</p>
                        <p className="text-2xl font-bold text-white">{results.revolvingPercent}%</p>
                        <p className="text-xs text-gray-500">{results.totalRevolving} accounts</p>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Installment</p>
                        <p className="text-2xl font-bold text-white">{results.installmentPercent}%</p>
                        <p className="text-xs text-gray-500">{results.totalInstallment} accounts</p>
                      </div>
                    </div>
                    <Button onClick={exportAnalysis} variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Export Analysis
                    </Button>
                  </CardContent>
                </Card>

                {results.strengths.length > 0 && (
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardHeader>
                      <CardTitle className="text-white">Strengths</CardTitle>
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
                      <CardTitle className="text-white">Areas to Improve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {results.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {results.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <TrendingUp className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                      <p className="font-bold text-white mb-1">Next Step:</p>
                      <p className="text-sm text-gray-300">{results.nextStep}</p>
                    </div>
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