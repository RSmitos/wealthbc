import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Target, ArrowLeft, CheckCircle, DollarSign, Calendar, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AZEOTracker() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [targetBalance, setTargetBalance] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userCards = await base44.entities.CreditCard.filter({ user_id: currentUser.id });
      setCards(userCards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAZEO = () => {
    if (cards.length === 0) return null;

    const sortedByUtil = [...cards].sort((a, b) => {
      const utilA = (a.current_balance / a.credit_limit) * 100;
      const utilB = (b.current_balance / b.credit_limit) * 100;
      return utilA - utilB;
    });

    const totalLimit = cards.reduce((sum, c) => sum + c.credit_limit, 0);
    const idealBalance = parseFloat(targetBalance) || Math.min(100, totalLimit * 0.01);

    return {
      reportingCard: selectedCard || sortedByUtil[0],
      zeroCards: sortedByUtil.filter(c => c.id !== (selectedCard?.id || sortedByUtil[0].id)),
      idealBalance,
      totalUtilization: (idealBalance / totalLimit) * 100,
      plan: generatePlan(cards, selectedCard || sortedByUtil[0], idealBalance)
    };
  };

  const generatePlan = (allCards, reporting, targetBal) => {
    const plan = [];
    
    allCards.forEach(card => {
      if (card.id === reporting.id) {
        if (card.current_balance === 0) {
          plan.push({
            card: card.card_name,
            action: 'charge',
            amount: targetBal,
            timing: 'Before statement date',
            note: 'This will be your reporting balance'
          });
        } else if (card.current_balance > targetBal) {
          plan.push({
            card: card.card_name,
            action: 'pay_down',
            amount: card.current_balance - targetBal,
            timing: 'Before statement date',
            note: `Pay down to $${targetBal.toFixed(2)}`
          });
        } else {
          plan.push({
            card: card.card_name,
            action: 'charge_more',
            amount: targetBal - card.current_balance,
            timing: 'Before statement date',
            note: `Charge additional to reach $${targetBal.toFixed(2)}`
          });
        }
      } else {
        if (card.current_balance > 0) {
          plan.push({
            card: card.card_name,
            action: 'pay_zero',
            amount: card.current_balance,
            timing: 'Before statement date',
            note: 'Pay to $0 before statement cuts'
          });
        } else {
          plan.push({
            card: card.card_name,
            action: 'keep_zero',
            amount: 0,
            timing: 'Keep at zero',
            note: 'Do not use until after all statements report'
          });
        }
      }
    });

    return plan;
  };

  const azeoResults = calculateAZEO();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#D4AF37]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AZEO Plan Tracker</h1>
            <p className="text-gray-400">All Zero Except One - Optimize your credit utilization</p>
          </div>
        </div>

        {cards.length === 0 ? (
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Cards Found</h3>
              <p className="text-gray-400 mb-6">Add your credit cards to use the AZEO planner</p>
              <Link to={createPageUrl('CreditUtilizationTracker')}>
                <Button className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  Add Credit Cards
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Strategy Overview */}
            <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">What is AZEO?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  AZEO (All Zero Except One) is a strategy where you let only ONE card report a small balance, 
                  while all other cards report $0. This gives you the benefit of active utilization while 
                  keeping your overall usage extremely low.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-black/30 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
                    <h4 className="font-bold text-white mb-1">Ideal for Scores</h4>
                    <p className="text-sm text-gray-400">Can boost scores by 20-50 points</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <Target className="w-6 h-6 text-[#D4AF37] mb-2" />
                    <h4 className="font-bold text-white mb-1">Low Utilization</h4>
                    <p className="text-sm text-gray-400">Typically under 2% total usage</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-500 mb-2" />
                    <h4 className="font-bold text-white mb-1">Timing Matters</h4>
                    <p className="text-sm text-gray-400">Execute before statement dates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Select Reporting Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    Choose which card will carry a small balance
                  </p>
                  <div className="space-y-2">
                    {cards.map(card => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCard(card)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedCard?.id === card.id
                            ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]'
                            : 'bg-white/5 border border-white/10 hover:border-[#D4AF37]/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white">{card.card_name}</h4>
                            <p className="text-sm text-gray-400">
                              Limit: ${card.credit_limit.toLocaleString()}
                            </p>
                          </div>
                          {selectedCard?.id === card.id && (
                            <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardHeader>
                  <CardTitle className="text-white">Target Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-4">
                    How much should report on your selected card?
                  </p>
                  <input
                    type="number"
                    value={targetBalance}
                    onChange={(e) => setTargetBalance(e.target.value)}
                    placeholder="10"
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white mb-4"
                  />
                  <div className="space-y-2 text-sm">
                    <button
                      onClick={() => setTargetBalance('10')}
                      className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-300 text-left"
                    >
                      $10 (safest, most common)
                    </button>
                    <button
                      onClick={() => setTargetBalance('50')}
                      className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-300 text-left"
                    >
                      $50 (still very low)
                    </button>
                    <button
                      onClick={() => setTargetBalance('100')}
                      className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded text-gray-300 text-left"
                    >
                      $100 (shows activity)
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            {azeoResults && (
              <>
                <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white">AZEO Plan Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Overall Utilization</p>
                        <p className="text-3xl font-bold text-green-500">
                          {azeoResults.totalUtilization.toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Reporting Card</p>
                        <p className="text-xl font-bold text-white">
                          {azeoResults.reportingCard.card_name}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Reporting Balance</p>
                        <p className="text-3xl font-bold text-[#D4AF37]">
                          ${azeoResults.idealBalance.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-white mb-1">Important Timing</p>
                          <p className="text-sm text-gray-300">
                            Execute this plan 2-3 days BEFORE each card's statement date. 
                            After all statements report, you can use your cards normally again.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Your Action Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {azeoResults.plan.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white/5 border border-white/10 rounded-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-white">{step.card}</h4>
                                {step.amount > 0 && (
                                  <span className="text-[#D4AF37] font-bold">
                                    ${step.amount.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-300 mb-1">{step.note}</p>
                              <p className="text-xs text-gray-500">Timing: {step.timing}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Tips */}
            <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">AZEO Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-white mb-2">✓ Know Statement Dates</h4>
                    <p className="text-sm text-gray-400">Track when each card reports to bureaus</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">✓ Rotate Cards</h4>
                    <p className="text-sm text-gray-400">You can change which card reports each month</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">✓ Under $10 Works</h4>
                    <p className="text-sm text-gray-400">Even $1-5 is effective for AZEO</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2">✓ Use After</h4>
                    <p className="text-sm text-gray-400">Resume normal usage after all statements cut</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}