import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  Home, ArrowLeft, CheckCircle, XCircle, DollarSign, TrendingUp, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DSCRPrepSheet() {
  const [propertyPrice, setPropertyPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [propertyTax, setPropertyTax] = useState('');
  const [insurance, setInsurance] = useState('');
  const [hoa, setHoa] = useState('0');
  const [maintenance, setMaintenance] = useState('');
  const [vacancy, setVacancy] = useState('8');

  const [results, setResults] = useState(null);

  const calculateDSCR = () => {
    const price = parseFloat(propertyPrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const term = parseInt(loanTerm) * 12;
    const rent = parseFloat(monthlyRent);
    const tax = parseFloat(propertyTax);
    const ins = parseFloat(insurance);
    const hoaFee = parseFloat(hoa) || 0;
    const maint = parseFloat(maintenance);
    const vac = parseFloat(vacancy) / 100;

    if (!price || !down || !rate || !rent || !tax || !ins || !maint) {
      alert('Please fill in all required fields');
      return;
    }

    const loanAmount = price - down;
    
    // Calculate monthly mortgage payment (P&I)
    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    
    // Calculate effective rental income (accounting for vacancy)
    const effectiveRentalIncome = rent * (1 - vac);
    
    // Calculate total monthly expenses (PITIA + maintenance)
    const totalExpenses = monthlyPayment + tax + ins + hoaFee + maint;
    
    // Calculate DSCR
    const dscr = effectiveRentalIncome / totalExpenses;
    
    // Calculate annual figures
    const annualRent = effectiveRentalIncome * 12;
    const annualExpenses = totalExpenses * 12;
    const annualCashFlow = annualRent - annualExpenses;
    const cashOnCashReturn = (annualCashFlow / down) * 100;

    // Determine qualification
    let qualification = '';
    let qualifies = false;
    let recommendations = [];

    if (dscr >= 1.25) {
      qualification = 'EXCELLENT - Strong qualification';
      qualifies = true;
      recommendations.push('You exceed typical DSCR requirements');
      recommendations.push('Strong position for loan approval');
    } else if (dscr >= 1.0) {
      qualification = 'GOOD - Meets minimum requirements';
      qualifies = true;
      recommendations.push('You meet the 1.0 DSCR minimum');
      recommendations.push('Consider increasing rent or reducing debt');
    } else if (dscr >= 0.75) {
      qualification = 'MARGINAL - May need adjustments';
      qualifies = false;
      recommendations.push('Increase down payment to reduce loan amount');
      recommendations.push('Negotiate higher rent if possible');
      recommendations.push('Consider properties with lower expenses');
    } else {
      qualification = 'DOES NOT QUALIFY';
      qualifies = false;
      recommendations.push('Property does not meet DSCR requirements');
      recommendations.push('Increase rent by at least $' + Math.ceil((totalExpenses * 1.0 - effectiveRentalIncome)));
      recommendations.push('Or increase down payment significantly');
    }

    // Required DSCR scenarios
    const requiredFor1_0 = totalExpenses * 1.0;
    const requiredFor1_25 = totalExpenses * 1.25;

    setResults({
      loanAmount,
      monthlyPayment,
      effectiveRentalIncome,
      totalExpenses,
      dscr,
      annualRent,
      annualExpenses,
      annualCashFlow,
      cashOnCashReturn,
      qualification,
      qualifies,
      recommendations,
      requiredFor1_0,
      requiredFor1_25,
      downPaymentPercent: (down / price) * 100
    });
  };

  const exportReport = () => {
    if (!results) return;

    const report = `DSCR LOAN PREPARATION ANALYSIS
Generated: ${new Date().toLocaleDateString()}

PROPERTY INFORMATION
Purchase Price: $${parseFloat(propertyPrice).toLocaleString()}
Down Payment: $${parseFloat(downPayment).toLocaleString()} (${results.downPaymentPercent.toFixed(1)}%)
Loan Amount: $${results.loanAmount.toLocaleString()}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years

INCOME
Monthly Rent: $${parseFloat(monthlyRent).toLocaleString()}
Vacancy Rate: ${vacancy}%
Effective Rental Income: $${results.effectiveRentalIncome.toLocaleString()}/mo
Annual Rental Income: $${results.annualRent.toLocaleString()}

EXPENSES
Principal & Interest: $${results.monthlyPayment.toLocaleString()}/mo
Property Tax: $${parseFloat(propertyTax).toLocaleString()}/mo
Insurance: $${parseFloat(insurance).toLocaleString()}/mo
HOA: $${parseFloat(hoa || 0).toLocaleString()}/mo
Maintenance: $${parseFloat(maintenance).toLocaleString()}/mo
Total Monthly Expenses: $${results.totalExpenses.toLocaleString()}
Annual Expenses: $${results.annualExpenses.toLocaleString()}

DSCR ANALYSIS
Debt Service Coverage Ratio: ${results.dscr.toFixed(3)}
Qualification Status: ${results.qualification}
${results.qualifies ? '✓ QUALIFIES' : '✗ DOES NOT QUALIFY'}

CASH FLOW ANALYSIS
Monthly Cash Flow: $${(results.effectiveRentalIncome - results.totalExpenses).toLocaleString()}
Annual Cash Flow: $${results.annualCashFlow.toLocaleString()}
Cash-on-Cash Return: ${results.cashOnCashReturn.toFixed(2)}%

DSCR REQUIREMENTS
For 1.0 DSCR: Need $${results.requiredFor1_0.toLocaleString()}/mo income
For 1.25 DSCR: Need $${results.requiredFor1_25.toLocaleString()}/mo income

RECOMMENDATIONS
${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---
This analysis is for estimation purposes only. Consult with a lender for accurate loan terms.`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dscr-analysis-${new Date().toISOString().split('T')[0]}.txt`;
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
            <h1 className="text-4xl font-bold text-white mb-2">DSCR Loan Prep Sheet</h1>
            <p className="text-gray-400">Calculate Debt Service Coverage Ratio for investment property loans</p>
          </div>
        </div>

        <Card className="mb-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">What is a DSCR Loan?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Debt Service Coverage Ratio (DSCR) loans are investor-friendly mortgages that qualify you based on 
              the rental income of the property, NOT your personal income. Ideal for investors with multiple properties 
              or self-employed individuals.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-black/30 rounded-lg">
                <Home className="w-6 h-6 text-[#D4AF37] mb-2" />
                <h4 className="font-bold text-white mb-1">No Income Docs</h4>
                <p className="text-sm text-gray-400">No tax returns or W2s required</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Property-Based</h4>
                <p className="text-sm text-gray-400">Qualifies on rental income</p>
              </div>
              <div className="p-4 bg-black/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
                <h4 className="font-bold text-white mb-1">Typical Requirement</h4>
                <p className="text-sm text-gray-400">1.0-1.25 DSCR minimum</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Property & Loan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Purchase Price *</label>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="300000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Down Payment *</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="60000"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Interest Rate (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="7.5"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Loan Term (Years)</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                >
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h3 className="text-white font-bold mb-4">Income & Expenses</h3>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Rent *</label>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="2500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Vacancy Rate (%)</label>
                <input
                  type="number"
                  value={vacancy}
                  onChange={(e) => setVacancy(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="8"
                />
                <p className="text-xs text-gray-500 mt-1">Typical: 5-10%</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Property Tax *</label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="300"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Insurance *</label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="150"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly HOA</label>
                <input
                  type="number"
                  value={hoa}
                  onChange={(e) => setHoa(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Maintenance *</label>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  className="w-full px-4 py-2 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  placeholder="200"
                />
                <p className="text-xs text-gray-500 mt-1">Typical: 1% of property value annually</p>
              </div>

              <Button onClick={calculateDSCR} className="w-full bg-[#D4AF37] hover:bg-[#C4A137]">
                Calculate DSCR
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {!results ? (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-16">
                  <Home className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Fill out the form to calculate DSCR</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className={`bg-gradient-to-br border-2 ${
                  results.qualifies
                    ? 'from-green-500/10 to-transparent border-green-500/50'
                    : 'from-red-500/10 to-transparent border-red-500/50'
                }`}>
                  <CardHeader>
                    <CardTitle className="text-white">DSCR Result</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold text-[#D4AF37] mb-2">
                        {results.dscr.toFixed(3)}
                      </div>
                      <p className="text-gray-400">Debt Service Coverage Ratio</p>
                    </div>

                    <div className={`p-4 rounded-lg border ${
                      results.qualifies
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        {results.qualifies ? (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-white mb-1">{results.qualification}</p>
                          <p className="text-sm text-gray-300">
                            {results.qualifies 
                              ? 'This property meets DSCR loan requirements'
                              : 'This property does not meet DSCR requirements'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Effective Rent Income</span>
                      <span className="text-white font-bold">${results.effectiveRentalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Mortgage Payment (P&I)</span>
                      <span className="text-red-400">-${results.monthlyPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Total Expenses</span>
                      <span className="text-red-400">-${results.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
                      <span className="text-white font-bold">Monthly Cash Flow</span>
                      <span className={`font-bold ${
                        results.effectiveRentalIncome - results.totalExpenses >= 0 ? 'text-green-500' : 'text-red-400'
                      }`}>
                        ${(results.effectiveRentalIncome - results.totalExpenses).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Annual Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Annual Cash Flow</span>
                      <span className={`font-bold ${
                        results.annualCashFlow >= 0 ? 'text-green-500' : 'text-red-400'
                      }`}>
                        ${results.annualCashFlow.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400">Cash-on-Cash Return</span>
                      <span className={`font-bold ${
                        results.cashOnCashReturn >= 0 ? 'text-green-500' : 'text-red-400'
                      }`}>
                        {results.cashOnCashReturn.toFixed(2)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-[#D4AF37] mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                    <Button onClick={exportReport} variant="outline" className="w-full mt-6 gap-2">
                      <Download className="w-4 h-4" />
                      Export Full Report
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        <Card className="mt-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
          <CardHeader>
            <CardTitle className="text-white">DSCR Loan Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-white mb-2">1.0 Minimum</h4>
                <p className="text-sm text-gray-400">Most lenders require 1.0 DSCR minimum</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">1.25 Ideal</h4>
                <p className="text-sm text-gray-400">1.25+ DSCR gets better rates</p>
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">20-25% Down</h4>
                <p className="text-sm text-gray-400">Higher down payment improves DSCR</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}