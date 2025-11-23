import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  DollarSign, Plus, ArrowLeft, Download, TrendingUp, TrendingDown, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BudgetPlanner() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [budgetData, setBudgetData] = useState(null);

  const categories = [
    { id: 'housing', name: 'Housing', recommended: 30, icon: '🏠' },
    { id: 'transportation', name: 'Transportation', recommended: 15, icon: '🚗' },
    { id: 'food', name: 'Food & Groceries', recommended: 12, icon: '🍽️' },
    { id: 'utilities', name: 'Utilities', recommended: 5, icon: '⚡' },
    { id: 'insurance', name: 'Insurance', recommended: 10, icon: '🛡️' },
    { id: 'healthcare', name: 'Healthcare', recommended: 8, icon: '🏥' },
    { id: 'debt', name: 'Debt Payments', recommended: 10, icon: '💳' },
    { id: 'savings', name: 'Savings', recommended: 20, icon: '💰' },
    { id: 'entertainment', name: 'Entertainment', recommended: 5, icon: '🎮' },
    { id: 'other', name: 'Other', recommended: 5, icon: '📦' }
  ];

  const [expenses, setExpenses] = useState(
    categories.reduce((acc, cat) => {
      acc[cat.id] = Array(24).fill('');
      return acc;
    }, {})
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const savedBudget = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'budget_planner'
      });

      if (savedBudget.length > 0) {
        const data = savedBudget[0].input_data;
        setMonthlyIncome(data.monthlyIncome);
        setExpenses(data.expenses);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBudget = async () => {
    try {
      const budgetData = {
        user_id: user.id,
        calculator_type: 'budget_planner',
        scenario_name: `Budget Plan - ${new Date().toLocaleDateString()}`,
        input_data: {
          monthlyIncome,
          expenses
        },
        output_data: calculateSummary()
      };

      const existing = await base44.entities.CalculatorScenario.filter({
        user_id: user.id,
        calculator_type: 'budget_planner'
      });

      if (existing.length > 0) {
        await base44.entities.CalculatorScenario.update(existing[0].id, budgetData);
      } else {
        await base44.entities.CalculatorScenario.create(budgetData);
      }

      alert('Budget saved successfully!');
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleExpenseChange = (categoryId, monthIndex, value) => {
    setExpenses(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].map((v, i) => i === monthIndex ? value : v)
    }));
  };

  const calculateSummary = () => {
    const income = parseFloat(monthlyIncome) || 0;
    const monthExpenses = {};
    
    for (let i = 0; i < 24; i++) {
      let total = 0;
      categories.forEach(cat => {
        total += parseFloat(expenses[cat.id][i]) || 0;
      });
      monthExpenses[i] = total;
    }

    const avgMonthlyExpenses = Object.values(monthExpenses).reduce((a, b) => a + b, 0) / 24;
    const avgMonthlySavings = income - avgMonthlyExpenses;

    return {
      avgMonthlyExpenses,
      avgMonthlySavings,
      totalSavings24Months: avgMonthlySavings * 24,
      monthExpenses
    };
  };

  const summary = calculateSummary();
  const currentMonthExpenses = summary.monthExpenses[currentMonth] || 0;
  const currentMonthSavings = (parseFloat(monthlyIncome) || 0) - currentMonthExpenses;

  const exportBudget = () => {
    const income = parseFloat(monthlyIncome) || 0;
    let csv = 'Category,' + Array.from({length: 24}, (_, i) => `Month ${i + 1}`).join(',') + ',Average\n';
    
    categories.forEach(cat => {
      const row = [cat.name];
      const values = expenses[cat.id].map(v => parseFloat(v) || 0);
      row.push(...values);
      const avg = values.reduce((a, b) => a + b, 0) / 24;
      row.push(avg.toFixed(2));
      csv += row.join(',') + '\n';
    });

    csv += '\nTotals\n';
    csv += 'Monthly Income,' + Array(24).fill(income).join(',') + ',' + income + '\n';
    
    const totalsRow = ['Total Expenses'];
    for (let i = 0; i < 24; i++) {
      totalsRow.push(summary.monthExpenses[i].toFixed(2));
    }
    totalsRow.push(summary.avgMonthlyExpenses.toFixed(2));
    csv += totalsRow.join(',') + '\n';

    const savingsRow = ['Net Savings'];
    for (let i = 0; i < 24; i++) {
      savingsRow.push((income - summary.monthExpenses[i]).toFixed(2));
    }
    savingsRow.push(summary.avgMonthlySavings.toFixed(2));
    csv += savingsRow.join(',') + '\n';

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-plan-24months-${new Date().toISOString().split('T')[0]}.csv`;
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
              <h1 className="text-4xl font-bold text-white mb-2">24-Month Budget Planner</h1>
              <p className="text-gray-400">Plan your finances across 2 years with detailed monthly breakdowns</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportBudget} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button onClick={saveBudget} className="bg-[#D4AF37] hover:bg-[#C4A137]">
                Save Budget
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Monthly Income</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white text-2xl font-bold"
                placeholder="5000"
              />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Current Month Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                ${currentMonthExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">Current Month Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                currentMonthSavings >= 0 ? 'text-green-500' : 'text-red-400'
              }`}>
                ${currentMonthSavings.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-sm text-gray-400">24-Month Total Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                summary.totalSavings24Months >= 0 ? 'text-green-500' : 'text-red-400'
              }`}>
                ${summary.totalSavings24Months.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Viewing: Month {currentMonth + 1}
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
                  disabled={currentMonth === 0}
                >
                  ← Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCurrentMonth(Math.min(23, currentMonth + 1))}
                  disabled={currentMonth === 23}
                >
                  Next →
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {categories.map((category) => {
                const value = expenses[category.id][currentMonth];
                const numValue = parseFloat(value) || 0;
                const income = parseFloat(monthlyIncome) || 0;
                const percentOfIncome = income > 0 ? (numValue / income) * 100 : 0;
                const isOverBudget = percentOfIncome > category.recommended;

                return (
                  <div key={category.id} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h4 className="font-bold text-white">{category.name}</h4>
                          <p className="text-xs text-gray-500">
                            Recommended: {category.recommended}% (${((income * category.recommended) / 100).toFixed(0)})
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => handleExpenseChange(category.id, currentMonth, e.target.value)}
                          className="w-32 px-3 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white text-right"
                          placeholder="0"
                        />
                        {numValue > 0 && (
                          <p className={`text-xs mt-1 ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>
                            {percentOfIncome.toFixed(1)}% of income
                          </p>
                        )}
                      </div>
                    </div>
                    {isOverBudget && (
                      <div className="text-xs text-red-400 mt-2">
                        ⚠️ Over recommended budget
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">Budget Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">50/30/20 Rule</h4>
                <p className="text-sm text-gray-400">50% needs, 30% wants, 20% savings</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Track Everything</h4>
                <p className="text-sm text-gray-400">Include all expenses, even small ones</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Review Monthly</h4>
                <p className="text-sm text-gray-400">Adjust your plan as life changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}