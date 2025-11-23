import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  AlertTriangle, ArrowLeft, CheckCircle, Clock, Download, Calendar, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LatePaymentStrategy() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latePayments, setLatePayments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    creditor: '',
    account_number: '',
    late_date: '',
    days_late: '',
    amount: '',
    status: 'on_report',
    strategy: 'goodwill',
    attempted_removal: false,
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const userPayments = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'late_payment_strategy'
      });
      setLatePayments(userPayments);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = {
        user_id: user.id,
        calculator_type: 'late_payment_strategy',
        scenario_name: `${formData.creditor} - ${formData.late_date}`,
        input_data: formData,
        output_data: generateStrategy(formData)
      };

      await base44.entities.CalculatorScenario.create(paymentData);
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  };

  const generateStrategy = (payment) => {
    const daysLate = parseInt(payment.days_late);
    const monthsSince = payment.late_date ? 
      Math.floor((new Date() - new Date(payment.late_date)) / (1000 * 60 * 60 * 24 * 30)) : 0;

    let recommendations = [];
    let priority = 'medium';
    let approachType = '';

    // Determine strategy based on days late and time passed
    if (daysLate <= 30) {
      priority = 'high';
      approachType = 'Goodwill Letter';
      recommendations = [
        'Write a goodwill letter explaining the situation',
        'Emphasize your otherwise perfect payment history',
        'Explain the one-time circumstance that caused the late payment',
        'Request removal as a gesture of goodwill',
        'Send via certified mail with return receipt'
      ];
    } else if (daysLate <= 60) {
      priority = 'high';
      approachType = 'Executive Contact + Goodwill';
      recommendations = [
        'Start with goodwill letter to executive office',
        'Call customer retention department',
        'Emphasize your loyalty and payment history',
        'Offer to set up autopay to prevent future issues',
        'Be persistent - may require multiple attempts'
      ];
    } else if (daysLate > 60) {
      priority = 'medium';
      approachType = 'Dispute + Pay for Delete';
      recommendations = [
        'Dispute with credit bureaus if any inaccuracies exist',
        'Negotiate pay-for-delete if balance remains',
        'Request Method of Verification from bureaus',
        'Consider goodwill letter after 2+ years of perfect payments',
        'Focus on building new positive history'
      ];
    }

    // Add time-based recommendations
    if (monthsSince >= 24) {
      recommendations.push('Late payment impact decreases after 2 years');
      recommendations.push('Continue building positive payment history');
    }

    if (monthsSince >= 84) {
      recommendations.push('Payment will automatically fall off at 7 years');
      priority = 'low';
    }

    return {
      priority,
      approachType,
      recommendations,
      monthsSince,
      yearsUntilRemoval: Math.max(0, 7 - (monthsSince / 12))
    };
  };

  const resetForm = () => {
    setFormData({
      creditor: '',
      account_number: '',
      late_date: '',
      days_late: '',
      amount: '',
      status: 'on_report',
      strategy: 'goodwill',
      attempted_removal: false,
      notes: ''
    });
    setShowAddForm(false);
  };

  const exportStrategy = () => {
    const report = `LATE PAYMENT REMOVAL STRATEGY
Generated: ${new Date().toLocaleDateString()}

TRACKED LATE PAYMENTS
${'='.repeat(60)}

${latePayments.map((payment, idx) => {
  const data = payment.input_data;
  const strategy = payment.output_data;
  return `
${idx + 1}. ${data.creditor}
   Account: ${data.account_number}
   Late Date: ${data.late_date}
   Days Late: ${data.days_late}
   Months Since: ${strategy.monthsSince}
   Priority: ${strategy.priority.toUpperCase()}
   Approach: ${strategy.approachType}
   
   RECOMMENDED ACTIONS:
   ${strategy.recommendations.map((r, i) => `   ${i + 1}. ${r}`).join('\n')}
   
   Status: ${data.status}
   ${data.notes ? `Notes: ${data.notes}` : ''}
${'='.repeat(60)}`;
}).join('\n')}

GENERAL TIPS:
- Always remain polite and professional in communications
- Document all attempts and responses
- Send goodwill letters via certified mail
- Be persistent - may require 2-3 attempts
- Consider timing (after building positive history)

This strategy is for educational purposes. Results may vary.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `late-payment-strategy-${new Date().toISOString().split('T')[0]}.txt`;
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
              <h1 className="text-4xl font-bold text-white mb-2">Late Payment Strategy Sheet</h1>
              <p className="text-gray-400">Strategic planning for late payment removal and credit repair</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportStrategy} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Strategy
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                Add Late Payment
              </Button>
            </div>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Late Payment Removal Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-black/30 rounded-lg">
                <Mail className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">Goodwill Letters</h4>
                <p className="text-sm text-gray-400">Best for 30-day lates with good history</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Dispute Process</h4>
                <p className="text-sm text-gray-400">For inaccuracies or 60+ day lates</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Time-Based</h4>
                <p className="text-sm text-gray-400">Late payments fall off after 7 years</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">Add Late Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Creditor *</label>
                  <input
                    type="text"
                    required
                    value={formData.creditor}
                    onChange={(e) => setFormData({ ...formData, creditor: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Account Number (Last 4)</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="1234"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Late Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.late_date}
                    onChange={(e) => setFormData({ ...formData, late_date: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Days Late *</label>
                  <select
                    required
                    value={formData.days_late}
                    onChange={(e) => setFormData({ ...formData, days_late: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="">Select...</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                    <option value="120">120+ Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="on_report">On Report</option>
                    <option value="removed">Removed</option>
                    <option value="in_dispute">In Dispute</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    rows="2"
                    placeholder="Any additional context or attempts made..."
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    Generate Strategy
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {latePayments.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Late Payments Tracked</h3>
                <p className="text-gray-400 mb-6">Add late payments to generate removal strategies</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  Add First Late Payment
                </Button>
              </CardContent>
            </Card>
          ) : (
            latePayments.map((payment) => {
              const data = payment.input_data;
              const strategy = payment.output_data;
              
              const priorityColors = {
                high: 'border-red-500/50 bg-red-500/10',
                medium: 'border-yellow-500/50 bg-yellow-500/10',
                low: 'border-blue-500/50 bg-blue-500/10'
              };

              return (
                <Card key={payment.id} className={`bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 ${priorityColors[strategy.priority]}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{data.creditor}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            strategy.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            strategy.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {strategy.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Late: {data.days_late} days</span>
                          <span>•</span>
                          <span>{strategy.monthsSince} months ago</span>
                          <span>•</span>
                          <span>{strategy.yearsUntilRemoval.toFixed(1)} years until auto-removal</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded text-xs font-medium ${
                          data.status === 'removed' ? 'bg-green-500/20 text-green-400' :
                          data.status === 'in_dispute' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-white/10 text-gray-400'
                        }`}>
                          {data.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <h4 className="font-bold text-white mb-2">Recommended Approach: {strategy.approachType}</h4>
                      <ul className="space-y-2">
                        {strategy.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {data.notes && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Notes:</p>
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
            <CardTitle className="text-white">Late Payment Removal Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">Timing Matters</h4>
                <p className="text-sm text-gray-400">Wait 6-12 months of perfect payments before goodwill attempts</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Be Persistent</h4>
                <p className="text-sm text-gray-400">May require 2-3 attempts with different approaches</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Professional Tone</h4>
                <p className="text-sm text-gray-400">Always remain polite and take responsibility</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}