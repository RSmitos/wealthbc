import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  CreditCard, ArrowLeft, TrendingUp, CheckCircle, Download, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SecuredCardBuilder() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    bank_name: '',
    deposit_amount: '',
    credit_limit: '',
    open_date: '',
    graduation_timeline: '',
    current_status: 'secured',
    graduated: false,
    graduation_date: '',
    notes: ''
  });

  const recommendedCards = [
    {
      name: 'Discover it® Secured',
      minDeposit: 200,
      features: ['Cash back rewards', 'FICO score access', 'No annual fee', 'Graduates to unsecured'],
      graduationTime: '8 months'
    },
    {
      name: 'Capital One Platinum Secured',
      minDeposit: 49,
      features: ['Low minimum deposit', 'Reports to all 3 bureaus', 'Automatic reviews for graduation'],
      graduationTime: '6-12 months'
    },
    {
      name: 'Citi® Secured Mastercard®',
      minDeposit: 200,
      features: ['No annual fee', 'Reports to all bureaus', 'Access to Citi benefits'],
      graduationTime: '18 months'
    },
    {
      name: 'Bank of America® Secured',
      minDeposit: 300,
      features: ['Graduate as early as 12 months', 'Fraud protection', 'Mobile banking'],
      graduationTime: '12+ months'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userCards = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'secured_card'
      });
      setCards(userCards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cardData = {
        user_id: user.id,
        calculator_type: 'secured_card',
        scenario_name: `${formData.bank_name} - Secured Card`,
        input_data: formData,
        output_data: calculateProgress(formData)
      };

      await base44.entities.CalculatorScenario.create(cardData);
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const calculateProgress = (card) => {
    if (!card.open_date) return {};

    const openDate = new Date(card.open_date);
    const today = new Date();
    const monthsOpen = Math.floor((today - openDate) / (1000 * 60 * 60 * 24 * 30));
    
    const targetMonths = parseInt(card.graduation_timeline) || 12;
    const progressPercent = Math.min(100, (monthsOpen / targetMonths) * 100);

    let readyToGraduate = monthsOpen >= targetMonths;
    let nextMilestone = '';

    if (monthsOpen < 6) {
      nextMilestone = `${6 - monthsOpen} months until 6-month review`;
    } else if (monthsOpen < targetMonths) {
      nextMilestone = `${targetMonths - monthsOpen} months until graduation eligibility`;
    } else if (!card.graduated) {
      nextMilestone = 'Ready to request graduation';
    } else {
      nextMilestone = 'Graduated to unsecured';
    }

    return {
      monthsOpen,
      progressPercent: progressPercent.toFixed(1),
      readyToGraduate,
      nextMilestone
    };
  };

  const resetForm = () => {
    setFormData({
      bank_name: '',
      deposit_amount: '',
      credit_limit: '',
      open_date: '',
      graduation_timeline: '',
      current_status: 'secured',
      graduated: false,
      graduation_date: '',
      notes: ''
    });
    setShowAddForm(false);
  };

  const exportStrategy = () => {
    const report = `SECURED CARD GRADUATION STRATEGY
Generated: ${new Date().toLocaleDateString()}

YOUR SECURED CARDS
${'='.repeat(60)}

${cards.map((card, idx) => {
  const data = card.input_data;
  const progress = card.output_data;
  return `
${idx + 1}. ${data.bank_name}
   Deposit: $${parseFloat(data.deposit_amount).toLocaleString()}
   Credit Limit: $${parseFloat(data.credit_limit).toLocaleString()}
   Opened: ${data.open_date}
   Months Open: ${progress.monthsOpen}
   Progress: ${progress.progressPercent}%
   Status: ${data.graduated ? 'GRADUATED' : 'SECURED'}
   Next Milestone: ${progress.nextMilestone}
   ${data.notes ? `Notes: ${data.notes}` : ''}
${'='.repeat(60)}`;
}).join('\n')}

GRADUATION CHECKLIST:
□ Make on-time payments for 6-12 months
□ Keep utilization under 30%
□ Build positive payment history
□ Request graduation after timeline
□ Get deposit refunded upon graduation

TIPS FOR SUCCESS:
- Use the card for small purchases monthly
- Pay in full every month
- Keep utilization low (under 10% is ideal)
- Set up autopay to never miss payment
- Request graduation proactively after timeline`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secured-card-strategy-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

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
              <h1 className="text-4xl font-bold text-white mb-2">Secured Card Builder</h1>
              <p className="text-gray-400">Track your secured cards and plan graduation to unsecured</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportStrategy} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Strategy
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                Add Secured Card
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">What is a Secured Credit Card?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Secured cards require a cash deposit that becomes your credit limit. They're perfect for building 
              or rebuilding credit. After 6-18 months of responsible use, many secured cards graduate to unsecured 
              and you get your deposit back.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <CreditCard className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">Build Credit</h4>
                <p className="text-sm text-gray-400">Reports to all 3 bureaus</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Graduate</h4>
                <p className="text-sm text-gray-400">Convert to unsecured after 6-18 months</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Get Deposit Back</h4>
                <p className="text-sm text-gray-400">Refunded when you graduate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardHeader>
            <CardTitle className="text-white">Recommended Secured Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedCards.map((card, idx) => (
                <div key={idx} className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-bold text-white mb-2">{card.name}</h3>
                  <p className="text-sm text-gray-400 mb-3">Min. Deposit: ${card.minDeposit}</p>
                  <ul className="space-y-1 mb-3">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-[#D4AF37]">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500">Typical graduation: {card.graduationTime}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Add Secured Card</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bank/Card Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Discover it Secured"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Deposit Amount *</label>
                  <input
                    type="number"
                    required
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({ ...formData, deposit_amount: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Credit Limit *</label>
                  <input
                    type="number"
                    required
                    value={formData.credit_limit}
                    onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Open Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.open_date}
                    onChange={(e) => setFormData({ ...formData, open_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Expected Graduation (Months)</label>
                  <input
                    type="number"
                    value={formData.graduation_timeline}
                    onChange={(e) => setFormData({ ...formData, graduation_timeline: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Status</label>
                  <select
                    value={formData.current_status}
                    onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="secured">Secured</option>
                    <option value="graduated">Graduated</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-white mb-4">
                    <input
                      type="checkbox"
                      checked={formData.graduated}
                      onChange={(e) => setFormData({ ...formData, graduated: e.target.checked })}
                      className="w-4 h-4"
                    />
                    Has Graduated to Unsecured
                  </label>

                  {formData.graduated && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Graduation Date</label>
                      <input
                        type="date"
                        value={formData.graduation_date}
                        onChange={(e) => setFormData({ ...formData, graduation_date: e.target.value })}
                        className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    Add Card
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {cards.length === 0 ? (
            <Card className="md:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Secured Cards Tracked</h3>
                <p className="text-gray-400 mb-6">Start tracking your secured cards to plan graduation</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  Add First Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            cards.map((card) => {
              const data = card.input_data;
              const progress = card.output_data;

              return (
                <Card key={card.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{data.bank_name}</h3>
                        <p className="text-sm text-gray-400">
                          Opened: {new Date(data.open_date).toLocaleDateString()}
                        </p>
                      </div>
                      {data.graduated && (
                        <span className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-xs font-bold text-green-400">
                          GRADUATED
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Deposit</p>
                        <p className="text-lg font-bold text-white">
                          ${parseFloat(data.deposit_amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Credit Limit</p>
                        <p className="text-lg font-bold text-white">
                          ${parseFloat(data.credit_limit).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Graduation Progress</span>
                        <span className="text-sm font-bold text-[#D4AF37]">
                          {progress.progressPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-[#D4AF37] h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, progress.progressPercent)}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-[#D4AF37]" />
                        <p className="text-sm font-bold text-white">
                          {progress.monthsOpen} months open
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">{progress.nextMilestone}</p>
                    </div>

                    {data.notes && (
                      <div className="mt-4 p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Notes:</p>
                        <p className="text-sm text-gray-300">{data.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Graduation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Perfect Payment History</h4>
                <p className="text-sm text-gray-400">Never miss a payment - set up autopay</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Low Utilization</h4>
                <p className="text-sm text-gray-400">Keep balance under 10% of limit</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Request Graduation</h4>
                <p className="text-sm text-gray-400">Proactively call to request after 6-12 months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}