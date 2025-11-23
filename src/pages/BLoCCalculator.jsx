import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import {
  Calculator, ArrowLeft, Download, Save, DollarSign,
  TrendingUp, Building2, Award, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BLoCCalculator() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);

  const [inputs, setInputs] = useState({
    annual_revenue: '',
    months_in_business: '',
    personal_credit_score: '',
    business_credit_score: '',
    existing_debt: '',
    cash_flow: '',
    industry: 'general'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      const userScenarios = await base44.entities.CalculatorScenario.filter({
        user_id: currentUser.id,
        calculator_type: 'bloc'
      });
      setScenarios(userScenarios);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateBLoC = () => {
    const revenue = parseFloat(inputs.annual_revenue) || 0;
    const monthsInBusiness = parseInt(inputs.months_in_business) || 0;
    const personalScore = parseInt(inputs.personal_credit_score) || 0;
    const businessScore = parseInt(inputs.business_credit_score) || 0;
    const existingDebt = parseFloat(inputs.existing_debt) || 0;
    const cashFlow = parseFloat(inputs.cash_flow) || 0;

    if (revenue === 0) return null;

    // Base BLoC calculation (10-25% of annual revenue)
    let baseBLoC = revenue * 0.15;

    // Credit score multiplier
    let creditMultiplier = 1.0;
    if (personalScore >= 700) creditMultiplier += 0.3;
    else if (personalScore >= 650) creditMultiplier += 0.15;
    else if (personalScore < 600) creditMultiplier -= 0.2;

    if (businessScore >= 80) creditMultiplier += 0.25;
    else if (businessScore >= 70) creditMultiplier += 0.15;

    // Time in business multiplier
    let timeMultiplier = 1.0;
    if (monthsInBusiness >= 24) timeMultiplier = 1.2;
    else if (monthsInBusiness >= 12) timeMultiplier = 1.1;
    else if (monthsInBusiness < 6) timeMultiplier = 0.7;

    // Cash flow adjustment
    let cashFlowMultiplier = 1.0;
    if (cashFlow > revenue * 0.2) cashFlowMultiplier = 1.15;
    else if (cashFlow < revenue * 0.05) cashFlowMultiplier = 0.85;

    // Debt to income
    const debtToIncome = revenue > 0 ? (existingDebt / revenue) : 0;
    let debtMultiplier = 1.0;
    if (debtToIncome < 0.3) debtMultiplier = 1.1;
    else if (debtToIncome > 0.5) debtMultiplier = 0.8;

    const estimatedBLoC = baseBLoC * creditMultiplier * timeMultiplier * cashFlowMultiplier * debtMultiplier;

    // Interest rate estimation
    let interestRate = 12; // base rate
    if (personalScore >= 720) interestRate = 8;
    else if (personalScore >= 680) interestRate = 10;
    else if (personalScore < 600) interestRate = 18;

    // Qualification likelihood
    let qualificationScore = 0;
    if (personalScore >= 650) qualificationScore += 25;
    if (businessScore >= 70) qualificationScore += 25;
    if (monthsInBusiness >= 12) qualificationScore += 20;
    if (debtToIncome < 0.4) qualificationScore += 15;
    if (cashFlow > 0) qualificationScore += 15;

    let likelihood = 'Low';
    if (qualificationScore >= 80) likelihood = 'Excellent';
    else if (qualificationScore >= 60) likelihood = 'Good';
    else if (qualificationScore >= 40) likelihood = 'Fair';

    return {
      estimatedBLoC: Math.round(estimatedBLoC),
      minAmount: Math.round(estimatedBLoC * 0.7),
      maxAmount: Math.round(estimatedBLoC * 1.3),
      estimatedRate: interestRate,
      qualificationLikelihood: likelihood,
      qualificationScore,
      monthlyPayment: Math.round((estimatedBLoC * (interestRate / 100)) / 12),
      recommendations: getRecommendations(inputs, qualificationScore)
    };
  };

  const getRecommendations = (data, score) => {
    const recs = [];
    const personalScore = parseInt(data.personal_credit_score) || 0;
    const businessScore = parseInt(data.business_credit_score) || 0;
    const months = parseInt(data.months_in_business) || 0;

    if (personalScore < 650) recs.push('Improve personal credit to 650+ for better approval odds');
    if (businessScore < 70 && businessScore > 0) recs.push('Build business credit to 70+ Paydex score');
    if (months < 12) recs.push('Wait until 12+ months in business for better terms');
    if (score >= 80) recs.push('You have excellent qualification potential - apply now');
    if (personalScore >= 700 && businessScore >= 75) recs.push('Consider applying for multiple BLoCs to maximize credit');

    return recs;
  };

  const saveScenario = async () => {
    const name = prompt('Enter scenario name:');
    if (!name) return;

    const results = calculateBLoC();
    await base44.entities.CalculatorScenario.create({
      user_id: user.id,
      calculator_type: 'bloc',
      scenario_name: name,
      input_data: inputs,
      output_data: results
    });
    await loadData();
  };

  const loadScenario = (scenario) => {
    setInputs(scenario.input_data);
    setSelectedScenario(scenario);
  };

  const exportToPDF = () => {
    const results = calculateBLoC();
    if (!results) return;

    const content = `
BLoC Calculator Results
Generated: ${new Date().toLocaleDateString()}

INPUTS:
Annual Revenue: $${parseFloat(inputs.annual_revenue).toLocaleString()}
Months in Business: ${inputs.months_in_business}
Personal Credit Score: ${inputs.personal_credit_score}
Business Credit Score: ${inputs.business_credit_score}
Existing Debt: $${parseFloat(inputs.existing_debt || 0).toLocaleString()}
Monthly Cash Flow: $${parseFloat(inputs.cash_flow || 0).toLocaleString()}

RESULTS:
Estimated BLoC Amount: $${results.estimatedBLoC.toLocaleString()}
Range: $${results.minAmount.toLocaleString()} - $${results.maxAmount.toLocaleString()}
Estimated APR: ${results.estimatedRate}%
Qualification Likelihood: ${results.qualificationLikelihood}
Monthly Interest (if fully drawn): ~$${results.monthlyPayment.toLocaleString()}

RECOMMENDATIONS:
${results.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bloc-calculator-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const results = calculateBLoC();

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">BLoC Calculator</h1>
              <p className="text-gray-400">Calculate your Business Line of Credit potential</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={saveScenario} variant="outline" className="gap-2" disabled={!results}>
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2" disabled={!results}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div>
            <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
              <CardHeader>
                <CardTitle className="text-white">Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Annual Revenue *</label>
                  <input
                    type="number"
                    value={inputs.annual_revenue}
                    onChange={(e) => setInputs({ ...inputs, annual_revenue: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="250000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Months in Business</label>
                  <input
                    type="number"
                    value={inputs.months_in_business}
                    onChange={(e) => setInputs({ ...inputs, months_in_business: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="18"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Personal Credit Score</label>
                  <input
                    type="number"
                    min="300"
                    max="850"
                    value={inputs.personal_credit_score}
                    onChange={(e) => setInputs({ ...inputs, personal_credit_score: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="680"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Business Credit Score (Paydex)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.business_credit_score}
                    onChange={(e) => setInputs({ ...inputs, business_credit_score: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="75"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Existing Business Debt</label>
                  <input
                    type="number"
                    value={inputs.existing_debt}
                    onChange={(e) => setInputs({ ...inputs, existing_debt: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="25000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Monthly Cash Flow</label>
                  <input
                    type="number"
                    value={inputs.cash_flow}
                    onChange={(e) => setInputs({ ...inputs, cash_flow: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                    placeholder="15000"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">Industry</label>
                  <select
                    value={inputs.industry}
                    onChange={(e) => setInputs({ ...inputs, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#D4AF37]/20 rounded-lg text-white"
                  >
                    <option value="general">General Business</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="construction">Construction</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="ecommerce">E-commerce</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                <Card className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border-[#D4AF37]/30">
                  <CardHeader>
                    <CardTitle className="text-white">Estimated BLoC Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-[#D4AF37] mb-2">
                        ${results.estimatedBLoC.toLocaleString()}
                      </div>
                      <p className="text-gray-400">
                        Range: ${results.minAmount.toLocaleString()} - ${results.maxAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Est. APR</p>
                        <p className="text-2xl font-bold text-white">{results.estimatedRate}%</p>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Qualification</p>
                        <p className={`text-2xl font-bold ${
                          results.qualificationLikelihood === 'Excellent' ? 'text-green-500' :
                          results.qualificationLikelihood === 'Good' ? 'text-blue-500' :
                          results.qualificationLikelihood === 'Fair' ? 'text-yellow-500' :
                          'text-red-400'
                        }`}>
                          {results.qualificationLikelihood}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Monthly Interest (if fully drawn)</p>
                      <p className="text-xl font-bold text-white">~${results.monthlyPayment.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>

                {results.recommendations.length > 0 && (
                  <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[#D4AF37]" />
                        Recommendations
                      </CardTitle>
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
                    </CardContent>
                  </Card>
                )}

                <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">How BLoC Works</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-400 space-y-2">
                    <p>• Draw funds as needed up to your credit limit</p>
                    <p>• Only pay interest on what you use</p>
                    <p>• Revolving credit - replenishes as you pay back</p>
                    <p>• Flexible terms with no fixed payment schedule</p>
                    <p>• Great for managing cash flow gaps</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
                <CardContent className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Enter Your Information</h3>
                  <p className="text-gray-400">Fill out the form to calculate your BLoC potential</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Saved Scenarios */}
        {scenarios.length > 0 && (
          <Card className="mt-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-[#D4AF37]/20">
            <CardHeader>
              <CardTitle className="text-white">Saved Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {scenarios.map(scenario => (
                  <div
                    key={scenario.id}
                    onClick={() => loadScenario(scenario)}
                    className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37] cursor-pointer transition-all"
                  >
                    <h4 className="font-bold text-white mb-2">{scenario.scenario_name}</h4>
                    <p className="text-sm text-gray-400 mb-1">
                      Amount: ${scenario.output_data?.estimatedBLoC?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(scenario.created_date).toLocaleDateString()}
                    </p>
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