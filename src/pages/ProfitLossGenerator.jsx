import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  TrendingUp, ArrowLeft, Download, Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfitLossGenerator() {
  const [formData, setFormData] = useState({
    businessName: '',
    periodStart: '',
    periodEnd: '',
    revenue: [{ description: 'Sales Revenue', amount: '' }],
    cogs: [{ description: 'Cost of Goods Sold', amount: '' }],
    expenses: [
      { description: 'Rent', amount: '' },
      { description: 'Utilities', amount: '' },
      { description: 'Payroll', amount: '' },
      { description: 'Marketing', amount: '' },
      { description: 'Insurance', amount: '' }
    ]
  });

  const addLine = (category) => {
    setFormData({
      ...formData,
      [category]: [...formData[category], { description: '', amount: '' }]
    });
  };

  const removeLine = (category, index) => {
    setFormData({
      ...formData,
      [category]: formData[category].filter((_, i) => i !== index)
    });
  };

  const updateLine = (category, index, field, value) => {
    const updated = [...formData[category]];
    updated[index][field] = value;
    setFormData({ ...formData, [category]: updated });
  };

  const calculateTotals = () => {
    const totalRevenue = formData.revenue.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalCOGS = formData.cogs.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalExpenses = formData.expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    
    const grossProfit = totalRevenue - totalCOGS;
    const netIncome = grossProfit - totalExpenses;

    return {
      totalRevenue,
      totalCOGS,
      grossProfit,
      totalExpenses,
      netIncome
    };
  };

  const totals = calculateTotals();

  const downloadPL = () => {
    const content = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    PROFIT & LOSS STATEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Business: ${formData.businessName}
Period: ${formData.periodStart} to ${formData.periodEnd}
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REVENUE
${formData.revenue.map(item => 
  `${item.description.padEnd(40)} $${(parseFloat(item.amount) || 0).toFixed(2).padStart(12)}`
).join('\n')}
──────────────────────────────────────────────────────────────
Total Revenue                                    $${totals.totalRevenue.toFixed(2).padStart(12)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COST OF GOODS SOLD
${formData.cogs.map(item => 
  `${item.description.padEnd(40)} $${(parseFloat(item.amount) || 0).toFixed(2).padStart(12)}`
).join('\n')}
──────────────────────────────────────────────────────────────
Total COGS                                       $${totals.totalCOGS.toFixed(2).padStart(12)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GROSS PROFIT                                     $${totals.grossProfit.toFixed(2).padStart(12)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPERATING EXPENSES
${formData.expenses.map(item => 
  `${item.description.padEnd(40)} $${(parseFloat(item.amount) || 0).toFixed(2).padStart(12)}`
).join('\n')}
──────────────────────────────────────────────────────────────
Total Operating Expenses                         $${totals.totalExpenses.toFixed(2).padStart(12)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NET INCOME                                       $${totals.netIncome.toFixed(2).padStart(12)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINANCIAL METRICS
Gross Profit Margin: ${((totals.grossProfit / totals.totalRevenue) * 100).toFixed(1)}%
Net Profit Margin: ${((totals.netIncome / totals.totalRevenue) * 100).toFixed(1)}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This statement is for informational purposes only.
Consult with a certified accountant for official financial statements.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profit-loss-${formData.periodStart}-to-${formData.periodEnd}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Tools')} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Profit & Loss Statement Generator</h1>
            <p className="text-gray-400">Create professional P&L statements for business applications</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Name *</label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="Your Business LLC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Period Start *</label>
                    <input
                      type="date"
                      value={formData.periodStart}
                      onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Period End *</label>
                    <input
                      type="date"
                      value={formData.periodEnd}
                      onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                      className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Revenue</CardTitle>
                  <Button size="sm" onClick={() => addLine('revenue')} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Line
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.revenue.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLine('revenue', idx, 'description', e.target.value)}
                      className="flex-1 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => updateLine('revenue', idx, 'amount', e.target.value)}
                      className="w-32 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0.00"
                    />
                    {formData.revenue.length > 1 && (
                      <Button size="icon" variant="outline" onClick={() => removeLine('revenue', idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Cost of Goods Sold</CardTitle>
                  <Button size="sm" onClick={() => addLine('cogs')} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Line
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.cogs.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLine('cogs', idx, 'description', e.target.value)}
                      className="flex-1 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => updateLine('cogs', idx, 'amount', e.target.value)}
                      className="w-32 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0.00"
                    />
                    {formData.cogs.length > 1 && (
                      <Button size="icon" variant="outline" onClick={() => removeLine('cogs', idx)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Operating Expenses</CardTitle>
                  <Button size="sm" onClick={() => addLine('expenses')} variant="outline" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Line
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.expenses.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLine('expenses', idx, 'description', e.target.value)}
                      className="flex-1 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={item.amount}
                      onChange={(e) => updateLine('expenses', idx, 'amount', e.target.value)}
                      className="w-32 px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                      placeholder="0.00"
                    />
                    <Button size="icon" variant="outline" onClick={() => removeLine('expenses', idx)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
              <CardHeader>
                <CardTitle className="text-white">Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Revenue:</span>
                  <span className="text-white font-bold">${totals.totalRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">COGS:</span>
                  <span className="text-white">-${totals.totalCOGS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/10">
                  <span className="text-gray-400">Gross Profit:</span>
                  <span className="text-green-400 font-bold">${totals.grossProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-400">Operating Expenses:</span>
                  <span className="text-white">-${totals.totalExpenses.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t-2 border-[#D4AF37]/30">
                  <span className="text-white font-bold">Net Income:</span>
                  <span className={`font-bold ${totals.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${totals.netIncome.toFixed(2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-white/10 text-xs space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Gross Margin:</span>
                    <span>{((totals.grossProfit / totals.totalRevenue) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Net Margin:</span>
                    <span>{((totals.netIncome / totals.totalRevenue) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={downloadPL} className="w-full bg-[#D4AF37] hover:bg-[#C4A137] gap-2">
              <Download className="w-4 h-4" />
              Download P&L Statement
            </Button>

            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">P&L Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Use actual financial data from your business</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Match with bank statements and tax returns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Generate monthly or quarterly statements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    <span>Keep records of supporting documentation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}