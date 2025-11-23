import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Users, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthorizedUserCalculator() {
  const [currentScore, setCurrentScore] = useState('');
  const [accountAge, setAccountAge] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [paymentHistory, setPaymentHistory] = useState('perfect');
  const [primaryHolderScore, setPrimaryHolderScore] = useState('');
  
  const [results, setResults] = useState(null);

  const calculateImpact = () => {
    const score = parseInt(currentScore);
    const age = parseInt(accountAge);
    const limit = parseFloat(creditLimit);
    const balance = parseFloat(currentBalance);
    const primaryScore = parseInt(primaryHolderScore);

    if (!score || !age || !limit || balance === undefined) {
      alert('Please fill in all required fields');
      return;
    }

    const utilization = (balance / limit) * 100;
    
    // Calculate potential score impact
    let scoreImpact = 0;
    let impactFactors = [];

    // Account age impact (0-35 points)
    if (age >= 10) {
      scoreImpact += 25 + Math.min(10, age - 10);
      impactFactors.push({ factor: 'Excellent Account Age', points: 25, positive: true });
    } else if (age >= 5) {
      scoreImpact += 15;
      impactFactors.push({ factor: 'Good Account Age', points: 15, positive: true });
    } else if (age >= 2) {
      scoreImpact += 8;
      impactFactors.push({ factor: 'Moderate Account Age', points: 8, positive: true });
    }

    // Utilization impact (0-30 points)
    if (utilization <= 10) {
      scoreImpact += 30;
      impactFactors.push({ factor: 'Excellent Utilization', points: 30, positive: true });
    } else if (utilization <= 30) {
      scoreImpact += 20;
      impactFactors.push({ factor: 'Good Utilization', points: 20, positive: true });
    } else if (utilization <= 50) {
      scoreImpact += 10;
      impactFactors.push({ factor: 'Fair Utilization', points: 10, positive: true });
    } else {
      scoreImpact -= 15;
      impactFactors.push({ factor: 'High Utilization', points: -15, positive: false });
    }

    // Payment history impact (0-25 points)
    if (paymentHistory === 'perfect') {
      scoreImpact += 25;
      impactFactors.push({ factor: 'Perfect Payment History', points: 25, positive: true });
    } else if (paymentHistory === 'good') {
      scoreImpact += 15;
      impactFactors.push({ factor: 'Good Payment History', points: 15, positive: true });
    } else {
      scoreImpact -= 20;
      impactFactors.push({ factor: 'Late Payments Present', points: -20, positive: false });
    }

    // Credit limit impact (0-20 points)
    if (limit >= 10000) {
      scoreImpact += 20;
      impactFactors.push({ factor: 'High Credit Limit', points: 20, positive: true });
    } else if (limit >= 5000) {
      scoreImpact += 12;
      impactFactors.push({ factor: 'Good Credit Limit', points: 12, positive: true });
    } else if (limit >= 2000) {
      scoreImpact += 5;
      impactFactors.push({ factor: 'Moderate Credit Limit', points: 5, positive: true });
    }

    // Primary holder score factor
    if (primaryScore < 700) {
      scoreImpact -= 10;
      impactFactors.push({ factor: 'Primary Holder Score Below 700', points: -10, positive: false });
    }

    // Apply diminishing returns for higher scores
    if (score > 700) {
      scoreImpact = scoreImpact * 0.7;
    } else if (score > 650) {
      scoreImpact = scoreImpact * 0.85;
    }

    const estimatedNewScore = Math.min(850, Math.max(300, score + Math.round(scoreImpact)));
    
    // Determine recommendation
    let recommendation = '';
    let shouldAdd = true;

    if (utilization > 50) {
      recommendation = 'HIGH RISK: High utilization may hurt your score. Wait until balance is lower.';
      shouldAdd = false;
    } else if (paymentHistory === 'late') {
      recommendation = 'CAUTION: Late payments may negatively impact your score.';
      shouldAdd = false;
    } else if (age < 2) {
      recommendation = 'WAIT: Account is too new. Best results come from accounts 2+ years old.';
      shouldAdd = false;
    } else if (scoreImpact >= 20) {
      recommendation = 'EXCELLENT CHOICE: This account should significantly boost your score.';
      shouldAdd = true;
    } else if (scoreImpact >= 10) {
      recommendation = 'GOOD CHOICE: This account should provide moderate score improvement.';
      shouldAdd = true;
    } else {
      recommendation = 'MARGINAL BENEFIT: This account may provide minimal score improvement.';
      shouldAdd = true;
    }

    setResults({
      currentScore: score,
      estimatedNewScore,
      scoreChange: Math.round(scoreImpact),
      utilization,
      impactFactors,
      recommendation,
      shouldAdd,
      timeline: '30-60 days after being added'
    });
  };

  const exportResults = () => {
    if (!results) return;

    const report = `AUTHORIZED USER SCORE IMPACT ANALYSIS
Generated: ${new Date().toLocaleDateString()}

CURRENT INFORMATION
Current Score: ${results.currentScore}
Account Age: ${accountAge} years
Credit Limit: $${parseFloat(creditLimit).toLocaleString()}
Current Balance: $${parseFloat(currentBalance).toLocaleString()}
Utilization: ${results.utilization.toFixed(1)}%
Payment History: ${paymentHistory}

ESTIMATED IMPACT
Score Change: ${results.scoreChange >= 0 ? '+' : ''}${results.scoreChange} points
Estimated New Score: ${results.estimatedNewScore}
Timeline: ${results.timeline}

IMPACT FACTORS
${results.impactFactors.map(f => `${f.positive ? '✓' : '✗'} ${f.factor}: ${f.points >= 0 ? '+' : ''}${f.points} points`).join('\n')}

RECOMMENDATION
${results.recommendation}
${results.shouldAdd ? '✓ RECOMMENDED' : '✗ NOT RECOMMENDED'}

---
This is an estimate based on typical scoring models. Actual results may vary.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `au-impact-estimate-${new Date().toISOString().split('T')[0]}.txt`;
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
            <h1 className="text-4xl font-bold text-white mb-2">Authorized User Impact Calculator</h1>
            <p className="text-gray-400">Estimate the potential score boost from being added as an authorized user</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">What is an Authorized User?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Being added as an authorized user (AU) on someone else's credit card can boost your score by 
              inheriting that account's positive history, age, and credit limit. This is also known as "piggybacking."
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <Users className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">How It Works</h4>
                <p className="text-sm text-gray-400">Account appears on your credit report</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Potential Boost</h4>
                <p className="text-sm text-gray-400">10-100+ point increase possible</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">No Liability</h4>
                <p className="text-sm text-gray-400">You're not responsible for debt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Current Credit Score *</label>
                <input
                  type="number"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="650"
                  min="300"
                  max="850"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-4">Account Details (To Be Added To)</h3>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Account Age (Years) *</label>
                <input
                  type="number"
                  value={accountAge}
                  onChange={(e) => setAccountAge(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="5"
                  min="0"
                  step="0.5"
                />
                <p className="text-xs text-gray-500 mt-1">Older accounts = better impact</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Credit Limit *</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="10000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Balance *</label>
                <input
                  type="number"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Payment History</label>
                <select
                  value={paymentHistory}
                  onChange={(e) => setPaymentHistory(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                >
                  <option value="perfect">Perfect (No late payments)</option>
                  <option value="good">Good (1-2 late payments ever)</option>
                  <option value="late">Has Recent Late Payments</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Primary Holder's Score</label>
                <input
                  type="number"
                  value={primaryHolderScore}
                  onChange={(e) => setPrimaryHolderScore(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="750"
                  min="300"
                  max="850"
                />
              </div>

              <Button onClick={calculateImpact} className="w-full bg-[#D4AF37] hover:bg-[#C4A137]">
                Calculate Impact
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {!results ? (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Fill out the form to see estimated impact</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className={`bg-gradient-to-br border-2 ${
                  results.shouldAdd 
                    ? 'from-green-500/10 to-transparent border-green-500/50'
                    : 'from-red-500/10 to-transparent border-red-500/50'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-white">Estimated Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-400">Current</p>
                          <p className="text-3xl font-bold text-white">{results.currentScore}</p>
                        </div>
                        <div className="text-4xl text-gray-500">→</div>
                        <div>
                          <p className="text-sm text-gray-400">Estimated</p>
                          <p className="text-3xl font-bold text-[#D4AF37]">{results.estimatedNewScore}</p>
                        </div>
                      </div>
                      <div className={`text-2xl font-bold ${
                        results.scoreChange > 0 ? 'text-green-500' : 'text-red-400'
                      }`}>
                        {results.scoreChange >= 0 ? '+' : ''}{results.scoreChange} points
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{results.timeline}</p>
                    </div>

                    <div className={`p-4 rounded-lg border ${
                      results.shouldAdd
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        {results.shouldAdd ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white mb-1">
                            {results.shouldAdd ? 'RECOMMENDED' : 'NOT RECOMMENDED'}
                          </p>
                          <p className="text-sm text-gray-300">{results.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Impact Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.impactFactors.map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center gap-2">
                            {factor.positive ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-white text-sm">{factor.factor}</span>
                          </div>
                          <span className={`font-bold ${
                            factor.positive ? 'text-green-500' : 'text-red-400'
                          }`}>
                            {factor.points >= 0 ? '+' : ''}{factor.points}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-1">Account Utilization</p>
                      <p className="text-2xl font-bold text-white">{results.utilization.toFixed(1)}%</p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            results.utilization <= 10 ? 'bg-green-500' :
                            results.utilization <= 30 ? 'bg-yellow-500' :
                            'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(100, results.utilization)}%` }}
                        />
                      </div>
                    </div>
                    <Button onClick={exportResults} variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Export Report
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Authorized User Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Choose Old Accounts</h4>
                <p className="text-sm text-gray-400">Accounts 5+ years old provide the best boost</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Low Utilization</h4>
                <p className="text-sm text-gray-400">Under 10% utilization is ideal</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Perfect Payment History</h4>
                <p className="text-sm text-gray-400">Never miss a payment on the primary account</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}