import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  DollarSign, Plus, Edit2, Trash2, TrendingUp, TrendingDown,
  Calendar, Percent, ArrowLeft, Download, Save, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDebt, setEditingDebt] = useState(null);
  const [user, setUser] = useState(null);
  const [strategy, setStrategy] = useState('avalanche');
  const [extraPayment, setExtraPayment] = useState(0);
  const [scenarios, setScenarios] = useState([]);

  const [formData, setFormData] = useState({
    account_name: '',
    debt_type: 'credit_card',
    current_balance: '',
    interest_rate: '',
    minimum_payment: '',
    payment_strategy: 'avalanche',
    priority_order: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userDebts = await base44.entities.DebtAccount.filter({ user_id: currentUser.id });
      setDebts(userDebts);
      const userScenarios = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'debt_payoff'
      });
      setScenarios(userScenarios);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const debtData = {
        ...formData,
        user_id: user.id,
        current_balance: parseFloat(formData.current_balance),
        interest_rate: parseFloat(formData.interest_rate),
        minimum_payment: parseFloat(formData.minimum_payment),
        priority_order: parseInt(formData.priority_order)
      };

      if (editingDebt) {
        await base44.entities.DebtAccount.update(editingDebt.id, debtData);
      } else {
        await base44.entities.DebtAccount.create(debtData);
      }

      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving debt:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this debt account?')) {
      await base44.entities.DebtAccount.delete(id);
      await loadData();
    }
  };

  const handleEdit = (debt) => {
    setEditingDebt(debt);
    setFormData({
      account_name: debt.account_name,
      debt_type: debt.debt_type,
      current_balance: debt.current_balance,
      interest_rate: debt.interest_rate,
      minimum_payment: debt.minimum_payment,
      payment_strategy: debt.payment_strategy,
      priority_order: debt.priority_order || 0
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      account_name: '',
      debt_type: 'credit_card',
      current_balance: '',
      interest_rate: '',
      minimum_payment: '',
      payment_strategy: 'avalanche',
      priority_order: 0
    });
    setEditingDebt(null);
    setShowAddForm(false);
  };

  const calculatePayoffPlan = () => {
    let sortedDebts = [...debts];
    
    if (strategy === 'snowball') {
      sortedDebts.sort((a, b) => a.current_balance - b.current_balance);
    } else if (strategy === 'avalanche') {
      sortedDebts.sort((a, b) => b.interest_rate - a.interest_rate);
    } else {
      sortedDebts.sort((a, b) => (a.priority_order || 0) - (b.priority_order || 0));
    }

    const totalMinimum = debts.reduce((sum, d) => sum + d.minimum_payment, 0);
    const totalPayment = totalMinimum + parseFloat(extraPayment || 0);
    
    let results = [];
    let runningDebts = sortedDebts.map(d => ({ ...d, remaining: d.current_balance }));
    let month = 0;
    let totalInterestPaid = 0;

    while (runningDebts.some(d => d.remaining > 0) && month < 600) {
      month++;
      let availableExtra = parseFloat(extraPayment || 0);

      runningDebts = runningDebts.map(debt => {
        if (debt.remaining <= 0) return debt;

        const monthlyRate = debt.interest_rate / 100 / 12;
        const interestCharge = debt.remaining * monthlyRate;
        totalInterestPaid += interestCharge;

        let payment = debt.minimum_payment;
        
        if (debt === runningDebts.find(d => d.remaining > 0)) {
          payment += availableExtra;
          availableExtra = 0;
        }

        const principalPaid = payment - interestCharge;
        const newRemaining = Math.max(0, debt.remaining - principalPaid);

        if (newRemaining === 0 && debt.remaining > 0) {
          results.push({
            name: debt.account_name,
            payoffMonth: month,
            totalPaid: debt.current_balance + interestCharge
          });
        }

        return { ...debt, remaining: newRemaining };
      });
    }

    return {
      payoffMonths: month,
      totalInterestPaid,
      totalPaid: debts.reduce((sum, d) => sum + d.current_balance, 0) + totalInterestPaid,
      debtFreeDate: new Date(Date.now() + month * 30 * 24 * 60 * 60 * 1000),
      details: results
    };
  };

  const saveScenario = async () => {
    const name = prompt('Enter scenario name:');
    if (!name) return;

    const plan = calculatePayoffPlan();
    await base44.entities.CalculatorScenario.create({
      user_id: user.id,
      calculator_type: 'debt_payoff',
      scenario_name: name,
      input_data: { debts, strategy, extraPayment },
      output_data: plan
    });
    await loadData();
  };

  const exportToCSV = () => {
    const plan = calculatePayoffPlan();
    const headers = ['Account Name', 'Type', 'Balance', 'Interest Rate', 'Minimum Payment', 'Payoff Month'];
    const rows = plan.details.map(d => {
      const debt = debts.find(dd => dd.account_name === d.name);
      return [
        d.name,
        debt?.debt_type || '',
        debt?.current_balance || '',
        debt?.interest_rate + '%' || '',
        debt?.minimum_payment || '',
        d.payoffMonth
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debt-payoff-plan-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalDebt = debts.reduce((sum, d) => sum + d.current_balance, 0);
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minimum_payment, 0);
  const avgInterestRate = debts.length > 0 
    ? debts.reduce((sum, d) => sum + d.interest_rate, 0) / debts.length 
    : 0;

  const payoffPlan = debts.length > 0 ? calculatePayoffPlan() : null;

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
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Debt Payoff Calculator</h1>
              <p className="text-gray-400">Create a strategic plan to eliminate debt faster</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveScenario} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save Scenario
              </Button>
              <Button onClick={exportToCSV} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
                <Plus className="w-4 h-4" />
                Add Debt
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalDebt.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">{debts.length} accounts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Monthly Minimum</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">${totalMinPayment.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">required payment</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Avg Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-400">{avgInterestRate.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 mt-1">across all debts</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Debt-Free Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {payoffPlan ? payoffPlan.debtFreeDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </div>
              <p className="text-xs text-gray-500 mt-1">{payoffPlan ? payoffPlan.payoffMonths : 0} months</p>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Selector */}
        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Payoff Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Strategy</label>
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                >
                  <option value="avalanche">Avalanche (Highest Interest First)</option>
                  <option value="snowball">Snowball (Lowest Balance First)</option>
                  <option value="custom">Custom Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Extra Monthly Payment</label>
                <input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="0"
                />
              </div>
            </div>
            {payoffPlan && (
              <div className="mt-6 p-4 bg-black/50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-400">Total Interest</p>
                    <p className="text-2xl font-bold text-red-400">${payoffPlan.totalInterestPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Paid</p>
                    <p className="text-2xl font-bold text-white">${payoffPlan.totalPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Payoff Time</p>
                    <p className="text-2xl font-bold text-green-500">{payoffPlan.payoffMonths} months</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
            <CardHeader>
              <CardTitle className="text-white">{editingDebt ? 'Edit Debt' : 'Add New Debt'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Account Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="e.g. Chase Credit Card"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Debt Type *</label>
                  <select
                    value={formData.debt_type}
                    onChange={(e) => setFormData({ ...formData, debt_type: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="personal_loan">Personal Loan</option>
                    <option value="auto_loan">Auto Loan</option>
                    <option value="student_loan">Student Loan</option>
                    <option value="medical">Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Current Balance *</label>
                  <input
                    type="number"
                    required
                    value={formData.current_balance}
                    onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="5000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Interest Rate (APR %) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.interest_rate}
                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="18.99"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Minimum Payment *</label>
                  <input
                    type="number"
                    required
                    value={formData.minimum_payment}
                    onChange={(e) => setFormData({ ...formData, minimum_payment: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="150"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Priority Order (for custom)</label>
                  <input
                    type="number"
                    value={formData.priority_order}
                    onChange={(e) => setFormData({ ...formData, priority_order: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2 flex gap-3">
                  <Button type="submit" className="bg-[#D4AF37] hover:bg-[#C4A137]">
                    {editingDebt ? 'Update Debt' : 'Add Debt'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Debts List */}
        <div className="space-y-4">
          {debts.length === 0 ? (
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardContent className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Debts Tracked</h3>
                <p className="text-gray-400 mb-6">Add your debts to create a payoff plan</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Debt
                </Button>
              </CardContent>
            </Card>
          ) : (
            debts.map((debt, idx) => {
              const monthlyInterest = (debt.current_balance * (debt.interest_rate / 100)) / 12;
              const payoffInfo = payoffPlan?.details.find(d => d.name === debt.account_name);

              return (
                <Card key={debt.id} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{debt.account_name}</h3>
                          <p className="text-sm text-gray-400">{debt.debt_type.replace('_', ' ').toUpperCase()}</p>
                          {payoffInfo && (
                            <p className="text-sm text-green-500 mt-1">Paid off in month {payoffInfo.payoffMonth}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(debt)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(debt.id)}>
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Balance</p>
                        <p className="text-lg font-bold text-white">${debt.current_balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                        <p className="text-lg font-bold text-red-400">{debt.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Minimum Payment</p>
                        <p className="text-lg font-bold text-white">${debt.minimum_payment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Monthly Interest</p>
                        <p className="text-lg font-bold text-orange-400">${monthlyInterest.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (
          <Card className="mt-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Saved Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scenarios.map(scenario => (
                  <div key={scenario.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">{scenario.scenario_name}</h4>
                        <p className="text-sm text-gray-400">
                          Created {new Date(scenario.created_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Payoff: {scenario.output_data?.payoffMonths} months</p>
                        <p className="text-sm text-green-500">
                          Debt-free: {new Date(scenario.output_data?.debtFreeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}